$(() => {
    startListening();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            userLocation.lat = pos.coords.latitude;
            userLocation.lng = pos.coords.longitude;
        });
    }

    Authentication.initAuth(DB.getMyTrips);
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
    $('.auth-toggle').on('click', function() {
        if ($('#auth-login-form').is(':hidden')) {
            $('#auth-signup-form').hide();
            $('#auth-login-form').slideDown();
        } else {
            $('#auth-login-form').hide();
            $('#auth-signup-form').slideDown();
        }
    });

    $('#auth-login-form').on('submit', function(e) {
        e.preventDefault();
        let email = $('#auth-login-form-email').val(),
            password = $('#auth-login-form-password').val();

        Authentication.login(email, password);
    });

    $('#auth-signup-form').on('submit', function(e) {
        e.preventDefault();
        let email = $('#auth-signup-form-email').val(),
            password = $('#auth-signup-form-password').val(),
            password2 = $('#auth-signup-form-password-confirm').val();

        Authentication.signup(email, password, password2);
    });

    $('#map-container-menu-toggle').on('click', function() {
        $('#map-container-menu').slideToggle();
        map.invalidateSize();
    });

    $(document).on('click', '.triplist-trash', function() {
        if (confirm("Are you sure you want to delete this trip?")) {
            let trip = getTripByID($(this).attr('data-id'));
            DB.deleteTrip(trip);
        }
    });

    $(document).on('click', '.triplist-title', function() {
        console.log($(this).attr('data-id'));
    });

    $('#create-trip').on('click', function() {
        DB.createNewTrip();
    });
}