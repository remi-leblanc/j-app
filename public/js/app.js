$(document).ready(function(){

    var card = $('#card');
    var cardContent = $('#card-content');
    var inputRomaji = $('.answers-row[data-input-type=romaji] input');
    var inputTrad = $('.answers-row[data-input-type=trad] input');
    var result = $('#result');
    var currentDraw = null;
    var isWordComplete = false;
    var completedCount = 0;
    var statsError = 0;
    var startTime;
    var autoTts = true;

    var dbRomajiVal;
    var dbTradVal;

    var oldFontSize = parseFloat(cardContent.css('font-size'));

    if(method == 'speak'){
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'ja-JP';
        recognition.maxAlternatives = 5;
        recognition.onstart = function(){
            if(!isWordComplete){
                $('html').addClass('speaking');
            }
        }
        recognition.onend = function(){
            $('html').removeClass('speaking');
        }
        recognition.onresult = function(event) {
            if(!isWordComplete){
                recognition.abort();
                speakResults = Object.values(event.results[0]).map(result => result.transcript);
                completeWord();
                writeResults();
                var matchedResult = speakResults.find(result => result == db[currentDraw]["kanji"].replace('-', '') || result == db[currentDraw]["kana"].replace('-', ''));
                if(matchedResult !== undefined){
                    answerIsCorrect();
                    result.find('span').addClass('correct');
                    inputRomaji.val(matchedResult);
                } else{
                    statsError++;
                    result.find('span').addClass('error');
                    inputRomaji.val(speakResults[0]);
                }
            }
        }
        $('#next-btn > .clickable').click(function(){
            if(isWordComplete){
                nextWord();
            }
            else{
                recognition.start();
            }
        });
    }

    function rand(){
        if(db.length == 1){
            currentDraw = 0;
            return;
        }
        var nb = Math.floor(Math.random() * db.length);
        
        if(currentDraw != null){
            if(nb == currentDraw || db[nb]["score"]["valid"]){
                rand();
            }
            else{
                currentDraw = nb;
            }
        }
        else{
            currentDraw = nb;
        }
    }

    function resetGame(){
        completedCount = 0;
        statsError = 0;
        currentDraw = null;
        $('#stats-count').text(completedCount);
        for(var i = 0; i < db.length; i++){
            db[i]['score']['valid'] = false;
            db[i]['score']['time'] = 0;
        }
    }

    function draw(){
        $('#answers input').val('');
        inputRomaji.removeClass('error').removeClass('correct').focus();
        inputTrad.removeClass('error').removeClass('correct');
        result.find('span[data-result-type=romaji').removeClass('error').removeClass('correct');
        result.find('span[data-result-type=trad').removeClass('error').removeClass('correct');
        result.removeClass('active');
        card.removeClass('word-complete');
        isWordComplete = false;
        $('html').removeClass('wordComplete');
        if(method == 'speak'){
            recognition.abort();
        }
        
        rand();
        
        dbRomajiVal = [];
        db[currentDraw]["romaji"].forEach(function(romaji, i){
            dbRomajiVal.push(this[i].toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, ""));
        }, db[currentDraw]["romaji"]);

        dbTradVal = [];
        db[currentDraw]["trad"].forEach(function(trad, i){
            dbTradVal.push(this[i].toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, ""));
        }, db[currentDraw]["trad"]);

        if(mode === 'normal' && db[currentDraw]["usually_kana"] && db[currentDraw]["kana"] != null && db[currentDraw]["kana"] != ""){
            cardContent.find('span').text(db[currentDraw]["kana"]);
        }
        else{
            cardContent.find('span').text(db[currentDraw]["kanji"]);
        }
        if(method == 'listen'){
            playTts();
            document.addEventListener('voicesloaded', function(e){
                playTts();
            }, false);
        }
        cardContent.css('font-size', oldFontSize+'px');
        adaptFont();

        $('#word_report_word').val(db[currentDraw]["id"]);

        startTime = new Date();
    }
    
    function finalResults(){
        var totalTime = 0;
        for(var i = 0; i < db.length; i++){
            totalTime = totalTime + db[i]['score']['time'];
        }
        var averageTime = totalTime / db.length;

        $('#stats-error').text(statsError);
        $('#stats-time').text(averageTime.toFixed(1) + 's');

        $('.modal[data-modal=finalres]').addClass('active');
    }

    draw();


    $(document).keydown(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.key);
        if(keycode == '13'){
            if(method != 'speak'){
                var inputRomajiVal = inputRomaji.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "");
                var inputTradVal = inputTrad.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "");
                if(inputRomajiVal != ""){
                    inputTrad.focus();
                }
                if(isWordComplete){
                    nextWord();
                }
                else{
                    if(inputRomajiVal != "" && inputTradVal != ""){
                        completeWord();
                        writeResults();
                        if((dbRomajiVal.includes(inputRomajiVal) && dbTradVal.includes(inputTradVal))){
                            answerIsCorrect();
                        }else{
                            statsError++;
                        }
                        if(!dbRomajiVal.includes(inputRomajiVal)){
                            inputRomaji.addClass('error');
                            result.find('span[data-result-type=romaji]').addClass('error');
                        }else{
                            inputRomaji.addClass('correct');
                            result.find('span[data-result-type=romaji]').addClass('correct');
                        }
                        if(!dbTradVal.includes(inputTradVal)){
                            inputTrad.addClass('error');
                            result.find('span[data-result-type=trad]').addClass('error');
                        }else{
                            inputTrad.addClass('correct');
                            result.find('span[data-result-type=trad]').addClass('correct');
                        }
    
                    }
                }
            }
            else{
                if(isWordComplete){
                    nextWord();
                }
                else{
                    recognition.start();
                }
            }
        }
        if(keycode == '8'){
            if(inputTrad.is(':focus') && inputTrad.val() == '' && method != 'speak'){
                event.preventDefault();
                inputRomaji.focus();
            }
        }
    });

    function writeResults(){
        result.find('span[data-result-type=romaji]').text(db[currentDraw]["romaji"].join(', '));
        result.find('span[data-result-type=trad]').text(db[currentDraw]["trad"].join(', ') + ((db[currentDraw]["info"] !== undefined) ? " ("+db[currentDraw]["info"]+")" : ""));
    }

    function nextWord(){
        if(completedCount != db.length){
            draw();
        }
        else{
            finalResults();
        }
    }
    
    function completeWord(){
        result.addClass('active');
        card.addClass('word-complete');
        isWordComplete = true;
        $('html').addClass('wordComplete');
        if(method != 'listen' && autoTts){
            playTts();
        }
    }
    function answerIsCorrect(){
        completedCount++;
        $('#stats-count').text(completedCount);

        var endTime = new Date();
        var completeTime = (endTime - startTime)/1000;

        db[currentDraw]["score"]["valid"] = true;
        db[currentDraw]["score"]["time"] = completeTime;
    }

    function adaptFont(){
        var cardWidth = card.width();
        var textWidth = cardContent.outerWidth();
        var diff = (textWidth / cardWidth);
        if(diff > 1){
            var newFontSize = oldFontSize * (1 - ((diff * 2.4) / 10));
            cardContent.css('font-size', newFontSize+'px');
        }
    }

    function playTts(){
        if(!window.tts){
            return;
        }
        var text = "";
        if(db[currentDraw]["kana"] != null && db[currentDraw]["kana"] != ""){
            text = db[currentDraw]["kana"];
        }
        else{
            text = db[currentDraw]["kanji"];
        }
        window.tts.text = text;
        speechSynthesis.cancel();
        speechSynthesis.speak(window.tts);
    }

    cardContent.on('mousedown', function (e) {
        e.preventDefault();
        if(isWordComplete || method == 'listen'){
            playTts();
        }
    });

    $('#restart-btn').click(function(){
        $('.modal[data-modal=finalres]').removeClass('active');
        resetGame();
        draw();
    });

    $('#audio-btn').click(function(){
        if(autoTts){
            $(this).removeClass('fa-volume-up').addClass('fa-volume-mute');
            autoTts = false;
        }
        else{
            $(this).removeClass('fa-volume-mute').addClass('fa-volume-up');
            autoTts = true;
        }
    });

});