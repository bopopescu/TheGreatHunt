     var userDataRef = firebase.database().ref('TheGreatHunt/challenges');
 var userDataRef2 = firebase.database().ref('TheGreatHunt/users');
 // var storageRef = firebase.storage().ref('users/'+userID);


 function userInfo(){

      console.log("THIS HAS RUN");
      var userObject = firebase.auth().currentUser;
      var user = userObject.displayName;
      var userID = userObject.uid;

//      userDataRef2.orderbyChild("order");

      userDataRef2.child(userID).once("value", function(snapshot){


          var score= snapshot.val().points;

          document.getElementById("score").innerHTML =score;
      });


       userDataRef.orderByChild("creatorID").equalTo(user).on("value", function(snap){
        var num_tasks = snap.numChildren();
        console.log(num_tasks);
        document.getElementById("num_tasks").innerHTML = num_tasks;

        if (num_tasks == 0) {
            $('#table-created').replaceWith('<br><br><br><h4 style="text-align: center"> No challenges to display. ' +
                'Click the plus to make your first challenge! </h4>' +
                '<br><br><br><br>');
        }

        });



//      firebase.database().ref('TheGreatHunt').child("challenges").orderByChild("creatorID").equalTo("creatorID").once("value", function(snapshot){
//
//       console.log("SNAPSHOT: "+snapshot.exists());
//       var num_tasks = snapshot.numChildren();
//       document.getElementById("num_tasks").innerHTML = num_tasks;
//
//      })

  }



//user's accepted challenges


function addTriedChallenges()
{

    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    userDataRef2.child(userID).once("value", function (snap) {


    if(snap.hasChild("tried_challenges"))
    {

        console.log("USER DID TRY SOME CHALLENGES");
        var a = snap.val().tried_challenges;
        console.log(a);
        console.log(snap.numChildren);
        var progress1 = snap.val().task_completed;

        userDataRef2.child(userID+"/tried_challenges").once("value",function(datasnap){

            document.getElementById("num_challenges").innerHTML = datasnap.numChildren();

        })
        var keys = Object.keys(a);

        keys.forEach( item => {
            firebase.database().ref(`TheGreatHunt/challenges/${item}`).once('value', chAccepted => {
                // console.log(c.val());
                console.log(chAccepted);
                var tableA = document.getElementById("challengeAcceptedList");
                var rowA = tableA.insertRow(0);
                var cell1A = rowA.insertCell(0);
                var cell2A = rowA.insertCell(1);
                var cell3A = rowA.insertCell(2);
                var cell4A = rowA.insertCell(3);
                var cell5A = rowA.insertCell(4);
                var p = chAccepted.val().sum_ratings / chAccepted.val().total_ratings;
                cell1A.innerHTML = chAccepted.val().creatorID;
                cell2A.innerHTML = chAccepted.val().title;
                cell3A.innerHTML = chAccepted.val().time;
                // var i = 0;
                // var j = p + 1;
                // if (isNaN(p)) {
                //     while(i < 5) {
                //         cell4A.innerHTML += '<span class="fa fa-star"></span> ';
                //         i = i + 1;
                //     }
                // }
                // while (i < p){
                //     cell4A.innerHTML += '<span class="fa fa-star checked"></span> ';
                //     i = i + 1;
                // }
                // while (j <5){
                //     cell4A.innerHTML += '<span class="fa fa-star"></span> ';
                //     j = j + 1;
                // }
                cell4A.innerHTML = star(p);
                console.log(cell4A);
                firebase.database().ref(`TheGreatHunt/challenges/${item}`).once('value', ha =>{
                    firebase.database().ref(`TheGreatHunt/users/${userID}/tried_challenges/${item}`).once('value', h =>{
                        cell5A.innerHTML = '<div class="progress">' + '<div class="progress-bar progress-bar-striped active" ' +
                            'role="progressbar"' + 'aria-valuenow=' + Math.floor(((h.numChildren() - 2) / ha.val().num_tasks) * 100)+
                            ' aria-valuemin="0" aria-valuemax="100" style="width:' +
                            Math.floor(((h.numChildren() - 2) / ha.val().num_tasks) * 100)  + '%">' +
                            Math.floor(((h.numChildren() - 2) / ha.val().num_tasks) * 100)  + '%</div>';
                        console.log(h.numChildren());
                        console.log(ha.val().num_tasks)
                      });

                });

            });
        })

     }

     else
     {
         document.getElementById("num_challenges").innerHTML = "0";
         $('#table-accepted').replaceWith('<br><br><br><br><br><h4 style="text-align: center"> No challenges to display. ' +
             'Accept and complete you first challenge.</h4>');

         // $('#table-accepted').replaceWith('<br><br><br><h4 style="text-align: center"> No challenges to display.</h4>' +
         //     '<br><br><br><br>');
     }
    });

}


//user's created challenges

