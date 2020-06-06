var UI = {
    login: function() {
        $('.content-section, #body-imagecredit').fadeOut();
        $('body').css('background-image', 'url("")');
        UI.loading.start(initMap);
    },
    logout: function() {
        $('#auth-login').slideDown();
    },
    loading: {
        start: function(callback = null) {
            $('#loading-fullscreen').show();
            if (callback) callback();
        },
        end: function(callback = null) {
            $('#loading-fullscreen').hide();
            if (callback) callback();
        }
    },
    map: {
        show: function(callback = null) {
            $('.content-section').hide();
            $('#map-container').slideDown();
            if (callback) callback();
        },
        hide: function(callback = null) {
            $('#map-container').hide();
            if (callback) callback();
        }
    },
    tripContainerHeightCheck: function() {
        // let wrapper = $("#map-container-menu-content");
        // if (wrapper.prop('scrollHeight') > wrapper.height() ) {
        //     wrapper.find('.ss-content').css('width', 
        //         parseFloat(wrapper.css('width')) + 18);
        // } else {
        //     wrapper.find('.ss-content').css('width', wrapper.css('width'));
        // }
    }
}