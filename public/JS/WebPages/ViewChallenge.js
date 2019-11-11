var userDataRef2 = firebase.database().ref('TheGreatHunt/challenges');

//will order in rev alphabetical order work with this, change everything to lower case
function revOrder() {

userDataRef2.orderByChild('title').on('child_added', function(snap){

    var table = document.getElementById("viewChallengeList");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    
    cell1.innerHTML = snap.val().title;
    cell2.innerHTML = snap.val().creatorID;
    cell3.innerHTML = snap.val().num_tasks;
    cell4.innerHTML = snap.val().time;
    cell5.innerHTML = (snap.val().total_ratings / snap.val().sum_ratings) * 100;
    
});

}

//will order in alphabetical order work with this, change everything to lower case
function ascOrder() {

    userDataRef2.orderByChild('title').on('child_added', function(snap){
    
        var table = document.getElementById("viewChallengeList");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        
        cell1.innerHTML = snap.val().title;
        cell2.innerHTML = snap.val().creatorID;
        cell3.innerHTML = snap.val().num_tasks;
        cell4.innerHTML = snap.val().time;
        cell5.innerHTML = (snap.val().total_ratings / snap.val().sum_ratings) * 100;
        
    });
    
    }

//will order the challenges by the number of tasks it has, IN ASCENDING ORDER
function numTasksAO () {
    var Table = document.getElementById("challenge-table");
    Table.innerHTML = "";
    console.log('tassssssss');
userDataRef2.orderByChild('num_tasks').on('child_added', function(snap){


    var table = document.getElementById("viewChallengeList");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    
    cell1.innerHTML = snap.val().title;
    cell2.innerHTML = snap.val().creatorID;
    cell3.innerHTML = snap.val().num_tasks;
    cell4.innerHTML = snap.val().time;
    cell5.innerHTML = (snap.val().total_ratings / snap.val().sum_ratings) * 100;

});

}

//will order the challenges by the number of tasks it has, in descending order
function numTasksDO () {

userDataRef2.orderByChild('num_tasks').on('child_added', function(snap){


    var table = document.getElementById("viewChallengeList");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    
    cell1.innerHTML = snap.val().title;
    cell2.innerHTML = snap.val().creatorID;
    cell3.innerHTML = snap.val().num_tasks;
    cell4.innerHTML = snap.val().time;
    cell5.innerHTML = (snap.val().total_ratings / snap.val().sum_ratings) * 100;

});

}

var user = 'testing1234';
// //will give the challenges made by a specific user
function creatorID(user){

userDataRef2.orderByChild('creatorID').equalTo(user).on('child_added', function(snap){


    var table = document.getElementById("viewChallengeList");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    
    cell1.innerHTML = snap.val().title;
    cell2.innerHTML = snap.val().creatorID;
    cell3.innerHTML = snap.val().num_tasks;
    cell4.innerHTML = snap.val().time;
    cell5.innerHTML = (snap.val().total_ratings / snap.val().sum_ratings) * 100;
    
});

}

//FAILED MAP
// //will bring the challenges in rating order
// function rating(){
//     var c = 0;
// firebase.database().ref('TheGreatHunt/challenges').on('value', rate => {
//     var rating = (rate.val().total_ratings / rate.val().sum_ratings) * 100;
//     userDataRef2.orderByChild(rating).on('child_added', function(snap){
    
    
//         var table = document.getElementById("viewChallengeList");
//         var row = table.insertRow(c);
//         var cell1 = row.insertCell(0);
//         var cell2 = row.insertCell(1);
//         var cell3 = row.insertCell(2);
//         var cell4 = row.insertCell(3);
//         var cell5 = row.insertCell(4);
        
//         cell1.innerHTML = snap.val().title;
//         cell2.innerHTML = snap.val().creatorID;
//         cell3.innerHTML = snap.val().num_tasks;
//         cell4.innerHTML = snap.val().time;
//         cell5.innerHTML = (snap.val().total_ratings / snap.val().sum_ratings) * 100;
//         c = c + 1;
//     });

// });
    
//     }