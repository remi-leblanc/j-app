$(document).ready(function(){

    /* 
    * SYSTEME D'AFFICHAGE DE BLOCS SOUS CONDITIONS
    */
    function checkForCond(emitter){
        var emitterLink = emitter.attr('data-cond-link');
        $('.cond-block[data-cond-link='+emitterLink+']').removeClass('active');
        if(emitter.is('select')){
            var emitterCond = emitter.find('option:selected').text();
            emitterCond = emitterCond.replace(/\s/g, '-');
            $('.cond-block[data-cond-link='+emitterLink+'][data-cond='+emitterCond+']').addClass('active');
        }
        else{
            $('.cond-emitter[data-cond-link='+emitterLink+']').each(function(){
                if($(this).hasClass('selected')){
                    $('.cond-block[data-cond-link='+emitterLink+']').addClass('active');
                }
            });
        }
    }
    $('.cond-emitter').each(function(){
        checkForCond($(this));
    });
    $('.cond-emitter').change(function(){
        checkForCond($(this));
    });
    $('.cond-emitter').on('classChange', function(){
        checkForCond($(this));
    });


    /* 
    * EVENT UPDATE INPUT RANGE
    */
    $('input[type=range]').on('input', function () {
        $(this).trigger('change');
    });

    /* 
    * SYSTEME DE MODAL
    */
    $('.modal-btn').click(function(){
        var modalName = $(this).attr('data-modal');
        var modal = $('.modal[data-modal='+modalName);
        modal.addClass('active');
        $('html').addClass('modal-open');
        if($(this).attr('data-modal-param')){
            var modalDb = window[modal.attr('data-modal-db')];
            var modalParam = modal.attr('data-modal-param');
            var modalParamVal = $(this).attr('data-modal-param');
            function searchDb(db){
                return db[modalParam] === modalParamVal;
            }
            var modalDbResult = modalDb.find(searchDb);
            modal.find('*[data-modal-val]').each(function(){
                var modalVal = $(this).attr('data-modal-val');
                if( modalVal.match(/\[\d{1,255}\]$/g) ){
                    var modalValName = modalVal.match(/.+?(?=\[\d{1,255}\])/)[0];
                    var modalValId = modalVal.match(/(?<=\[)(.*?)(?=\])/g)[0];
                    $(this).text(modalDbResult[modalValName][modalValId]);
                }
                else{
                    $(this).text(modalDbResult[modalVal]);
                }
                
            });
        }
    });
    $('.modal-close').click(function(){
        closeModal();
    });
    $(document).keydown(function(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    });
    function closeModal(){
        $('.modal').removeClass('active');
        $('html').removeClass('modal-open');
        $('.modal').find('.form-ajax').trigger('formAjaxReset');
    }

    /* 
    * FORMULAIRE AJAX
    */
    $('.form-ajax').submit(function(e){
        e.preventDefault();
        var form = $(this);
        var url = form.attr('action');
        var formData = form.serializeArray();
        if(form.hasClass('form-delete')){
            if(!confirm('Etes-vous sûr de vouloir supprimer cet élément ?')){
                return;
            }
        }
        form.trigger('formAjaxLoading');
        form.find('button').addClass('fas loading');
        $.ajax({
            type: "POST",
            url: url,
            data: formData,
            success: function(data)
            {
                form.trigger('formAjaxSuccess');
            },
            complete: function(){

            },
            error: function(){
                form.trigger('formAjaxError');
            }
        });
    });


    /* 
    * ANIMATIONS DES REQUETES AJAX
    */
    $('#word-reports .form-ajax.form-delete').on('formAjaxLoading', function(){
        $(this).find('button').removeClass('fa-trash-alt');
    });
    $('#word-reports .form-ajax.form-delete').on('formAjaxSuccess', function(){
        $(this).parents('.report-item').remove();
    });
    $('#page-app form[name=word_report].form-ajax').on('formAjaxLoading', function(){
        $(this).find('button').text('');
    });
    $('#page-app form[name=word_report].form-ajax').on('formAjaxSuccess', function(){
        $(this).find('button').addClass('success').removeClass('loading'); 
        $(this).find('.form-ajax-message').text('Merci, votre signalement à bien été envoyé.');
        $(this).find('.form-ajax-message').show();
    });
    $('#page-app form[name=word_report].form-ajax').on('formAjaxError', function(){
        $(this).find('.form-ajax-message').text('Oups, une erreur est survenue.');
        $(this).find('.form-ajax-message').show();
    });
    $('#page-app form[name=word_report].form-ajax').on('formAjaxReset', function(){
        $(this).find('button').removeClass('fas success loading');
        $(this).find('button').text('Envoyer');
        $(this).find('.form-ajax-message').text('');
        $(this).find('.form-ajax-message').hide();
    });

    /* 
    * SYSTEME DE PAGE FRONT-END
    */
    $('.nav-cat-menu-item').click(function(){
        var cat = $(this).attr('data-nav-cat');
        $('.nav-cat-item[data-nav-cat='+cat+']').addClass('active').removeClass('inactive');
        $('.nav-cat-menu').addClass('leave');
    });
    $('.nav-cat-back').click(function(){
        $(this).parent('.nav-cat-item').removeClass('active').addClass('inactive');
        $('.nav-cat-menu').removeClass('leave');
    });

    /* 
    * MENU MOBILE TRIGGER
    */
    $('#menu-trigger').on('click', function(){
        if($('html').hasClass('mobile-active')){
            $('html').removeClass('mobile-active');
            $('html').addClass('mobile-not-active');
        }
        else{
            $('html').addClass('mobile-active');
            $('html').removeClass('mobile-not-active');
        }
    });

    /* 
    * INITIALISATION TTS
    */
    if ('speechSynthesis' in window) {
        var selectedVoice = null;
        window.tts = null;
        if(!loadVoices()){
            speechSynthesis.addEventListener('voiceschanged', loadVoices);
        }
    }
    else{
        setTtsError();
    }
    function loadVoices() {
        var voices = speechSynthesis.getVoices();
        if(voices == 0){
            return false;
        }
        voices.forEach(function(voice, i){
            if(voice.lang == 'ja-JP' || voice.lang == 'ja_JP'){
                if(!tts){
                    window.tts = new SpeechSynthesisUtterance('');
                }
                selectedVoice = voice;
                if(!voice.localService){
                    selectedVoice = voice;
                }
                window.tts.voice = selectedVoice;
                $('html').addClass('tts-enabled');
            }
        });
        if(!selectedVoice || !voices.length){
            setTtsError();
        }
        $('html').addClass('tts-loaded');
        document.dispatchEvent(new Event('voicesloaded'));
        return true;
    }
    function setTtsError(){
        $('html').addClass('tts-disabled');
    }

    /* 
    * INITIALISATION SPEECH REC
    */
    if ('webkitSpeechRecognition' in window) {
        var recognition = new webkitSpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.start();
        recognition.onstart = function(){
            $('html').addClass('speechRec-enabled');
            recognition.abort();
        }
        recognition.onerror = function(event){
            if(event.error != 'aborted'){
                $('html').addClass('speechRec-disabled');
            }
        }
    }
    else{
        $('html').addClass('speechRec-disabled');
    }
});