function showTask(element) {
    var task = null;
    for (var i = 0; i < element.parentNode.childNodes.length; i++) {
        if (element.parentNode.childNodes[i].className == "sub-task-list") {
            task = element.parentNode.childNodes[i];
            if (task.style.display === "block") {
                task.style.display = "none";
            } else {
                task.style.display = "block";
            }
            break;
        }
    }
}


$( document ).ready(function() {
     firebase.auth().onAuthStateChanged(function(user) {
         if (user) {

             console.log("Valid user is found");
             console.log("yei");
             showAvatar("side_pic");

         } else {
             // No user is signed in.
             console.log("no user is available");
         }
     });
 });