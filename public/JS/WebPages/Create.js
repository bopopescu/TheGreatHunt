



// var user = user;
// var userID= userID;


var userDataRef = firebase.database().ref('TheGreatHunt/challenges');
var userDataRef2 = firebase.database().ref('TheGreatHunt/users');
var cont_id = 3;


console.log("file is being run");


//Deletes container of a task and its buttons of the given ids
function deleteTask(containerId,buttonsId)
{
    console.log(containerId);
    var element = document.getElementById(containerId);
    console.log(element.parentNode.removeChild(element));
    element=null;

    console.log(buttonsId);
    var elementButton = document.getElementById(buttonsId);
    console.log(elementButton.parentNode.removeChild(elementButton));
    elementButton=null;
    cont_id--;


}




//Clones the first task container and updates it with new id's if there are less than 11 tasks
function duplicate() {

    if(cont_id<=10)
    {

        var oldTask = document.getElementById("taskSet1");
        var oldButtons = document.getElementById("taskButtons1");

        var cloneTask = oldTask.cloneNode(true); // "deep" clone
        cloneTask.id = "taskSet" + ++cont_id; // there can only be one element with an ID
        // event handlers are not cloned
        oldTask.parentNode.appendChild(cloneTask);

        inputs = cloneTask.getElementsByTagName("input");
        //console.log(inputs);


        var task = inputs[0];
        var text_radio = inputs[1];
        var img_radio = inputs[2];
        var txt_answer= inputs[3];
        var img_answer= inputs[4];
        var hint = inputs[5];

        task.id = "task_"+cont_id;
        txt_answer.id = "txt_answer_"+cont_id;
        img_answer.id = "img_answer_"+cont_id;
        hint.id = "hint_"+cont_id;

        text_radio.id="text_type"+cont_id;
        text_radio.name="tsk_type"+cont_id;

        img_radio.id="img_type"+cont_id;
        img_radio.name="tsk_type"+cont_id;

        console.log(inputs);


        console.log("count "+cont_id+oldButtons);

        var cloneButtons = oldButtons.cloneNode(true);
        var currentButtons = "taskButtons"+cont_id;
        var currentTask = "taskSet"+cont_id;

        cloneButtons.id="taskButtons"+ cont_id;
        cloneButtons.getElementsByClassName("add_button")[0].onclick = function(){duplicate();}
        cloneButtons.getElementsByClassName("negative_button")[0].onclick = function(){deleteTask(currentTask,currentButtons);}
        cloneTask.getElementsByClassName("radio_buttons")[0].onclick = function(){ DisableImg("txt_answer_"+cont_id,"img_answer_"+cont_id)};
        cloneTask.getElementsByClassName("radio_buttons")[1].onclick = function(){ DisableTxt("txt_answer_"+cont_id,"img_answer_"+cont_id)};

        oldButtons.parentNode.appendChild(cloneButtons);


        console.log("Duplicate should be there");
    }

    else
    {
        alert("There can only be a maximum of 10 tasks");

    }



}



//INPUT VALIDATION FUNCTIONS FOR USER INPUT FOR CREATED TASKS

//Checks input of user in description field if it meets data cons
function validDesc(description)
{



    if(description === undefined){
        alert("Your title cannot be empty");
        return false;

    }

    if(description == "")
    {
        alert("Your description cannot be empty");
        return false
    }

    else if(description.length > 300)
    {
        alert("Your description cannot exceed 300 characters")
        return false
    }

    else
    {
        return true
    }
}

function validTitle(title)
{


    if(title === undefined){
        alert("Your title cannot be empty");
        return false;

    }

    else if(title.length == 0)
    {
        alert("Your title cannot be empty");
        return false;
    }

    else if(title.length >40)
    {
        alert("Your title cannot exceed 40 characters");
        return false;
    }

    else
    {
        return true;
    }



}

function validTask(task)
{

    if(task === undefined)
    {
        alert("Your task cannot be empty");
        return false;
    }

    else if(task.length == 0)
    {
        alert("Your task cannot be empty");
        return false;
    }

    else if(task.length >200)
    {
        alert("Your task cannot exceed 200 characters");
        return false;
    }

    else
    {
        return true;
    }

}

function validHint(hint)
{
    if(hint === undefined)
    {
        alert("Your hint cannot be empty");
        return false;
    }

    else if(hint.length == 0)
    {
        alert("Your hint cannot be empty");
        return false;
    }

    else if(hint.length >45)
    {
        alert("Your hint cannot exceed 45 characters");
        return false;
    }

    else
    {
        return true;
    }

}

function validTextAnswer(answer)
{




    if(answer === undefined)
    {
        console.log("is undefined called?");
        alert("Your answer cannot be empty");
        return false;
    }

    else if(answer.length == 0)
    {
        console.log("it was properly assigned");
        alert("Your answer cannot be empty");
        return false;
    }

    if(answer.length >120)
    {
        alert("Your hint answer exceed 60 characters");
        return false;
    }

    else
    {
        return true;
    }



}


