var UI = {
    login: function() {
        $('#auth-login').hide();
        $('#loading-fullscreen').show();
    },
    logout: function() {
        $('#auth-login').slideDown();
    }
}