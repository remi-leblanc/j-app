romaji_dict = {".": "ten", "0": "zero", "1": "ichi", "2": "ni", "3": "san", "4": "yon", "5": "go", "6": "roku", "7": "nana",
                "8": "hachi", "9": "kyuu", "10": "juu", "100": "hyaku", "1000": "sen", "10000": "man", "100000000": "oku",
                "300": "sanbyaku", "600": "roppyaku", "800": "happyaku", "3000": "sanzen", "8000":"hassen", "01000": "issen"}

kanji_dict = {".": "点", "0": "零", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "7": "七",
                "8": "八", "9": "九", "10": "十", "100": "百", "1000": "千", "10000": "万", "100000000": "億",
              "300": "三百", "600": "六百", "800": "八百", "3000": "三千", "8000":"八千", "01000": "一千"}

hiragana_dict = {".": "てん", "0": "ゼロ", "1": "いち", "2": "に", "3": "さん", "4": "よん", "5": "ご", "6": "ろく", "7": "なな",
                "8": "はち", "9": "きゅう", "10": "じゅう", "100": "ひゃく", "1000": "せん", "10000": "まん", "100000000": "おく",
                 "300": "さんびゃく", "600": "ろっぴゃく", "800": "はっぴゃく", "3000": "さんぜん", "8000":"はっせん", "01000": "いっせん" }

key_dict = {"kanji" : kanji_dict, "hiragana" : hiragana_dict, "romaji": romaji_dict}

function len_one(convert_num,requested_dict){
    // Returns single digit conversion, 0-9
    return requested_dict[convert_num]
}

function len_two(convert_num,requested_dict){
    // Returns the conversion, when number is of length two (10-99)
    if (convert_num[0] == "0"){ //if 0 is first, return len_one
        return len_one(convert_num[1],requested_dict)
    }
    if (convert_num == "10"){
        return requested_dict["10"] // Exception, if number is 10, simple return 10
    }
    if (convert_num[0] == "1"){ // When first number is 1, use ten plus second number
        return requested_dict["10"] + " " + len_one(convert_num[1],requested_dict)
    } 
    else if (convert_num[1] == "0"){ // If ending number is zero, give first number plus 10
        return len_one(convert_num[0],requested_dict) + " " + requested_dict["10"]
    }
    else{
        var num_list = []
        for (x of convert_num){
            num_list.push(requested_dict[x])
        }
        num_list.splice(1, 0, requested_dict["10"])
        // Convert to a string (from a list)
        var output = ""
        for (y of num_list){
            output += y + " ";
        }
        output = output.slice(0, -1)  // take off the space
        return output;
    }
}


function len_three(convert_num,requested_dict){
    // Returns the conversion, when number is of length three (100-999)
    var num_list = []
    if (convert_num[0] == "1"){
        num_list.push(requested_dict["100"])
    }
    else if (convert_num[0] == "3"){
        num_list.push(requested_dict["300"])
    }
    else if (convert_num[0] == "6"){
        num_list.push(requested_dict["600"])
    }
    else if (convert_num[0] == "8"){
        num_list.push(requested_dict["800"])
    }
    else{
        num_list.push(requested_dict[convert_num[0]])
        num_list.push(requested_dict["100"])
    }
    if (convert_num.slice(1) == "00" && convert_num.length == 3){
    }
    else{
        if (convert_num[1] == "0"){
            num_list.push(requested_dict[convert_num[2]])
        }
        else{
            num_list.push(len_two(convert_num.slice(1), requested_dict))
        }
    }
    var output = ""; 
    for (y of num_list){
        output += y + " ";
    }
    output = output.slice(0, -1);
    return output;
}