function validHours(hours)
{

    if( hours === undefined)
    {
        return true;
    }

    if(isNaN(parseInt(hours)))
    {
        alert("Please type your hours with numbers");
        return false;
    }


    else if(hours < 0)
    {
        alert("You cannot use negative values");
        return false;
    }

    else if(hours >24)
    {
        alert("Your time limit cannot exceed 24 hours");
        return false;
    }

    else
    {
        return true;
    }


}


//function formattedAddress(rawInput)
//{
//    var geocoder = new google.maps.Geocoder();
//
//    geocoder.geocode(
//                    {
//                        'address': rawInput,
//                        'region': 'US'
//                    }, function(results, status) {
//                          if (status === 'OK') {
//                              var formattedAddress = results[0].formatted_address;
//                              }
//                          else
//                          {
//
//                            console.log("loading failed");
//                          }
//                              });
//
//
//
//}


//Submits all the information of the input fields of each task into the respective database slots

//IMAGE ANSWER IS NOT IMPLEMENTED YET
function submitStuff()
{

    var userObject = firebase.auth().currentUser;
    var user = userObject.displayName;
    var userID = userObject.uid;

    console.log("HOW MANY TIMES IS THIS CALLED?");

    var chRef = firebase.database().ref('TheGreatHunt').child('challenges');
    var taskRef = firebase.database().ref('TheGreatHunt').child('tasks');
    var newChRef = chRef.push();
    var count = document.getElementsByClassName("task_input").length;

    console.log("Print 1: "+document.getElementById("title"));
    console.log("Print 2: "+document.getElementById("description").value);

    var inputDesc = document.getElementById("description").value;
    var inputTitle = document.getElementById("title").value;
    var inputHours = document.getElementById("hour").value




    if(validTitle(inputTitle) && validDesc(inputDesc) && validHours(inputHours))
    {






        var allTasksValid = false;
        console.log("THIS IS HOW MANY THERE ARE "+count);

        for(var j=1; j<=count;j++)
        {
            var inputTask = document.getElementById("task_"+j).value;
            var inputTxtAnswer = document.getElementById("txt_answer_"+j).value;
            var inputImgAnswer = document.getElementById("img_answer_"+j).value;
            var inputHint = document.getElementById("hint_"+j).value;
            var isText = document.getElementById("text_type"+j).checked;
            console.log("RADIO IS:" +isText);
            console.log("task"+j+": "+inputTask);
            console.log("txt answer"+j+": "+inputTxtAnswer);
            console.log("img answer"+j+": "+inputImgAnswer);
            console.log("hint"+j+": "+inputHint);
//            console.log("TEST ADDRESS: "+ ("1228 south 36th"));



            if(isText)
            {
                console.log("did text check");
                if(validTask(inputTask) && validTextAnswer(inputTxtAnswer) && validHint(inputHint))
                {
                    if(j==3)
                    {
                        allTasksValid = true;
                    }

                }
            }


            else{
                console.log("did image check");
                if(validTask(inputTask) && validTextAnswer(inputImgAnswer) && validHint(inputHint))
                {
                    if(j==3)
                    {
                        allTasksValid = true;
                    }



                }

            }

        }

        console.log("ALL TASKS VALID: "+allTasksValid);
        if(allTasksValid){


            newChRef.set({
                description: document.getElementById("description").value,
                title: document.getElementById("title").value,
                num_tasks: count,
                sum_ratings: 0,
                total_ratings:0,
                creatorID: user,
                time: document.getElementById("hour").value,
                isAccepted: false

            });

            console.log(newChRef.key);
            for(var i=1; i<=count;i++)
            {


                var inputTask = document.getElementById("task_"+i).value;
                var inputTxtAnswer = document.getElementById("txt_answer_"+i).value;
                var inputImgAnswer = document.getElementById("img_answer_"+i).value;
                var inputHint = document.getElementById("hint_"+i).value;
                var inputType = !(document.getElementById("text_type"+i).checked);

                var newTaskRef = taskRef.push();
                newTaskRef.set({
                    challenge_id: newChRef.key,
                    description: inputTask,
                    completed:false,
                    string_answer: inputTxtAnswer,
                    image_answer: inputImgAnswer,
                    image_type: inputType,
                    hint: inputHint


                })
            }

            alert("Challenge Submitted!");
            window.location.reload();
        }



        else
        {

            console.log("THE DATA VALIDATION WAS NOT MET")
            alert("Invalid data");

        }

    }
}


function DisableTxt(txtButton, imgButton) {

    document.getElementById(imgButton).disabled = false;
    document.getElementById(txtButton).disabled = true;

}
function DisableImg(txtButton, imgButton) {
    console.log("This was called");

    document.getElementById(txtButton).disabled = false;
    document.getElementById(imgButton).disabled = true;

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
