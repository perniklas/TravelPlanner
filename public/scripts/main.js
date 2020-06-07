$(() => {
    startListening();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            userLocation.lat = pos.coords.latitude;
            userLocation.lng = pos.coords.longitude;
        });
    }

    let initDB = () => {
        DB.getMyTrips(() => {
            if (DB.myTrips.length == 0) {
                $('#map-container-menu').slideToggle();
            } else {
                DB.currentTrip = {
                    ref: DB.myTrips[0].ref,
                    data: DB.myTripsData[0],
                };
            }
        });
    }
    Authentication.initAuth(initDB);
});

function addTripsToSidebar() {
    $('#map-container-menu-content-tripList').empty();
    $.each(DB.myTripsData, (index, trip) => {
        $('#map-container-menu-content-tripList').append(
            $('<div/>').addClass('triplist-element').css('position', 'relative')
                .append($('<h5/>').html(trip.title).addClass('triplist-title')
                    .attr('data-id', DB.myTrips[index].id))
                .append($('<i/>').addClass('far fa-trash-alt triplist-trash')
                    .attr('data-id', DB.myTrips[index].id))
        );
    })
    UI.tripContainerHeightCheck();
}

var userLocation = {
    lat: 12.550343,
    lng: 55.665957
}

function startListening() {
    // TOGGLE BETWEEN LOGIN AND SIGNUP
    $('.auth-toggle').on('click', function() {
        if ($('#auth-login-form').is(':hidden')) {
            $('#auth-signup-form').hide();
            $('#auth-login-form').slideDown();
        } else {
            $('#auth-login-form').hide();
            $('#auth-signup-form').slideDown();
        }
    });

    // SUBMIT LOG IN FORM
    $('#auth-login-form').on('submit', function(e) {
        e.preventDefault();
        let email = $('#auth-login-form-email').val(),
            password = $('#auth-login-form-password').val();

        Authentication.login(email, password);
    });

    // SUBMIT SIGN UP FORM
    $('#auth-signup-form').on('submit', function(e) {
        e.preventDefault();
        let email = $('#auth-signup-form-email').val(),
            password = $('#auth-signup-form-password').val(),
            password2 = $('#auth-signup-form-password-confirm').val();

        Authentication.signup(email, password, password2);
    });

    // TOGGLE SIDEBAR MENU
    $('#map-container-menu-toggle').on('click', function() {
        $('#map-container-menu').slideToggle();
        map.invalidateSize();
    });

    // CLICK ON DELETE TRIP
    $(document).on('click', '.triplist-trash', function() {
        if (confirm("Are you sure you want to delete this trip?")) {
            let trip = DB.getTripByID($(this).attr('data-id'));
            DB.deleteTrip(trip);
        }
    });

    // CLICK ON TRIP IN LIST
    $(document).on('click', '.triplist-title', function() {
        let trip = DB.getTripByID($(this).attr('data-id'));
        let tripObj = {
            ref: trip.ref,
            data: trip.data
        }
        UI.addTripDetails(tripObj);
    });

    // CREATE NEW TRIP
    $('#create-trip').on('click', function(e) {
        e.preventDefault();
        mapData.mapState.addMarker = true;
        var thisTrip = DB.createNewTrip();

        console.log(thisTrip);
        UI.addTripDetails();
    });

    $('#map-container-trip-close').on('click', function(e) {
        $('#map-container-trip').slideUp();
    });

    $('#map-container-trip-form').on('submit', function(e) {
        e.preventDefault();
        let details = {
            title: ($('#trip-form-title').val()) ? $('#trip-form-title').val() : 'Trippin',
            start: ($('#trip-form-start').val()) ? $('#trip-form-start').val() : new Date('2000-01-1'),
            end: ($('#trip-form-end').val()) ? $('#trip-form-end').val() : new Date('2020-01-1')
        }
        
        let cb = () => {
            $('#map-container-trip').slideUp();
        }

        DB.updateTripWithDetails(DB.currentTrip.ref, details, cb);
    });
}