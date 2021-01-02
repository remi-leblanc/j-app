$(document).ready(function(){

    if(typeof words != 'undefined'){
        $('form[name=word] input#word_kanji').keyup(function(){
            if(words.includes($(this).val())){
                $('#error-word-exist').addClass('active');
            }
            else{
                $('#error-word-exist').removeClass('active');
            }
        });
    }
    
});