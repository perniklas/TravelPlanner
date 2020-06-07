

var map;
function initMap() {
    $.getJSON('../token.json', function(data) {
        UI.loading.end(UI.map.show);

        var mapboxTileURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + data.leaftoken;
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
        
        setTimeout(map.invalidateSize(), 250);

        mapListener();
    });
}

function mapListener() {
    let currentMarker;
    let contextApi = '';
    var geocoder = new google.maps.Geocoder;

    $.getJSON('../token.json', function(data) {
        contextApi = data.othertoken;
    });

    map.on('click', function(e) {
        map.invalidateSize();
        if (mapData.mapState.addMarker) {
            if (currentMarker) currentMarker.remove();
            currentMarker = new L.Marker(e.latlng).addTo(map);
            
            // var latlng = {lat: parseFloat(e.latlng.lat), lng: parseFloat(e.latlng.lng)};
            geocoder.geocode({'location': e.latlng}, function(result, status) {
                if (status === 'OK') {
                    if (result[0]) {
                        console.log(result);
                        mapData.data.country = findAddressComponent(result[0].address_components, 'country').long_name;
                        mapData.data.city = findAddressComponent(result[0].address_components, 'postal_town').long_name;
                        mapData.data.place = findAddressComponent(result[0].address_components, 
                            ['route', 'establishment', 'point of interest']).long_name;
                        mapData.data.latlng = e.latlng
                    } else {
                        window.alert('No results found');
                    }
                } else {
                window.alert('Geocoder failed due to: ' + status);
                }
            });
        }
    });

    map.on('dragstart', function(event) {
        map.invalidateSize();
    });
}

function addMarkersToMap() {
    $.each(DB.myTripsData, (index, trip) => {
        console.log(trip);
    });
}

function findAddressComponent(components, type) {
    let result;
    isArrayPolyfill([components, type]);
    if (!components || !type || !components.isArray()) return;
    $.each(components, (index, component) => {
        if (type.isArray()) {
            $.each(type, (index, t) => {
                if (component.types.includes(t)) {
                    result = component;
                }
            });
        } else {
            if (component.types && component.types.includes(type)) {
                result = component;
            }
        }
    });
    return result;
}

function isArrayPolyfill(arrayOfArrays) {
    $.each(arrayOfArrays, (index, array) => {
        if (!array.isArray) {
            array.isArray = function(arg) {
              return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
    });
    
}

var mapData = {
    mapState: {
        addMarker: false
    },
    data: {
        country: null,
        city: null,
        place: null,
        latlng: null
    }
}