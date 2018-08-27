import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import {Icon, Style} from 'ol/style.js';
import Cluster from 'ol/source/Cluster';

var wroclawCoords = [17.0333, 51.1098];

var beerPlaces = [
    [51.10110399999999, 17.02503619999993, "12 Krok", "http://12-krok.ontap.pl/", "Bogusławskiego 11"],
    [51.107816, 17.036094999999932, "4hops", "http://4hops.ontap.pl/", "Ofiar Oświęcimskich 46"],
    [51.1119942, 17.029769999999985, "Academus Cafe/Pub", "http://academus.ontap.pl/", "Kiełbaśnicza 23"],
    [51.109761735964064, 17.02312892083205, "AleBrowar", "http://alebrowar.ontap.pl/","Włodkowica 27/1a"],
    [51.10756649137447, 17.030112400000007, "Graciarnia Pizzas & Crafts", "http://graciarnia.ontap.pl/","Kazimierza Wielkiego 39"],
    [51.10845978866974, 17.031663224536942, "Kontynuacja", "http://kontynuacja.ontap.pl", "Ofiar Oświęcimskich 17"],
    [51.10142219999999, 17.022805199999993, "La Famiglia Pizzeria", "http://la-famiglia-pizzeria.ontap.pl/","Kolejowa 14"],
    [51.0998333, 17.030287799999996, "Lamus", "http://lamus.ontap.pl/"," Bogusławskiego 97"],
    [51.1084059, 17.031682000000046, "Lumberjack", "http://lumberjack.ontap.pl/","Ofiar Oświęcimskich 17"],
    [51.10731556687148, 17.030149950926216, "Marynka, Piwo i Aperitivo", "http://marynka.ontap.pl/","Kazimierza Wielkiego 39"],
    [51.1126136, 17.031308500000023, "Modra Odra", "http://modra-odra.ontap.pl", "Odrzańska 24/3"],
    [51.1104748, 17.032414399999993, "Modra Odra Street Food", "http://modra-odra-street-food.ontap.pl/", "Ratusz 15/1c"],
        [51.108089, 17.04311699999994, "Pinta Wrocław", "http://pinta-wroclaw.ontap.pl", "Podwale 83"],
    [51.1092028, 17.031860100000017, "Pogromcy", "http://pogromcy-meatow.ontap.pl/","Rynek 22"],
    [51.13171984855311, 17.05950879264242, "Browar Stu Mostów", "http://stu-mostow.ontap.pl/","Długosza 2"],
    [51.109326656194085, 17.02518484722134, "Szynkarnia", "http://szynkarnia.ontap.pl/", "św. Antoniego 15"],
    [51.11274099000954, 17.039767458197048, "Targowa", "http://targowa.ontap.pl/", "Piaskowa 17"],
    [51.108447591287494, 17.024190471163934, "VaffaNapoli", "http://vaffanapoli.ontap.pl/", "Włodkowica 13"]
];

var vectorSource = new VectorSource({});


for (var i = 0; i < beerPlaces.length; i++) {

    var iconFeature = new Feature({
        projection: "EPSG:4326",
        geometry: new Point([beerPlaces[i][1], beerPlaces[i][0]]),
        name: beerPlaces[i][2],
        web: beerPlaces[i][3],
        address: beerPlaces[i][4]
    });

    var iconStyle = new Style({
        image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
            anchor: [0.5, 35],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'http://icons.iconarchive.com/icons/icons8/windows-8/32/Food-Beer-Glass-icon.png'
        }))
    });
    iconFeature.setStyle(iconStyle);
    vectorSource.addFeature(iconFeature);
}

var vectorLayer = new VectorLayer({
    source: vectorSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true
});

var rasterLayer = new TileLayer({
    source: new OSM()
});

var map = new Map({
    layers: [rasterLayer, vectorLayer],
    target: document.getElementById('map'),
    view: new View({
        projection: "EPSG:4326",
        center: wroclawCoords,
        zoom: 13
    })
});

var element = document.getElementById("popup");


var popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -45]
});

map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        var featName = feature.get('name');
        var featWeb = feature.get('web');
        var featAdd = feature.get('address');
        popup.setPosition(coordinates);
        window.open(featWeb, 'Frame');

        $(element).popover({
            placement: 'top',
            html: true,
            content: featName
        });
        $(element).popover('show');
    }
    else {
        $(element).popover('destroy');
    }
})
;

// change mouse cursor when over marker
map.on('pointermove', function (e) {

    $(element).popover('destroy');

    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});