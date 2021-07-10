$(document).ready(function(){

    var card = $('#card');
    var cardContent = $('#card-content');
    var cardSubcontent = $('#card-subcontent');
    var cardType = $('#card-type');
    var currentDraw = null;
    var isWordComplete = false;
    var statsCorrect = 0;
    var statsError = 0;
    var marker = null;
    var geoJsonSelectedFeature = null;
    var geoJson = null;
    var uiLayer = null;
    

    var oldFontSize = parseFloat(cardContent.css('font-size'));

    var geoJsonOptions = {
        style: {
            fillColor: 'transparent',
            weight: 1,
            opacity: 0.2,
            color: 'white',
        },
        onEachFeature: geoJsonInterractions
    };

    var map = L.map('map-leaflet', {
        minZoom: 4.4,
        maxZoom: 13,
        doubleClickZoom: false,
        maxBounds: L.latLngBounds(L.latLng(23, 120), L.latLng(47, 152)),
        maxBoundsViscosity: 1,
    }).setView([36, 138], 4.4);

    L.tileLayer('https://api.mapbox.com/styles/v1/kronawak/ckqvb5r1h0f4117s4x99dwd63/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3JvbmF3YWsiLCJhIjoiY2txdjdwdjE1MDk0ajJvcWhxNjAwbzlwbSJ9.aTKTichm3YsHKJ1LRtUzDg')
    .addTo(map);

    draw();

    function draw(){
        card.removeClass('word-complete');
        isWordComplete = false;
        $('html').removeClass('wordComplete wordError wordValid');
        if(uiLayer){
            map.removeLayer(uiLayer);
        }
        uiLayer = new L.LayerGroup().addTo(map);
        marker = null;
        geoJsonSelectedFeature = null;
        $('#next-btn-label').text('valider');

        rand();

        cardType.text(locTypes[db[currentDraw]["type"]]);
        cardContent.text(db[currentDraw]["nameJp"]);
        cardSubcontent.text(db[currentDraw]["nameFr"]);
        if(db[currentDraw]["type"] == 1){
            geoJson = L.geoJson(jp_regs_geoJson, geoJsonOptions).addTo(uiLayer);
        } else if(db[currentDraw]["type"] == 2){
            geoJson = L.geoJson(jp_prefs_geoJson, geoJsonOptions).addTo(uiLayer);
        }

        cardContent.css('font-size', oldFontSize+'px');
        adaptFont();
    }

    function rand(){
        if(db.length == 1){
            currentDraw = 0;
            return;
        }
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

    function adaptFont(){
        var cardWidth = card.width();
        var textWidth = cardContent.outerWidth();
        var diff = (textWidth / cardWidth);
        if(diff > 1){
            var newFontSize = oldFontSize * (1 - ((diff * 2.4) / 10));
            cardContent.css('font-size', newFontSize+'px');
        }
    }

    $('#next-btn > .clickable').click(function(){
        if(!isWordComplete){
            if(geoJsonSelectedFeature || marker){
                isWordComplete = true;
                $('#next-btn-label').text('suivant');
                if(db[currentDraw]["type"] == 3){
                    var distance = getDistance(marker._latlng.lat, marker._latlng.lng, db[currentDraw]['lat'], db[currentDraw]['long']);
                    if(distance < 30){
                        var circleColor = '#35bd3e';
                        statsCorrect++;
                    } else{
                        var circleColor = '#e64e4e';
                        statsError++;
                    }
                    L.circle([db[currentDraw]['lat'], db[currentDraw]['long']], {
                        fillColor: circleColor, fillOpacity: 1, radius: 2000, weight: 0
                    }).addTo(uiLayer);
                    L.circle([db[currentDraw]['lat'], db[currentDraw]['long']], {
                        fillColor: circleColor,fillOpacity: 0.5, radius: 28000, weight: 0
                    }).addTo(uiLayer);
                } else {
                    if(geoJsonSelectedFeature.feature.properties.NAME_JP == db[currentDraw]["nameJp"]){
                        statsCorrect++;
                        geoJsonSelectedFeature.setStyle({fillColor: '#35bd3e'});
                    } else {
                        statsError++;
                        geoJsonSelectedFeature.setStyle({fillColor: '#e64e4e'});
                    }
                }
                $('#stats-correct').text(statsCorrect);
                $('#stats-error').text(statsError);
            }
        } else{
            draw();
        }
    });

    map.on('click', function(e){
        if(db[currentDraw]["type"] == 3){
            if(marker){
                map.removeLayer(marker);
            }
            marker = L.marker(e.latlng).addTo(uiLayer);
        }
    });
    
    function geoJsonInterractions(feature, layer) {
        layer.on({
            mouseover: geoJsonMouseOver,
            mouseout: geoJsonMouseOut,
            click: geoJsonSelectFeature
        });
    }
    function geoJsonMouseOut(e) {
        if(e.target != geoJsonSelectedFeature){
            geoJson.resetStyle(e.target);
        }
    }
    function geoJsonMouseOver(e) {
        if(e.target != geoJsonSelectedFeature){
            e.target.setStyle({
                fillColor: '#2f4f9c',
                fillOpacity: 1,
                weight: 1,
                opacity: 1
            });
        }
    }
    function geoJsonSelectFeature(e) {
        geoJsonSelectedFeature = e.target;
        geoJson.resetStyle();
        geoJsonSelectedFeature.setStyle({
            fillColor: '#e6a44e',
            fillOpacity: 1,
            weight: 1,
            opacity: 1
        });
    }

    function getDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

});