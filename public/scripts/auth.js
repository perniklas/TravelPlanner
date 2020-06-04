var Authentication = {
    auth: firebase.auth(),
    initAuth: function() {
        Authentication.auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.email) {
                    UI.login();
                }
            } else {
                /* User logs out */
                UI.logout();
            }
        });
    },
    login: function(email, password) {

    },
    signup: function(email, password, repeatpassword) {
        if (verifyPasswords(password, repeatpassword) && verifyEmail(email)) {

        }
    },
    currentUser: null
}

function verifyPasswords(pass1, pass2) {
    if (pass1 == pass2 && pass1.length >= 6) {
        return true;
    } else {
        if (pass1 != pass2) {
            $('#auth-signup-form .error').text("Passwords don't match").slideDown();
        } else if (pass1 == pass2 && pass1.length < 6) {
            $('#auth-signup-form .error').text("Password isn't long enough").slideDown();
        }
        return false;
    }
}

function verifyEmail(email) {
    if (typeof email === 'string' || email instanceof String) {
        return /\S+@\S+\.\S+/.test(email);
    }
    return false;
}