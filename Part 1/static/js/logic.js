function createMap (earthquakes) {
    let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": streetmap
    };

    let overlayMaps = {
        "All Earthquakes": earthquakes
    };

    let map = L.map("map", {
        center: [40, -100],
        zoom: 10,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
};

function createMarkers(response) {
    let earthquakes = response.features;

    let earthquakeMarkers = [];

    earthquakes.forEach(earthquake => {
        
        let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];

        let markerSize = magnitude * 5;
        let markerColor = depth < 30 ? 'green' : depth < 70 ? 'yellow' : 'red';

        let earthquakeMarker = L.circleMarker(coordinates, {
            radius: markerSize,
            fillColor: markerColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(
            `<h3>Magnitude: ${magnitude}</h3><h3>Depth: ${depth} km</h3>`
        );

        earthquakeMarkers.push(earthquakeMarker);
    });

    let allEarthquakes = L.layerGroup(earthquakeMarkers);

    createMap(allEarthquakes);
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);