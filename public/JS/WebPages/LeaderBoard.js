var userDataRef2 = firebase.database().ref('TheGreatHunt/users');
var counter=0;

$( document ).ready(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            showAvatar("side_pic");
            userDataRef2.orderByChild('points').on('value', function(snapshot){
                var num = snapshot.numChildren();
                snapshot.forEach(function (snap) {
                    var table = document.getElementById("challengeUserList");
                    var row = table.insertRow(0);

                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);

                    cell1.innerHTML = num - counter;


                    cell2.innerHTML = snap.val().username;
                    cell3.innerHTML = snap.val().points;

                    counter ++;
                })
            });
        }
    });
});




