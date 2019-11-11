

function showAvatar(img_id){

    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;

    var storageRef = firebase.storage().ref('users/' + userID);

    if(userObject.photoURL != null) {

        console.log("This is the photo url: "+userObject.photoURL);
        console.log("provider id: "+firebase.auth().currentUser.providerData[0].providerId );

        if (firebase.auth().currentUser.providerData[0].providerId === "facebook.com" ||
            firebase.auth().currentUser.providerData[0].providerId === "google.com") {
            document.getElementById(img_id).src = userObject.photoURL;
        } else {
            storageRef.child('avatar.png').getDownloadURL().then(function(url) {

                //console.log(img_id);
                var test = url;

                document.getElementById(img_id).src = test;
            });
        }

        document.getElementById(img_id).src = userObject.photoURL;
    }

    else {
        console.log("The user has no photo url");
        var storageRef = firebase.storage().ref();
        storageRef.child('default-profile.jpg').getDownloadURL().then(function(url) {

            //console.log(img_id);
            var test = url;

            document.getElementById(img_id).src = test;

        })
    }

    if(document.URL.includes("/Homepage.html")) {
        var storageRef = firebase.storage().ref('users/'+userID);
        storageRef.child("user-bio").getDownloadURL().then(function(url) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.onload = function(event) {
                var blob = xhr.response;
                document.getElementById("prof-bio").innerHTML = blob;
            };
            xhr.open('GET', url);
            xhr.send();
        }).catch(function(error) {
            document.getElementById("prof-bio").innerHTML = "Bio~";
        });
    }
}


function changeAvatar(){
    $('#myModal').modal('hide');

    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var storageRef = firebase.storage().ref('users/' + userID);

    // imgChange.addEventListener('change', function(e){
    //
    //     var imgChange = document.getElementById("imgChange");
    //     var main_pic = document.getElementById("main_pic");
    //     var file = e.target.files[0];
    //     storageRef.child('avatar.png').put(file);
    //
    //     console.log("Image hasnt changed yet");
    //
    //     setTimeout(function(){
    //         showAvatar("main_pic");
    //         showAvatar("side_pic");
    //         console.log("try this");
    //     },1500)
    //
    //     console.log("Image should change");
    //
    // });

    var file = document.getElementById("prof-pic").files[0];

//    var bio = document.getElementById("user-bio").value;

    if (file !== undefined) {
        storageRef.child('avatar.png').put(file);
    }
//    if (bio !== undefined) {
//        storageRef.child('user-bio').putString(bio);
//    }

    console.log("Image hasnt changed yet");


        setTimeout(function(){
            storageRef.child('avatar.png').getDownloadURL().then(function(url) {

                //console.log(img_id);
                var test = url;

                userObject.updateProfile( {
                    photoURL: test
                })
            });
        },2000)


    setTimeout(function(){
        showAvatar("main_pic");
        showAvatar("side_pic");
    },3000)
}

function changeBio(){
    $('#myModal').modal('hide');
    console.log("This was called");

    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var storageRef = firebase.storage().ref('users/' + userID);

    var bio = document.getElementById("user-bio").value;

    if (bio !== undefined && bio.length <= 600 ) {
            storageRef.child('user-bio').putString(bio);
        }
    else{
        alert("Your bio must be less than 600 characters");
    }


}

$( document ).ready(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && document.URL.includes("/Homepage.html")) {
            $(".sidebar-menu h5").text(user.displayName);
            $(".profile-text h3").text(user.displayName);
        } else if (user && !document.URL.includes("/Homepage.html")) {
            $(".sidebar-menu h5").text(user.displayName);
        }
    });
});