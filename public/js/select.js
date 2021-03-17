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
        selectedWords = words.filter(function(word) {
            for (var wordCat in word.categories) {
                var catValue = word['categories'][wordCat];
                if(selection[wordCat][catValue] != null && selection[wordCat][catValue].selected == true){
                    if(typeof selection[wordCat][catValue].splitGroup == 'undefined') {
                        return true;
                    }
                    if(typeof selection[wordCat][catValue].splitGroup != 'undefined' && selection[wordCat][catValue].splitGroup.includes(word.splitGroup)) {
                        return true;
                    }
                }
            }
            if (formatDate(word.date) >= formatDate(selection.date)) {
                return true;
            }
            return false;
        }).map(function(word) {
            return word.id;
        });
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


    $('.select-cat.select-cat-multi[data-select-cat]').each(function(){
        var catName = $(this).attr('data-select-cat');
        $(this).find('.select-cat-option[data-select-option]').each(function(){
            var optionName = $(this).attr('data-select-option');
            if( selection[catName][optionName].selected == true){
                $(this).addClass('selected').trigger('classChange');
            }
        });
    });

    $('.select-cat.select-cat-multi .select-cat-option').click(function(){
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

    $('.select-cat.select-cat-single .select-cat-option').click(function(){
        var optionName = $(this).attr('data-select-option');
        var catName = $(this).closest('.select-cat').attr('data-select-cat');
        $(this).siblings().removeClass('selected').trigger('classChange');
        $(this).addClass('selected').trigger('classChange');
        selection[catName] = optionName;
        updateCount();
    });

    $('.select-cat-sub .select-cat-option').click(function(){
        var optionName = $(this).attr('data-select-option');
        var catName = $(this).closest('.select-cat-sub').attr('data-select-cat');
        if(selection['types'][catName].splitGroup.includes(optionName)){
            $(this).removeClass('selected').trigger('classChange');
            selection['types'][catName].splitGroup = selection['types'][catName].splitGroup.filter(e => e !== optionName);
        }
        else{
            $(this).addClass('selected').trigger('classChange');
            selection['types'][catName].splitGroup.push(optionName);
        }
        updateCount();
    });

    $('.select-cat .select-cat-control-btn').click(function(){
        var controlCat = $(this).attr('data-select-control');
        var category = $(this).closest('.select-cat');
        var catName = category.attr('data-select-cat');
        for(var val in selection[catName]){
            if(controlCat == 'all'){
                $(category).find('.select-cat-option[data-select-option='+val+']').addClass('selected').trigger('classChange');
                selection[catName][val].selected = true;
            }
            else if(controlCat == 'none'){
                $(category).find('.select-cat-option[data-select-option='+val+']').removeClass('selected').trigger('classChange');
                selection[catName][val].selected = false;
            }
        };
        updateCount();
    });

    $('.select-cat-sub .select-cat-control-btn').click(function(){
        var controlCat = $(this).attr('data-select-control');
        var category = $(this).closest('.select-cat-sub');
        var catValue = category.attr('data-select-cat');
        if(controlCat == 'all'){
            $(category).find('.select-cat-option').addClass('selected').trigger('classChange');
            for(var i = 0; i < selection['types'][catValue].splitGroupCount; i++){
                selection['types'][catValue].splitGroup.push(i.toString());
            }
            
        }
        else if(controlCat == 'none'){
            $(category).find('.select-cat-option').removeClass('selected').trigger('classChange');
            selection['types'][catValue].splitGroup = [];
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
        if(selectedWords.length < 1 && selection['mode'] != 'numbers'){
            e.preventDefault();
            $('.select-error').addClass('show').text('Sélectionnez au moins 1 mot');
        }
        else{
            $('.select-error').removeClass('show');
            $('#selectionForm_selection').val(selectedWords);
            $('#selectionForm_mode').val(selection['mode']);
            $('#selectionForm_method').val(selection['method']);
        }
    });
    

});