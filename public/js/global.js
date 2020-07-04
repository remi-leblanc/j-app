$(document).ready(function(){

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
                    var emitterCond = $(this).text();
                    emitterCond = emitterCond.replace(/\s/g, '-');
                    $('.cond-block[data-cond-link='+emitterLink+'][data-cond='+emitterCond+']').addClass('active');
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


    $('input[type=range]').on('input', function () {
        $(this).trigger('change');
    });


    $('.modal-btn').click(function(){
        var modalName = $(this).attr('data-modal');
        var modal = $('.modal[data-modal='+modalName)
        modal.addClass('active');
        $('html').addClass('modal-open');

        if($(this).attr('data-modal-param')){
            var modalDb = window[modal.attr('data-modal-db')];
            var modalParam = modal.attr('data-modal-param');
            var modalParamVal = $(this).attr('data-modal-param');

            function searchArray(report){
                return report[modalParam] == modalParamVal;
            }

            var modalDbResult = modalDb.find(searchArray);

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
        $(this).parents('.modal').removeClass('active');
        $('html').removeClass('modal-open');
        $(this).parents('.modal').find('.form-ajax').trigger('formAjaxReset');
    });



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

});