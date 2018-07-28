import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import {Icon, Style} from 'ol/style.js';
import Select from 'ol/interaction/Select.js';
import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';

var wroclawCoords = [17.0333, 51.1098];

var beerPlaces = [
    [51.10110399999999, 17.02503619999993, "12 Krok", "http://12-krok.ontap.pl/"],
    [51.107816, 17.036094999999932, "4hops", "http://4hops.ontap.pl/"],
    [51.1119942, 17.029769999999985, "Academus Cafe/Pub", "http://academus.ontap.pl/"],
    [51.109761735964064, 17.02312892083205, "AleBrowar", "http://alebrowar.ontap.pl/"],
    [51.10756649137447, 17.030112400000007, "Graciarnia Pizzas & Crafts", "http://graciarnia.ontap.pl/"],
    [51.10845978866974, 17.031663224536942, "Kontynuacja", "http://graciarnia.ontap.pl/"],
    [51.10142219999999, 17.022805199999993, "La Famiglia Pizzeria", "http://la-famiglia-pizzeria.ontap.pl/"],
    [51.0998333, 17.030287799999996, "Lamus", "http://lamus.ontap.pl/"],
    [51.1084059, 17.031682000000046, "Lumberjack", "http://lumberjack.ontap.pl/"],
    [51.10731556687148, 17.030149950926216, "Marynka, Piwo i Aperitivo", "http://marynka.ontap.pl/"],
    [51.1104748, 17.032414399999993, "Modra Odra", "http://modra-odra.ontap.pl/"],
    [51.1092028, 17.031860100000017, "Pogromcy", "http://pogromcy-meatow.ontap.pl/"],
    [51.13171984855311, 17.05950879264242, "Browar Stu Mostów", "http://stu-mostow.ontap.pl/"],
    [51.109326656194085, 17.02518484722134, "Szynkarnia", "http://szynkarnia.ontap.pl/"],
    [51.11274099000954, 17.039767458197048, "Targowa", "http://targowa.ontap.pl/"],
    [51.108447591287494, 17.024190471163934, "VaffaNapoli", "http://vaffanapoli.ontap.pl/"]
];

var vectorSource = new VectorSource({});

for (var i = 0; i < beerPlaces.length; i++) {

    var iconFeature = new Feature({
        projection: "EPSG:4326",
        geometry: new Point([beerPlaces[i][1], beerPlaces[i][0]]),
        name: beerPlaces[i][2],
        web: beerPlaces[i][3]
    });

    var iconStyle = new Style({
        image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
            anchor: [0.5, 46],
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
    offset: [0, -50]
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