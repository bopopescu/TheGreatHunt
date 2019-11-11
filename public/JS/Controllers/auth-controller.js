window.onload = function () {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && document.URL.includes("/index.html")) {
            if (user.displayName != null) {
                window.location.replace("Homepage.html");
			}
        }

        if (user == null && !document.URL.includes("/index.html")) {
            window.location.replace("index.html");
        }
    });
}

function logIn() {
    $('#login-btn').prop('disabled', true);
	var email = document.getElementById('login-email').value;
	var password = document.getElementById('login-password').value;
	if (email.length == 0) {
		alert ('Please enter your email address.');
		return;
	}
	if (password.length == 0) {
		alert ('Please enter your password.');
		return;
	}
	
	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        window.location.replace("Homepage.html");
	}, function(error) {
        $('#login-btn').prop('disabled', false);
		var errorCode = error.code;
		var errorMessage = error.message;
		
		if (errorCode === 'auth/wrong-password') {
			alert ('Incorrect Password');
		} else {
			alert (errorMessage);
		}
		console.log(error);
	});
}

function signUp() {
    $('#signup-btn').prop('disabled', true);
	var email = document.getElementById('signup-email').value;
	var username = document.getElementById('signup-username').value;
	var password = document.getElementById('signup-password').value;
	
	if (email.length == 0) {
		alert ('Please enter an email address.');
        $('#signup-btn').prop('disabled', false);
		return;
	}

	if (username.length == 0) {
		alert ('Please enter a username.');
        $('#signup-btn').prop('disabled', false);
		return;
	} else if (username.length < 3) {
        alert ('Username is too short. \nUsername should be 3 to 20 characters long.');
        $('#signup-btn').prop('disabled', false);
        return;
    }

    if (username.length > 20) {
        alert ('Username is too long. \nUsername should be 3 to 20 characters long.');
        $('#signup-btn').prop('disabled', false);
        return;
    }

    if (password.length == 0) {
        alert ('Please enter a password.');
        $('#signup-btn').prop('disabled', false);
        return;
    }

    var userRef = firebase.database().ref('TheGreatHunt').child('users');
    userRef.orderByChild('username').equalTo(username).once("value", function (snapshot) {
    	console.log(snapshot.numChildren());
        if (snapshot.numChildren() != 0){
            alert ('Username already taken.');
            $('#signup-btn').prop('disabled', false);
            return;
        } else if (snapshot.numChildren() == 0){
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: username
                });

                var database = firebase.database().ref('TheGreatHunt');
                var userDataRef = database.child('users');

                userDataRef.child(user.uid).set({
                    username: username,
                    points: 0
                }).then(function() {
                    user.sendEmailVerification().then(function() {
                        alert ('Email Verification sent!');
                        window.location.replace("Homepage.html");
                    });
                });
            }, function(error) {
                $('#signup-btn').prop('disabled', false);
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert ('The password is too weak.');
                } else {
                    alert (errorMessage);
                }
            });
        }
    });
}

function signOut() {
	firebase.auth().signOut().then(function() {
        window.location.replace("index.html");
	}, function(error) {
	  console.error('Sign Out Error', error);
	});
}

// function checkLoginState() {
//     FB.getLoginStatus(function(response) {
//         statusChangeCallback(response);
//     });
// }

function fbLogin() {
    // FB.login((response) => {
    //     if (response.authResponse) {
    //         //user just authorized your app
    //         var user = firebase.auth().currentUser;
    //         var database = firebase.database().ref('TheGreatHunt');
    //         var userDataRef = database.child('users');
    //         window.location.replace("Homepage.html");
    //
    //         // userDataRef.child(user.uid).set({
    //         //     username: user.displayName,
    //         //     points: 0
    //         // }).then(function() {
    //         //     window.location.replace("Homepage.html");
    //         // });
    //
    //     }
    // }, {scope: 'default', return_scopes: true});

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('default');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken; // The signed-in user info.
        var user = result.user;

        if (user != null) {
            if (result.additionalUserInfo.isNewUser) {
                var database = firebase.database().ref('TheGreatHunt');
                var userDataRef = database.child('users');

                userDataRef.child(user.uid).set({
                    username: user.displayName,
                    points: 0
                }).then(function() {
                    window.location.replace("Homepage.html");
                });
            }
        }
    }).catch(function(error) {
        var errorCode = error.code;
        console.log(errorCode);
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
    });
}

function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        if (user != null) {
            if (result.additionalUserInfo.isNewUser) {
                var database = firebase.database().ref('TheGreatHunt');
                var userDataRef = database.child('users');

                userDataRef.child(user.uid).set({
                    username: user.displayName,
                    points: 0
                }).then(function() {
                    window.location.replace("Homepage.html");
                });
            } else {
                window.location.replace("Homepage.html");
            }
        }
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode);
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    // firebase.auth().getRedirectResult().then(function(result) {
    //     var user = result.user;
    //     console.log(result);
    //     if (user != null) {
    //         if (result.additionalUserInfo.isNewUser) {
    //             var database = firebase.database().ref('TheGreatHunt');
    //             var userDataRef = database.child('users');
    //
    //             userDataRef.child(user.uid).set({
    //                 username: user.displayName,
    //                 points: 0
    //             }).then(function() {
    //                 window.location.replace("Homepage.html");
    //             });
    //         }
	// 	}
    // }).catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     console.log(errorCode);
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //     // [START_EXCLUDE]
    //     if (errorCode === 'auth/account-exists-with-different-credential') {
    //         alert('You have already signed up with a different auth provider for that email.');
    //         // If you are using multiple auth providers on your app you should handle linking
    //         // the user's accounts here.
    //     } else {
    //         console.error(error);
    //     }
    //     // [END_EXCLUDE]
    // });
    // [END getidptoken]
}

function googleSignOut() {
	var googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.signOut().then(function() {
		firebase.auth().signOut();
    });
}

function passwordReset() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById('email-reset').value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        alert ('Reset Password email sent!');
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/user-not-found') {
            alert ('No account with that email address exists.');
        } else {
            alert (errorMessage);
        }
    });
}