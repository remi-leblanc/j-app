$(document).ready(function(){

    var card = $('#card');
    var cardContent = $('#card-content');
    var inputRomaji = $('.answers-row[data-input-type=romaji] input');
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
            if(inputRomaji.val() != ""){
                cardContent.addClass('word-complete');
                result.addClass('active');
                if(inputRomaji.val().toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "") == romaji.toLowerCase().normalize("NFD").replace(/\s|[\u0300-\u036f]|'|-/g, "")){
                    statsValid++;
                    $('#stats-valid').text(statsValid);
                    inputRomaji.addClass('correct');
                    result.find('span[data-result-type=romaji], span[data-result-type=kanji]').addClass('correct');
                }
                else{
                    statsError++;
                    $('#stats-error').text(statsError);
                    inputRomaji.addClass('error');
                    result.find('span[data-result-type=romaji], span[data-result-type=kanji]').addClass('error');
                }
                statsCompleted++;
                $('#stats-percent').text(Math.round((statsValid * 100) / statsCompleted).toString() + '%');
                isWordComplete = true;
                if(autoTts){
                    console.log('yes');
                    playTts();
                }
            }
        }
    });

    cardContent.click(function(){
        playTts();
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
        responsiveVoice.debug = false;
        responsiveVoice.cancel();
        if(isWordComplete){
            responsiveVoice.speak(kanji, "Japanese Female");
        }
    }

    function draw(){
        currentDraw = randGen();
        cardContent.text(currentDraw.toLocaleString('fr-FR'));
        romaji = Convert(currentDraw, "romaji");
        kanji = Convert(currentDraw, "kanji");
        result.find('span[data-result-type=romaji]').text(romaji);
        result.find('span[data-result-type=kanji]').text(kanji);

        // Reset
        inputRomaji.removeClass('correct').removeClass('error');
        inputRomaji.val('');
        result.find('span[data-result-type=romaji], span[data-result-type=kanji]').removeClass('error').removeClass('correct');
        result.removeClass('active');
        isWordComplete = false;

        playTts();
    }
    
    function randGen(){
        var digits = Math.floor(Math.random() * (8 - 1) + 1);
        var min = Math.pow(10, digits);
        var max = Math.pow(10, digits+1) - 1;
        var rand = Math.floor(Math.random() * (max - min) +  min);
        return rand;
    };
    

});