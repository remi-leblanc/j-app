$(document).ready(function(){

    wordExistErrorDisplay($('form[name=word] input#word_kanji'));

    $('form[name=word] input#word_kanji').keyup(function(){
        wordExistErrorDisplay($(this));
    });

    function wordExistErrorDisplay(input){
        if(typeof words !== 'undefined' && input.length){
            if( matchedWord = words.find(word => word.kanji === input.val()) ){
                $('#error-word-exist').addClass('active');
                $('#error-word-exist a').attr('href', matchedWord.edit_url);
            }
            else{
                $('#error-word-exist').removeClass('active');
            }
        }
    }

    $('.analyse-item .frame-header').click(function(){
        if($(this).parent('.hidden').length){
            $('.analyse-item').addClass('hidden');
            $(this).parent('.analyse-item').removeClass('hidden');
        }
        else{
            $('.analyse-item').addClass('hidden');
            $(this).parent('.analyse-item').addClass('hidden');
        }
    });
    
});