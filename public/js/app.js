$(document).ready(function(){

    var card = $('#card');
    var cardKanji = $('#card-content');
    var inputRomaji = $('.answers-row[data-input-type=romaji] input');
    var inputTrad = $('.answers-row[data-input-type=trad] input');
    var result = $('#result');
    var currentDraw;
    var isWordComplete = false;
    var completedCount = 0;
    var statsError = 0;
    var startTime;

    var dbRomajiVal;
    var dbTradVal;

    var oldFontSize = parseFloat(cardKanji.css('font-size'));

    function rand(){
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
        for(var i = 0; i < db.length; i++){
            db[i]['score']['valid'] = false;
            db[i]['score']['time'] = 0;
        }
    }


    function draw(){
        if(db.length <= 1){
            return;
        }

        $('#answers input').val('');
        inputRomaji.removeClass('error').removeClass('correct').focus();
        inputTrad.removeClass('error').removeClass('correct');
        result.find('span[data-result-type=romaji').removeClass('error').removeClass('correct');
        result.find('span[data-result-type=trad').removeClass('error').removeClass('correct');
        result.removeClass('active');
        isWordComplete = false;

        rand();
        
        dbRomajiVal = [];
        db[currentDraw]["romaji"].forEach(function(romaji, i){
            dbRomajiVal.push(this[i].toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, ""));
        }, db[currentDraw]["romaji"]);

        dbTradVal = [];
        db[currentDraw]["trad"].forEach(function(trad, i){
            dbTradVal.push(this[i].toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, ""));
        }, db[currentDraw]["trad"]);

        cardKanji.text(db[currentDraw]["kanji"]);
        cardKanji.css('font-size', oldFontSize+'px');
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
            var inputRomajiVal = inputRomaji.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "");
            var inputTradVal = inputTrad.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "");
            if(inputRomajiVal != ""){
                inputTrad.focus();
            }
            if(isWordComplete){
                if(completedCount != db.length){
                    draw();
                }
                else{
                    finalResults();
                }
            }
            else{
                if(inputRomajiVal != "" && inputTradVal != ""){
                    result.addClass('active');
                    isWordComplete = true;
                    result.find('span[data-result-type=romaji').text(db[currentDraw]["romaji"].join(', '));
                    result.find('span[data-result-type=trad').text(db[currentDraw]["trad"].join(', ') + ((db[currentDraw]["info"] !== undefined) ? " ("+db[currentDraw]["info"]+")" : ""));
                    if(dbRomajiVal.includes(inputRomajiVal) && dbTradVal.includes(inputTradVal)){
                        completedCount++;
                        $('#stats-count').text(completedCount);

                        var endTime = new Date();
                        var completeTime = (endTime - startTime)/1000;

                        db[currentDraw]["score"]["valid"] = true;
                        db[currentDraw]["score"]["time"] = completeTime;
                    }else{
                        statsError++;
                    }

                    if(!dbRomajiVal.includes(inputRomajiVal)){
                        inputRomaji.addClass('error');
                        result.find('span[data-result-type=romaji').addClass('error');
                    }else{
                        inputRomaji.addClass('correct');
                        result.find('span[data-result-type=romaji').addClass('correct');
                    }
                    if(!dbTradVal.includes(inputTradVal)){
                        inputTrad.addClass('error');
                        result.find('span[data-result-type=trad').addClass('error');
                    }else{
                        inputTrad.addClass('correct');
                        result.find('span[data-result-type=trad').addClass('correct');
                    }

                }
            }
        }
        if(keycode == '8'){
            if(inputTrad.is(':focus') && inputTrad.val() == ''){
                event.preventDefault();
                inputRomaji.focus();
            }
        }
    });


    function adaptFont(){
        var cardWidth = card.width();
        var textWidth = cardKanji.outerWidth();
        var diff = (textWidth / cardWidth);
        if(diff > 1){
            var newFontSize = oldFontSize * (1 - ((diff * 2.4) / 10));
            cardKanji.css('font-size', newFontSize+'px');
        }
    }


    $('#restart-btn').click(function(){
        $('.modal[data-modal=finalres]').removeClass('active');
        resetGame();
        draw();
    });


});