function len_four(convert_num,requested_dict, stand_alone){
    // Returns the conversion, when number is of length four (1000-9999)
    var num_list = []
    // First, check for zeros (and get deal with them)
    if (convert_num == "0000"){
        return "";
    }
        
    while(convert_num[0] == "0"){
        convert_num = convert_num.slice(1);
    }
    if (convert_num.length == 1){
        return len_one(convert_num,requested_dict)
    }   
    else if (convert_num.length == 2){
        return len_two(convert_num,requested_dict)
    }
    else if (convert_num.length == 3){
        return len_three(convert_num,requested_dict)
    }
    // If no zeros, do the calculation
    else{
        // Have to handle 1000, depending on if its a standalone 1000-9999 or included in a larger number
        if (convert_num[0] == "1" && stand_alone){
            num_list.push(requested_dict["1000"])
        }
        else if (convert_num[0] == "1"){
            num_list.push(requested_dict["01000"])
        }
            
        else if (convert_num[0] == "3"){
            num_list.push(requested_dict["3000"])
        }
            
        else if (convert_num[0] == "8"){
            num_list.push(requested_dict["8000"])
        }
            
        else{
            num_list.push(requested_dict[convert_num[0]])
            num_list.push(requested_dict["1000"])
        }
        if (convert_num.slice(1) == "000" && convert_num.length == 4){
            
        }
        else{
            if (convert_num[1] == "0"){
                num_list.push(len_two(convert_num.slice(2),requested_dict))
            }
            else{
                num_list.push(len_three(convert_num.slice(1),requested_dict))
            }
        }
        var output = ""
        for (y of num_list){
            output += y + " "
        }
        output = output.slice(0, -1)
        return output
    }

}



function len_x(convert_num,requested_dict){
    //Returns everything else.. (up to 9 digits)
    var num_list = []
    if (convert_num.slice(0,-4).length == 1){
        num_list.push(requested_dict[convert_num.slice(0,-4)])
        num_list.push(requested_dict["10000"])
    }
    else if (convert_num.slice(0,-4).length == 2){
        num_list.push(len_two(convert_num.slice(0,2),requested_dict))
        num_list.push(requested_dict["10000"])
    }
    else if (convert_num.slice(0,-4).length == 3){
        num_list.push(len_three(convert_num.slice(0,3),requested_dict))
        num_list.push(requested_dict["10000"])
    }
    else if (convert_num.slice(0,-4).length == 4){
        num_list.push(len_four(convert_num.slice(0,4),requested_dict, false))
        num_list.push(requested_dict["10000"])
    }
    else if (convert_num.slice(0,-4).length == 5){
        
        num_list.push(requested_dict[convert_num[0]])
        
        num_list.push(requested_dict["100000000"])
        num_list.push(len_four(convert_num.slice(1,5),requested_dict, false))
        if (convert_num.slice(1,5) == "0000"){
            
        }
        else{
            num_list.push(requested_dict["10000"])
        }
    }
    else{
        return("Not yet implemented, please choose a lower number.")
    }
    num_list.push(len_four(convert_num.slice(-4),requested_dict, false))
    var output = ""
    for (y of num_list){
        output += y + " "
    }
    output = output.slice(0, -1)
    return output
}


function remove_spaces(convert_result){
    // Remove spaces in Hirigana and Kanji results
    var correction = ""
    for (x of convert_result){
        if (x == " "){
            
        }
        else{
            correction += x
        }
    }
    return correction
}


function do_convert(convert_num,requested_dict){
    //Check lengths and convert accordingly
    if (convert_num.length == 1){
        return(len_one(convert_num,requested_dict))
    }
    else if (convert_num.length == 2){
        return(len_two(convert_num,requested_dict))
    }
    else if (convert_num.length == 3){
        return(len_three(convert_num,requested_dict))
    }
    else if (convert_num.length == 4){
        return(len_four(convert_num,requested_dict, true))
    }
    else{
        return(len_x(convert_num,requested_dict))
    }
}


function split_Point(split_num,dict_choice){
    // Used if a decmial point is in the string.
    split_num = split_num.split(".")
    var split_num_a = split_num[0]
    var split_num_b = split_num[1]
    var split_num_b_end = " "
    for (x of split_num_b){
        split_num_b_end += len_one(x,key_dict[dict_choice]) + " "
    }
    // To account for small exception of small tsu when ending in jyuu in hiragana/romaji
    if (split_num_a[-1] == "0" && split_num_a[-2] != "0" && dict_choice == "hiragana"){
        var small_Tsu = Convert(split_num_a,dict_choice)
        small_Tsu = small_Tsu.slice(0,-1) + "っ"
        return small_Tsu + key_dict[dict_choice]["."] + split_num_b_end
    }
    if (split_num_a[-1] == "0" && split_num_a[-2] != "0" && dict_choice == "romaji"){
        var small_Tsu = Convert(split_num_a,dict_choice)
        small_Tsu = small_Tsu.slice(0,-1) + "t"
        return small_Tsu + key_dict[dict_choice]["."] + split_num_b_end
    }
    return Convert(split_num_a,dict_choice) + " " + key_dict[dict_choice]["."] + split_num_b_end
}



