let mymap;
let results1;

function getJSON(path) {
    return fetch(path).then(response => response.json());
}

getJSON('/days.json').then(days => {
    renderDays(days);
})

function renderDays(days) {
    console.log("main starting")
    mymap = L.map('mapid').setView([13.742387, -259.490891], 10);
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
            .setContent(`[${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}, "${document.getElementById("txtSearch").value.trim()}"]`)
            .openOn(mymap);
    }
    mymap.on('click', onMapClick);

    // create a red polyline from an array of LatLng points
    const colours = {};
    colours["train"] = "blue";
    for (const [i, day] of days.entries()) {
        day.points = day.points.map(p => [p[0], p[1] < -180 ? p[1] + 360 : p[1], p[2]]);
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

function search(searchText) {
    if (!searchText) {
        searchText =  document.getElementById("txtSearch").value;
    }
    let nominatimUrl = `https://nominatim.openstreetmap.org/search.php?q=${searchText}&format=jsonv2`;
    getJSON(nominatimUrl).then(results =>{
        console.log(results);
        let presultsCount = document.getElementById("resultsCount")
        resultsCount.innerText = results.length + " results";
        if (results.length === 0) return;
        let top = [];
        for (let i = 0; i < Math.min(5, results.length); i++) {
            let place = results[i];
            top.push([place.lat, place.lon]);
            var marker = L.marker(top[i]).addTo(mymap);
        }
        mymap.setView([results[0].lat, results[0].lon], 10);
        //let all = L.polyline(results.map(p => [parseFloat(p.lat), parseFloat(p.lon)]));
        //mymap.fitBounds(all.getBounds());
    })
}