function addCreatedChallenges()
{
    var userObject = firebase.auth().currentUser;
    var user = userObject.displayName;

    userDataRef.orderByChild("creatorID").equalTo(user).on("child_added", function (snapshot) {

        // console.log(snapshot.val());
        // var newo = snapshot.val().num_tasks;
        // console.log(newo);
        var table = document.getElementById("challengeUserList");
        var row = table.insertRow(0);
        row.id = snapshot.key;
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var p = snapshot.val().sum_ratings / snapshot.val().total_ratings;
        cell1.innerHTML = snapshot.val().title;
        cell2.innerHTML = snapshot.val().time;
        // var i = 0;
        // var j = p;
        // if (isNaN(p)) {
        //     while(i < 5) {
        //         cell3.innerHTML += '<span class="fa fa-star"></span> ';
        //         i = i + 1;
        //     }
        // }
        // while (i < p){
        //     cell3.innerHTML += '<span class="fa fa-star checked"></span> ';
        //     i = i + 1;
        // }
        // while (j <5){
        //     cell3.innerHTML += '<span class="fa fa-star"></span> ';
        //     j = j + 1;
        // }

        cell3.innerHTML = star(p);

        var btn = document.createElement("BUTTON");
                btn.className = "btn btn-danger btn-xs";
                btn.innerHTML += '<i class="fa fa-trash-o"></i>';
                btn.value="Delete";
                btn.onclick = function(){
                               deleteRow(btn,snapshot.key);}




        var challengeRef = firebase.database().ref('TheGreatHunt').child('challenges');

        challengeRef.child(snapshot.key).once("value",function(dataSnapshot){
//            console.log(dataSnapshot.val().isAccepted);
            if(dataSnapshot.val().isAccepted){

                btn.disabled=true;
//                btn.opacity = .9;
            }



        })
        console.log(btn.disabled);
//        console.log(btn.opacity);

        cell4.appendChild(btn);


        //cell4.innerHTML = '<button class="btn btn-primary btn-xs"><i class="fa fa-pencil"'>;

    });

}


//Deletes challenge created by the user from database and webpage
    function deleteRow(btn, key){
      //console.log(key);
      var tempChallengeDataRef= firebase.database().ref('TheGreatHunt/challenges');
      var tempTaskDataRef= firebase.database().ref('TheGreatHunt/tasks');

      var element = document.getElementById(key);
      element.parentNode.removeChild(element);





      tempTaskDataRef.orderByChild("challenge_id").equalTo(key).once("value",function(snapshot){
        var data= snapshot.val();
        console.log(data);

        console.log("This is the parameter key: "+key);
        console.log("This is snapshot" + snapshot);
        console.log("This is snapshot key: "+snapshot.key);
        console.log("This is data  "+data);
        console.log("This is keys "+data);

        for (var task_key in data) {
            var tempTaskDataRef = firebase.database().ref('TheGreatHunt/tasks');
            tempTaskDataRef.child(task_key).remove();

        }

      })

      console.log("This should be deleted");
      tempChallengeDataRef.child(key).remove();

    }


function avatarWrapper()
{
   //console.log("this ran");
   showAvatar("main_pic");
   showAvatar("side_pic");

   if (firebase.auth().currentUser.providerData[0].providerId === "facebook.com" || firebase.auth().currentUser.providerData[0].providerId === "google.com") {
        console.log("should not be able to change avatar");
        document.getElementById("prof-pic").disabled=true;
       }
}


// window.addEventListener('load', loadingFunction, false);
// function loadingFunction()
// {
//
// setTimeout(function(){
//
//         firebase.auth().onAuthStateChanged(function(user) {
//             if (user) {
// //                var userRef = firebase.database().ref('TheGreatHunt').child('users');
// //                userRef.child(user.uid).on('value', function (snapshot) {
// //                    var data = snapshot.val();
// //
// //                    var challengeId = data.activeChallenge;
// //                    console.log(challengeId);
// //                    getTasks(challengeId);
// //                });
//
//                 console.log("Valid user is found");
//                 console.log("yei");
//
//             } else {
//                 // No user is signed in.
//                 console.log("no user is available");
//             }
//         });
//
//
//         avatarWrapper();
//             userInfo();
//             addTriedChallenges();
//             addCreatedChallenges();
//
//               },1500)
//
// }

// window.onload = function () {
//     firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
// //                var userRef = firebase.database().ref('TheGreatHunt').child('users');
// //                userRef.child(user.uid).on('value', function (snapshot) {
// //                    var data = snapshot.val();
// //
// //                    var challengeId = data.activeChallenge;
// //                    console.log(challengeId);
// //                    getTasks(challengeId);
// //                });
//             avatarWrapper();
//             userInfo();
//             addTriedChallenges();
//             addCreatedChallenges();
//
//             console.log("Valid user is found");
//             console.log("yei");
//
//         } else {
//             // No user is signed in.
//             console.log("no user is available");
//         }
//     });
// }

 $( document ).ready(function() {
     firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
//                var userRef = firebase.database().ref('TheGreatHunt').child('users');
//                userRef.child(user.uid).on('value', function (snapshot) {
//                    var data = snapshot.val();
//
//                    var challengeId = data.activeChallenge;
//                    console.log(challengeId);
//                    getTasks(challengeId);
//                });
             avatarWrapper();
             userInfo();
             addTriedChallenges();
             addCreatedChallenges();

             console.log("Valid user is found");
             console.log("yei");

         } else {
             // No user is signed in.
             console.log("no user is available");
         }
     });
 });






