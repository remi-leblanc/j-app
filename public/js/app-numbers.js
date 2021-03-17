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
    

    draw();

    $(document).keydown(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.key);
        if(keycode == '13'){
            if(isWordComplete){
                draw();
            }
            if(input.val() != ""){
                card.addClass('word-complete');
                result.addClass('active');
                var inputVal = input.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "");
                if(
                    (mode == 'write' && inputVal == romaji.toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, ""))
                    || (mode == 'listen' && inputVal == currentDraw)
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
                statsCompleted++;
                $('#stats-percent').text(Math.round((statsValid * 100) / statsCompleted).toString() + '%');
                isWordComplete = true;
                if(mode == 'write' && autoTts){
                    playTts();
                }
            }
        }
    });

    cardContent.click(function(){
        if(isWordComplete || mode == 'listen'){
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
        if(mode == 'listen'){
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
    }
    
    function randGen(){
        var digits = Math.floor(Math.random() * (8 - 1) + 1);
        var min = Math.pow(10, digits);
        var max = Math.pow(10, digits+1) - 1;
        var rand = Math.floor(Math.random() * (max - min) +  min);
        return rand;
    };

});