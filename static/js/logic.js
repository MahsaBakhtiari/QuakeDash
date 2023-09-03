// Define a map
let map = L.map("map", {
    center: [51.505, -0.09],
    zoom: 3
});

// Add the  tile layer
let openStreet = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Assign the api endpoint rto a url variable  
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


d3.json(url).then(function (data) {
let target = data.features;
console.log(target);

// Define a function that assign a color to every depth 
function getColor(d) {
    return d > 90 ? '#800026' :
        d > 70 ? '#BD0026' :
            d > 50 ? '#E31A1C' :
                d > 30 ? '#FC4E2A' :
                    d > 10 ? '#FD8D3C' :
                        d > -10 ? '#FEB24C' :
                            '#FFEDA0';
}

// Define a function to assign a radius base on the magnitude 
function radiusIt(radius) {
    let size = Math.sqrt(Math.abs(radius)) * 70000
    return size;
};

// Add the markers
for (let i = 0; i < target.length; i++) {
let mark = target[i];
console.log("cordinates", [mark.geometry.coordinates[1], mark.geometry.coordinates[0]])
console.log("color", getColor(mark.geometry.coordinates[2]));
console.log("radius", mark.properties.mag);
L.circle([mark.geometry.coordinates[1], mark.geometry.coordinates[0]], {
    fillColor: getColor(mark.geometry.coordinates[2]),
    color: getColor(mark.geometry.coordinates[2]),
    radius: radiusIt(mark.properties.mag),
    fillOpacity: 0.7
}).bindPopup(`<h3>${mark.properties.place}<h3><hr><p>${Date(mark.properties.time)}</p><p>Magnitude: ${mark.properties.mag}</br>Depth: ${mark.geometry.coordinates[2]}</p>`).addTo(map);
};

// Add legend 
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

});

