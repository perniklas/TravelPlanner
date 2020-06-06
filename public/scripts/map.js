var map;
function initMap() {
    $.getJSON('../token.json', function(data) {
        UI.loading.end(UI.map.show);

        var mapboxTileURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + data.token;
        map = L.map('map').setView([userLocation.lat, userLocation.lng], 13);
        map.zoomControl.remove();
        
        L.tileLayer(mapboxTileURL, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);
        map.invalidateSize();

        mapListener();
    });
}

function mapListener() {
    let currentMarker;

    map.on('click', function(event) {
        map.invalidateSize();
        if (currentMarker) currentMarker.remove();
        console.log(event);
        currentMarker = new L.Marker(event.latlng).addTo(map);
    });
    map.invalidateSize();

    map.on('dragstart', function(event) {
        map.invalidateSize();
    });
}