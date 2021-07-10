$(document).ready(function(){

    uniqueFieldErrorDisplay($('form input.unique-field'));

    $('form input.unique-field').keyup(function(){
        uniqueFieldErrorDisplay($(this));
    });

    function uniqueFieldErrorDisplay(input){
        if(typeof words !== 'undefined' && input.length){
            if( matchedWord = words.find(word => word.uniqueField === input.val()) ){
                if(typeof currentWordId !== 'undefined' && matchedWord.id === currentWordId){
                    return;
                }
                $('#error-word-exist').addClass('active');
                $('#error-word-exist a').attr('href', matchedWord.editUrl);
                
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