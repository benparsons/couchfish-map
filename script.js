var tick = 1690;
var circles = [];

function getJSON(path) {
    return fetch(path).then(response => response.json());
}

getJSON('/days.json').then(days => {
    console.log(days);
    main(days);
})

function main(days) {
    console.log("main starting")
    var mymap = L.map('mapid').setView([13.742387, -259.490891], 10);
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);
    

    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }
    mymap.on('click', onMapClick);

    // create a red polyline from an array of LatLng points
    for (day of days) {
        var polyline = L.polyline(day.points, {color: 'red'}).addTo(mymap);
    }
// var latlngs = [
//     [13.913906, -259.39785],
//     [37.77, -122.43],
//     [34.04, -118.2]
// ];
// var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
// zoom the map to the polyline
//mymap.fitBounds(polyline.getBounds());

}