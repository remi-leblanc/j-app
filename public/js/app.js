$(document).ready(function(){

    var card = $('#card');
    var cardKanji = $('#card-content');
    var inputRomaji = $('.answers-row[data-input-type=romaji] input');
    var inputTrad = $('.answers-row[data-input-type=trad] input');
    var result = $('#result');
    var currentDraw;
    var next = false;
    var statsCount = 0;
    var statsCorrect = 0;
    var statsError = 0;

    var dbRomajiVal;
    var dbTradVal;

    var oldFontSize = parseFloat(cardKanji.css('font-size'));

    function rand(){
        var nb = Math.floor(Math.random() * db.length);
        if(currentDraw != null){
            if(nb == currentDraw){
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


    function draw(){

        if(db.length <= 1){
            return;
        }

        rand();

        $('#answers input').val('');
        inputRomaji.removeClass('error').removeClass('correct').focus();
        inputTrad.removeClass('error').removeClass('correct');
        result.find('span[data-result-type=romaji').removeClass('error').removeClass('correct');
        result.find('span[data-result-type=trad').removeClass('error').removeClass('correct');
        result.removeClass('active');
        next = false;

        dbRomajiVal = [];
        db[currentDraw]["romaji"].forEach(function(romaji, i){
            dbRomajiVal.push(this[i].replace(/\s|\-/g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }, db[currentDraw]["romaji"]);

        dbTradVal = [];
        db[currentDraw]["trad"].forEach(function(trad, i){
            dbTradVal.push(this[i].replace(/\s|\-/g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }, db[currentDraw]["trad"]);

        cardKanji.text(db[currentDraw]["kanji"]);
        cardKanji.css('font-size', oldFontSize+'px');
        adaptFont();

        $('#word_report_word').val(db[currentDraw]["id"]);
    }
    

    draw();

    $(document).keydown(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.key);
        if(keycode == '13'){
            var inputRomajiVal = inputRomaji.val().replace(/\s/g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            var inputTradVal = inputTrad.val().replace(/\s/g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if(inputRomajiVal != ""){
                inputTrad.focus();
            }
            if(next){
                draw();
            }
            else{
                if(inputRomajiVal != "" && inputTradVal != ""){
                    result.addClass('active');
                    next = true;
                    statsCount++;
                    result.find('span[data-result-type=romaji').text(db[currentDraw]["romaji"].join(', '));
                    result.find('span[data-result-type=trad').text(db[currentDraw]["trad"].join(', ') + ((db[currentDraw]["info"] !== undefined) ? " ("+db[currentDraw]["info"]+")" : ""));
                    if(dbRomajiVal.includes(inputRomajiVal) && dbTradVal.includes(inputTradVal)){
                        statsCorrect++;
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

                    $('#stats-count').text(statsCount);
                    $('#stats-correct').text(statsCorrect);
                    $('#stats-error').text(statsError);
                    $('#stats-percent').text(Math.floor((statsCorrect / statsCount) * 100) + "%");

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


});