function do_kanji_convert(convert_num){
    // Converts kanji to arabic number
    if (convert_num == "零"){
        return 0
    }

    // First, needs to check for MAN 万 and OKU 億 kanji, as need to handle differently, splitting up the numbers at these intervals.
    // key tells us whether we need to add or multiply the numbers, then we create a list of numbers in an order we need to add/multiply
    var key = []
    var numberList = []
    var y = ""
    for (x of convert_num){
        if (x == "万" || x == "億"){
            numberList.push(y)
            key.push("times")
            numberList.push(x)
            key.push("plus")
            y = ""
        }
        else{
            y += x
        }
    }

    if (y != ""){
        numberList.push(y)
    }

    var numberListConverted = []
    var baseNumber = ["一", "二", "三", "四", "五", "六", "七", "八", "九"]
    var linkNumber = ["十", "百", "千", "万", "億"]

    // Converts the kanji number list to arabic numbers, using the 'base number' and 'link number' list above. For a link number, we would need to
    // link with a base number
    for (noX of numberList){
        var count = noX.length
        var result = 0
        var skip = 1
        for (x of noX.reverse()){
            var addTo = 0
            skip -= 1
            count = count - 1
            if (skip == 1){
                continue;
            }
            if (baseNumber.includes(x)){
                for ([y, z] of Object.entries(kanji_dict)){
                    if (z == x){
                        result += parseInt(y)
                    }
                    
                }
            }
            else if (linkNumber.includes(x)){
                if (baseNumber.includes(noX[count - 1]) && count > 0){
                    for ([y, z] of Object.entries(kanji_dict)){
                        if (z == noX[count - 1]){
                            var tempNo = parseInt(y)
                            for ([y, z] of Object.entries(kanji_dict)){
                                if (z == x){
                                    addTo += tempNo * parseInt(y)
                                    result += addTo
                                    skip = 2
                                }
                            }
                        }
                    }
                }

                else{
                    for ([y, z] of Object.entries(kanji_dict)){
                        if (z == x){
                            result += parseInt(y)
                        }  
                    }
                }
            }
        }
        numberListConverted.push(parseInt(result))
    }
    result = numberListConverted[0]
    y = 0

    // Iterate over the converted list, and either multiply/add as instructed in key list
    for (x of range(1,numberListConverted.length)){
        if (key[y] == "plus"){
            try{
                if (key[y+1] == "times"){
                    result = result + numberListConverted[x] * numberListConverted[x+1]
                    y += 1
                }
                else{
                    result += numberListConverted[x]
                }
            }
            catch(IndexError){
                result += numberListConverted[-1]
                break
            }
        }

        else{
            result = result * numberListConverted[x]
        }
        y += 1
    }
    return result
}

function range (start, end) { return [...Array(1+end-start).keys()].map(v => start+v) }

function Convert(convert_num, dict_choice){
    var result = "";
    // Input formatting
    convert_num = String(convert_num)
    convert_num = convert_num.replace(',','')
    dict_choice = dict_choice.toLowerCase()

    // If all is selected as dict_choice, return as a list
    if (dict_choice == "all"){
        var result_list = []
        for (x of ["kanji", "hiragana", "romaji"]){
            result_list.push(Convert(convert_num,x))
        }
        return result_list
    }
    var dictionary = key_dict[dict_choice]
    
    // Exit if length is greater than current limit
    if (convert_num.length > 9){
        return("Number length too long, choose less than 10 digits")
    }
        
    // Remove any leading zeroes
    while (convert_num[0] == "0" && convert_num.length > 1){
        convert_num = convert_num.slice(1)
    }

    // Check for decimal places
    if (convert_num.includes(".")){
        result = split_Point(convert_num,dict_choice)
    }
    else{
        result = do_convert(convert_num, dictionary)
    }

    // Remove spaces and return result
    if (key_dict[dict_choice] == romaji_dict){
        
    }
    else{
        result = remove_spaces(result);
    }
    return result
}


function ConvertKanji(convert_num){
    if (kanji_dict.values().includes(convert_num[0])){
        // Check to see if 点 (point) is in the input, and handle by splitting at 点, before and after is handled separately
        if (convert_num.includes("点")){
            var point = convert_num.search("点")
            var endNumber = ""
            for (x of convert_num.slice(point+1)){
                endNumber += kanji_dict.keys()[kanji_dict.values().indexOf(x)]
            }
            return String(do_kanji_convert(convert_num.slice(0,point))) + "." + endNumber
        }
        else{
            return String(do_kanji_convert(convert_num))
        }
    }
}