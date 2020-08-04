function getJSON(path) {
    return fetch(path).then(response => response.json());
}

getJSON('/days.json').then(days => {
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
            .setContent(`[${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}, ""]`)
            .openOn(mymap);
    }
    mymap.on('click', onMapClick);

    // create a red polyline from an array of LatLng points
    const colours = {};
    colours["train"] = "blue";
    for (const [i, day] of days.entries()) {
        let lastDay = i === days.length - 1;
        let p = L.polyline(
            day.points, {
                color: colours[day.mode] ?? 'red',
                weight: lastDay ? 3 : 1
        }).addTo(mymap);
        if (lastDay) {
            mymap.fitBounds(p.getBounds());
        }
    }

    // polyline = L.polyline(
    //     days.map(d => d.points),
    //     { color: 'red' }
    // );//.addTo(mymap);
    // mymap.fitBounds(polyline.getBounds());
}