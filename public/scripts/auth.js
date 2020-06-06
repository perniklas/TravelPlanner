var Authentication = {
    auth: firebase.auth(),
    initAuth: function(callback = null) {
        Authentication.auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.email) {
                    UI.login();
                    Authentication.currentUser = user;
                    if (callback) callback();
                }
            } else {
                /* User logs out */
                UI.logout();
            }
        });
    },
    login: function(email, password) {
        Authentication.auth.signInWithEmailAndPassword(email, password).then((cred) => {
            $('#auth-login-form').trigger('reset');
            UI.login();
        }).catch(err => {
            console.log('[ERROR]: ' + err);
            $('#auth-signup-form .error').text(err.message).slideDown();   
        });
    },
    signup: function(email, password, repeatpassword) {
        if (verifyEmail(email) && verifyPasswords(password, repeatpassword)) {
            Authentication.auth.createUserWithEmailAndPassword(email, password).then((cred) => {
                $('#auth-signup-form').trigger('reset');
                $('#auth-signup-form .error').hide();
            }).catch((err) => {
                console.log('[ERROR]: ' +err);
                $('#auth-signup-form .error').text(err.message).slideDown();
            })
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