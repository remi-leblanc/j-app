$(document).ready(function(){

    var selectedWords = [];

    updateCount();

    function getSelectedCats(){
        var result = [];
        Object.entries(selection).forEach(function(cat){
            Object.entries(cat[1]).forEach(function(catOption){
                if(catOption[1].selected){
                   result.push(catOption[0]);
                }
            });
        });
        return result;
    }

    function updateCount(){

        selectedWords = [];

        for (var i=0; i < words.length; i++) {

            Object.entries(words[i].categories).forEach(function(wordCat){
                if(selection[wordCat[0]][wordCat[1]] != null && selection[wordCat[0]][wordCat[1]].selected == true) {
                    if(!selectedWords.includes(words[i].id)){
                        selectedWords.push(words[i].id);
                    }
                }
            });

            if (formatDate(words[i].date) >= formatDate(selection.date)) {
                if(!selectedWords.includes(words[i].id)){
                    selectedWords.push(words[i].id);
                }
            }

        }
        
        $('#select-count-selected, #select-recap-count').text(selectedWords.length);
    }

    function formatDate(string){
        var string = string.split('-');
        return new Date(string[2], string[1] - 1, string[0]);
    }

    $(document).scroll(function(){
        var scroll = $(this).scrollTop();

        if( scroll > $('#select-count').offset().top){
            $('#select-recap').addClass('show');
        }
        else{
            $('#select-recap').removeClass('show');
        }

    })


    $('.select-cat[data-select-cat]').each(function(){
        var catName = $(this).attr('data-select-cat');
        $(this).find('.select-cat-option[data-select-option]').each(function(){
            var optionName = $(this).attr('data-select-option');
            if( selection[catName][optionName].selected == true){
                $(this).addClass('selected').trigger('classChange');
            }
        });
    });


    $('.select-cat-option').click(function(){
        var optionName = $(this).attr('data-select-option');
        var catName = $(this).closest('.select-cat').attr('data-select-cat');
        if(selection[catName][optionName].selected){
            $(this).removeClass('selected').trigger('classChange');
            selection[catName][optionName].selected = false;
        }
        else{
            $(this).addClass('selected').trigger('classChange');
            selection[catName][optionName].selected = true;
        }
        updateCount();
    });

    $('.select-cat-control-btn').click(function(){
        var controlCat = $(this).attr('data-select-control');
        var category = $(this).closest('.select-cat');
        var catName = category.attr('data-select-cat');
        
        if(controlCat == 'all'){
            Object.entries(selection[catName]).forEach(function(cat){
                $(category).find('.select-cat-option[data-select-option='+cat[0]+']').addClass('selected').trigger('classChange');
                cat[1].selected = true;
                
            });
        }
        else if(controlCat == 'none'){
            Object.entries(selection[catName]).forEach(function(cat){
                $(category).find('.select-cat-option[data-select-option='+cat[0]+']').removeClass('selected').trigger('classChange');
                cat[1].selected = false;
            });
        }
        updateCount();
    });

    $('#select-cat-date').change(function(){
        var lastDate = formatDate(dates.lastDate);
        var selectedDate = new Date(+lastDate);
        
        selectedDate.setDate(lastDate.getDate() - parseInt($(this).val()));

        selection.date = selectedDate.getDate() +'-'+ (selectedDate.getMonth()+1) +'-'+ selectedDate.getFullYear();
        
        updateCount();
    });

    $('#select-form').submit(function(e){
        if(selectedWords.length < 1){
            e.preventDefault();
            $('.select-error').addClass('show').text('Selectionnez au moins 1 mot');
        }
        else{
            $('.select-error').removeClass('show');
            $('#selectionForm_selection').val(selectedWords);
        }
    });
    

});