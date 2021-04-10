$(document).ready(function(){

    var card = $('#card');
    var cardContent = $('#card-content');
    var input = $('.answers-row input');
    var result = $('#result');
    var currentDraw = null;
    var isWordComplete = false;
    var statsValid = 0;
    var statsError = 0;
    var statsCompleted = 0;
    var autoTts = true;
    var romaji = "";

    if(method == 'speak'){
        var recognition = new webkitSpeechRecognition();
        var speaking = false;
        recognition.continuous = true;
        recognition.lang = 'ja-JP';
        recognition.maxAlternatives = 5;
        recognition.onstart = function(){
            if(!isWordComplete){
                $('html').addClass('speaking');
                speaking = true;
            }
        }
        recognition.onend = function(){
            $('html').removeClass('speaking');
            speaking = false;
        }
        recognition.onresult = function(event) {
            if(!isWordComplete){
                recognition.abort();
                speakResults = Object.values(event.results[0]).map(result => result.transcript);
                var inputVal = speakResults.find(result => result == kanji || result == currentDraw );
                completeWord(inputVal);
                if(inputVal !== undefined){
                    input.val(inputVal);
                } else{
                    input.val(speakResults[0]);
                }
            }
        }
        $('#next-btn > .clickable').click(function(){
            if(isWordComplete){
                draw();
            }
            else if(!speaking){
                recognition.start();
            }
        });
    }
    
    draw();

    $(document).keydown(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.key);
        if(keycode == '13'){
            if(isWordComplete){
                draw();
            }
            else{
                if(method == 'speak'){
                    if(!speaking){
                        recognition.start();
                    }
                }
                else if(input.val() != ""){
                    var inputVal = input.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "");
                    completeWord(inputVal);
                }
            }
        }
    });

    function completeWord(inputVal){
        card.addClass('word-complete');
        result.addClass('active');
        $('html').addClass('wordComplete');
        isWordComplete = true;
        statsCompleted++;
        if(
            (method == 'write' && inputVal == romaji.toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, ""))
            || (method == 'listen' && inputVal == currentDraw)
            || (method == 'speak' && inputVal !== undefined)
        ){
            statsValid++;
            $('#stats-valid').text(statsValid);
            input.addClass('correct');
            result.find('span[data-result-type=romaji], span[data-result-type=kanji]').addClass('correct');
        }
        else{
            statsError++;
            $('#stats-error').text(statsError);
            input.addClass('error');
            result.find('span[data-result-type=romaji], span[data-result-type=kanji]').addClass('error');
        }
        $('#stats-percent').text(Math.round((statsValid * 100) / statsCompleted).toString() + '%');
        if(method != 'listen' && autoTts){
            playTts();
        }
    }

    cardContent.on('mousedown', function (e) {
        e.preventDefault();
        if(isWordComplete || method == 'listen'){
            playTts();
        }
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

    function playTts(){
        if(!window.tts){
            return;
        }
        window.tts.text = kanji;
        speechSynthesis.cancel();
        speechSynthesis.speak(window.tts);
    }

    function draw(){
        currentDraw = randGen();
        romaji = Convert(currentDraw, "romaji");
        kanji = Convert(currentDraw, "kanji");
        result.find('span[data-result-type=romaji]').text(romaji);
        result.find('span[data-result-type=kanji]').text(kanji);
        cardContent.find('span').text(currentDraw.toLocaleString('fr-FR'));
        if(method == 'listen'){
            playTts();
            document.addEventListener('voicesloaded', function(e){
                playTts();
            }, false);
        }

        // Reset
        input.removeClass('correct').removeClass('error');
        input.val('');
        result.find('span[data-result-type=romaji], span[data-result-type=kanji]').removeClass('error').removeClass('correct');
        result.removeClass('active');
        isWordComplete = false;
        card.removeClass('word-complete');
        $('html').removeClass('wordComplete');
        if(method == 'speak'){
            recognition.abort();
        }
    }
    
    function randGen(){
        var digits = Math.floor(Math.random() * (8 - 1) + 1);
        var min = Math.pow(10, digits);
        var max = Math.pow(10, digits+1) - 1;
        var rand = Math.floor(Math.random() * (max - min) +  min);
        return rand;
    };

});