$(() => {
    startListening();

    Authentication.initAuth();
});

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
}