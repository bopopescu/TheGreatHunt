$( document ).ready(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            if (document.URL.includes("play-challenge.html")) {
                var userRef = firebase.database().ref('TheGreatHunt').child('users');
                userRef.child(user.uid+"/activeChallenge").once('value', function (snapshot) {
                    var data = snapshot.val();

                    if (data == null){
                        $('#clockdiv').remove();
                        if (challengeId === undefined) {
                            $('#show-tasks').replaceWith('<br><h4 style="text-align: center">No active challenge.</h4>' +
                                '<br><br>');
                        }
                        return
                    }if (data.cancelled != undefined && data.cancelled == true){
                        cancel();
                        return;
                    }else{
                        var challengeId = data.challenge_id;
                    }


                    // getCookie('deadline')

                    var deadline = new Date(getCookie('deadline'));
                    if( deadline.getTime() <= Date.now()) {
                        var checker = "cancel";
                        deadline = new Date( Date.now());
                        var string = "deadline";
                        $('#show-tasks').replaceWith('<br><h4 id="expired" style="text-align: center">Challenge expired.</h4>' +
                            '<br><br>' +
                        '<div class= "rating">\n' +
                            '                <h5 style="font-weight: bold; font-size: 20px" id = star>' +
                            '                 <div id = class="form-group">\n' +
                            '                  <label id = "rating" for="sel1">Rate this Challenge:</label>\n' +
                            '                  <select  style="width: 60px" class="form-control" id="sel1">\n' +
                            '                    <option>1</option>\n' +
                            '                    <option>2</option>\n' +
                            '                    <option>3</option>\n' +
                            '                    <option>4</option>\n' +
                            '                    <option>5</option>\n' +
                            '                  </select>\n' +
                            '                </div>\n' +
                            '                  <p>\n' +
                            '\n' +
                            '                  </p>\n' +
                            '                  <button type="button" style="width: 80px" onclick="ratingUser()" class="btn btn-theme03">Submit</button>\n' +
                            '                </h5>\n' +
                            '\n');
                        calculatePoints();
                    } else if (deadline == "Invalid Date") {
                        console.log("test");
                        // $('#clockdiv').remove();
                        if (challengeId === undefined) {
                            $('#show-tasks').replaceWith('<br><h4 style="text-align: center">No active challenge.</h4>' +
                                '<br><br>');
                        }
                    } else {
                        $('#clockdiv').css('display', 'inline-block');
                        initializeClock('clockdiv', deadline);
                        getTasks(challengeId);
                    }
                });
            }

            if (document.URL.includes("view-challenges.html")) {
                loadChallenges();
                // numTasksAO();
            }
        } else {
            // No user is signed in.
        }
    });
});

function loadChallenges() {

    var challengeRef = firebase.database().ref('TheGreatHunt').child('challenges');
    var user = firebase.auth().currentUser;

    var userRef = firebase.database().ref('TheGreatHunt').child('users');
    userRef.child(user.uid).on('value', function (snapshot) {
        var data = snapshot.val();
        var num = 0;

        userRef.child(user.uid+"/activeChallenge").once('value', function (snapshot) {
            var data = snapshot.val();
            if (data == null) {
                var challengeId = null;
            } else {
                var challengeId = data.challenge_id;
            }


            challengeRef.once('value', function (snapshot) {
                snapshot.forEach(function (data) {
                    var challenge = data.val();
                    num ++;
                    var p = challenge.sum_ratings / challenge.total_ratings;
                    console.log(challenge.time);
                    var stars = star(p);
                    if(challenge.creatorID !== user.displayName) {
                        if (challengeId == undefined || challengeId == null) {
                            $('#challenge-table').append('<tr style="height: 50px;">\n' +
                                '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                                '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                                '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                                '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                                '                <td style="padding-top: 17px">\n' + stars +
                                '                </td>\n' +
                                '                <td style="padding-top: 14px">\n' +
                                '                    <span id="challenge-id' + num + '" style="display: none">' + data.key + '</span>\n' +
                                '                    <button class="btn btn-success btn-xs" id="play-btn' + num + '" onclick="previewChallenge(this)"><i class="fa fa-play"></i></button>\n' +
                                '                  </td>' +
                                '              </tr>')
                        } else {
                            $('#challenge-table').append('<tr style="height: 50px;">\n' +
                                '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                                '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                                '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                                '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                                '                <td style="padding-top: 17px">\n' + stars +

                                '                </td>\n' +
                                '              </tr>')
                        }
                    }
                })
            });
        });
    });
}

function previewChallenge(btn) {
    var id = btn.id;
    var index = id.split('n')[1];

    var challengeId = document.getElementById("challenge-id"+index).innerHTML;
    console.log(challengeId);

    console.log(id);
    console.log(index);
    console.log(challengeId);

    var challRef = firebase.database().ref('TheGreatHunt').child('challenges');

    challRef.orderByKey().equalTo(challengeId).on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var challenge = data.val();
            document.getElementById("challenge-title").innerHTML = challenge.title;
            document.getElementById("challenge-desc").innerHTML = challenge.description;
            document.getElementById("challenge-creator").innerHTML = challenge.creatorID;
            document.getElementById("challenge-tasks").innerHTML = challenge.num_tasks;
            document.getElementById("challenge-time").innerHTML = challenge.time;
            document.getElementById("challenge-key").innerHTML = data.key;
            $('#myModal').modal('show');
        })
    });
}

function acceptChallenge() {
    var challengeId =  document.getElementById("challenge-key").innerHTML;
    var time = document.getElementById("challenge-time").innerHTML;
    console.log(time);
    var user = firebase.auth().currentUser;
    var userRef = firebase.database().ref('TheGreatHunt').child('users');

    var challengeRef = firebase.database().ref('TheGreatHunt').child('challenges');
    challengeRef.child(challengeId).update({ isAccepted:true});


    userRef.child(user.uid).update({ activeChallenge: {challenge_id:challengeId}}).then(function () {
        var timer = time * 60 * 60 * 1000;
        console.log(timer, "timer");

        if (timer != 0){
            deadline = new Date( Date.now() + timer );
            setCookie('deadline', deadline.toUTCString());
        } else {
            deadline = NaN;
            console.log(deadline);
            setCookie('deadline', deadline);
        }
        window.location.replace("play-challenge.html");
    });


}

function cancel() {
    var userRef = firebase.database().ref('TheGreatHunt/users');
    var userID = firebase.auth().currentUser.uid;
    var checker = "cancel";
    userRef.child(userID).once('value', function (snapshot) {

        var challengeId = snapshot.val().activeChallenge;
        console.log("Hint challenge id: "+challengeId);
        console.log("path: "+ userID+"/tried_challenges/"+challengeId+"/task_id");

        firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge").update({cancelled: true});

        document.cookie = 'deadline' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        $('#clockdiv').css('display', 'none');

        $('#show-tasks').replaceWith('                <h5 style="font-weight: bold; font-size: 20px" id = star>' +
            '                 <div id = class="form-group">\n' +
            '                  <label id = "rating" for="sel1">Rate this Challenge:</label>\n' +
            '                  <select  style="width: 60px" class="form-control" id="sel1">\n' +
            '                    <option>1</option>\n' +
            '                    <option>2</option>\n' +
            '                    <option>3</option>\n' +
            '                    <option>4</option>\n' +
            '                    <option>5</option>\n' +
            '                  </select>\n' +
            '                </div>\n' +
            '                  <p>\n' +
            '\n' +
            '                  </p>\n' +
            '                  <button type="button" style="width: 80px" onclick="ratingUserCancel()" class="btn btn-theme03">Submit</button>\n' +
            '                </h5>\n' +
            '\n');

    });
}

function getTasks(id) {
    //console.log(ref);
    var taskRef = firebase.database().ref('TheGreatHunt').child('tasks');
    var num = 0;
    console.log(id);

    var userRef = firebase.database().ref('TheGreatHunt').child('users');
    var user = firebase.auth().currentUser;


    taskRef.orderByChild('challenge_id').equalTo(id).once("value", function(snapshot) {


        snapshot.forEach(function(data) {

            var task = data.val();
            var taskId = data.key;

            userRef.child(user.uid+"/activeChallenge").once('value', function (snap_shot) {
                var data = snap_shot.val();

                if (snap_shot.hasChild(taskId) && snap_shot.child(taskId).hasChild("answer")) {
                    userRef.child(user.uid+"/activeChallenge").child(taskId).once('value', function(minisnapshot) {
                        var mini = minisnapshot.val();

                        var answer;
                        var response = mini.answer;
                        num ++;

                        if (task.string_answer == undefined || task.string_answer === ''){
                            answer = task.image_answer;
                            $('.task-list').append('<li>\n' +
                                '                    <div class="task-title task-accordion" onclick="showTask(this)" id = "task-title'+ num +'">\n' +
                                '                      <span class="task-title-sp"> Task ' + num + '</span>\n' +
                                '                    </div>\n' +
                                '                    <div class="sub-task-list">\n' +
                                '                      <div class="room-box">\n' +
                                '                        <h5 class="text-primary">Prompt</a></h5>\n' +
                                '                        <p> ' + task.description + '</p>\n' +
                                '                        <button type="button" class="btn btn-default"    id="show-hint' + num + '" disabled>Show Hint</button>\n' +
                                '                        <span id="hint' + num + '"style="padding-left: 5px; font-weight: bold">' + task.hint + '</span>' +
                                '                      </div>' +
                                '                      <div class="room-box">\n' +
                                '                        <p>Your location: ' + response + '</p>\n' +
                                '                        <p>Correct location: ' + answer + '</p>\n' +
                                '                      </div>');
                        } else {
                            answer = task.string_answer;
                            $('.task-list').append('<li>\n' +
                                '                    <div class="task-title task-accordion" onclick="showTask(this)" id = "task-title'+ num +'">\n' +
                                '                      <span class="task-title-sp"> Task ' + num + '</span>\n' +
                                '                    </div>\n' +
                                '                    <div class="sub-task-list">\n' +
                                '                      <div class="room-box">\n' +
                                '                        <h5 class="text-primary">Prompt</a></h5>\n' +
                                '                        <p> ' + task.description + '</p>\n' +
                                '                        <button type="button" class="btn btn-default"    id="show-hint' + num + '" disabled>Show Hint</button>\n' +
                                '                        <span id="hint' + num + '"style="padding-left: 5px; font-weight: bold">' + task.hint + '</span>' +
                                '                      </div>' +
                                '                      <div class="room-box">\n' +
                                '                        <p>Your response: ' + response + '</p>\n' +
                                '                        <p>Correct Answer: ' + answer + '</p>\n' +
                                '                      </div>');
                        }

                        if (mini.correct == true) {
                            $('#task-title'+ num).append('<span class="badge bg-success">Correct</span>');

                        }
                        else {
                            $('#task-title' + num).append('<span class="badge bg-important">Wrong</span>');
                        }
                    });
                }else {
                    if (task.image_type == false) {
                        num ++;
                        $('.task-list').append('<li>\n' +
                            '                    <div class="task-title task-accordion" onclick="showTask(this)" id = "task-title'+ num +'">\n' +
                            '                      <span class="task-title-sp"> Task ' + num + '</span>\n' +
                            '                    </div>\n' +
                            '                    <div class="sub-task-list">\n' +
                            '                      <div class="room-box">\n' +
                            '                        <h5 class="text-primary">Prompt</a></h5>\n' +
                            '                        <p> ' + task.description + '</p>\n' +
                            '                        <button type="button" value= '+taskId+' class="btn btn-default"    id="show-hint' + num + '" onclick="showHint(this)">Show Hint</button>\n' +
                            '                        <span id="hint' + num + '"style="display: none; padding-left: 5px; font-weight: bold">' + task.hint + '</span>' +
                            '                      </div>\n' +
                            '                      <form class="form-horizontal style-form response" id = "form' + num + '">\n' +
                            '                        <div class="form-group">\n' +
                            '                          <label class="col-sm-2 col-sm-2 control-label">Text Response:</label>\n' +
                            '                          <div class="col-sm-10">\n' +
                            '                            <input type="text" id="txt-response' + num + '"class="form-control">\n' +
                            '                          </div>\n' +
                            '                        </div>\n' +
                            '                        <button type="button" value= '+id+' class="btn btn-theme03" onclick="checkTxtResponse(this)" id = "btn' + num +'"><i class="fa fa-check"></i> Submit</button>' +
                            '                        <span id = "correct-answer'+ num +'"style="display: none">' + task.string_answer + '</span>' +
                            '                      </form>\n' +
                            '                    </div>\n' +
                            '                  </li>' );

                        if (snap_shot.hasChild(taskId)){
                            console.log("treeeee");
                            $("#show-hint" + num ).prop('disabled', true);
                            $("#hint" + num).css('display', 'inline-block')
                        }

                    } else if (task.image_type == true) {
                        num ++;
                        $('.task-list').append('<li>\n' +
                            '                    <div class="task-title task-accordion" onclick="showTask(this)" id = "task-title'+ num +'">\n' +
                            '                      <span class="task-title-sp">Task ' + num + '</span>\n' +
                            '                    </div>\n' +
                            '                    <div class="sub-task-list">\n' +
                            '                      <div class="room-box">\n' +
                            '                        <h5 class="text-primary">Prompt</a></h5>\n' +
                            '                        <p>'+ task.description + '</p>\n' +
                            '                        <button type="button" value= '+taskId+' class="btn btn-default" id="show-hint' + num + '" onclick="showHint(this)">Show Hint</button>\n' +
                            '                        <span id="hint' + num + '" style="display: none; padding-left: 5px; font-weight: bold">' + task.hint + '</span>' +
                            '                      </div>\n' +
                            '                      <form class="form-horizontal style-form response" id = "form' + num + '">\n' +
                            '                        <div class="form-group">\n' +
                            '                          <label class="control-label col-md-3">Image response:</label>\n' +
                            '                          <div class="controls col-md-9">\n' +
                            '                            <div class="fileupload fileupload-new" data-provides="fileupload">\n' +
                            '                              <span class="btn btn-theme02 btn-file">\n' +
                            '                                <span class="fileupload-new"><i class="fa fa-paperclip"></i> Select file</span>\n' +
                            '                                <span class="fileupload-exists"><i class="fa fa-undo"></i> Change</span>\n' +
                            '                                <input type="file" id="img-response' + num + '"class="default" />\n' +
                            '                              </span>\n' +
                            '                              <span class="fileupload-preview" style="margin-left:5px;"></span>\n' +
                            '                              <a href="advanced_form_components.html#" class="close fileupload-exists" data-dismiss="fileupload" style="float: none; margin-left:5px;"></a>\n' +
                            '                            </div>\n' +
                            '                            <div>\n' +
                            '                              <span class="label label-info">NOTE!</span>\n' +
                            '                              <span>Ensure geotagging is enabled when taking images.</span>\n' +
                            '                            </div>\n' +
                            '                          </div>\n' +
                            '                        </div>\n' +
                            '                        <button type="button" value= '+id+' class="btn btn-theme03" onclick="checkImgResponse(this)"id = "btn' + num +'"><i class="fa fa-check"></i> Submit</button>' +
                            '                        <span id = "correct-answer'+ num +'"style="display: none">' + task.image_answer + '</span>' +
                            '                      </form>\n' +
                            '                    </div>\n' +
                            '                  </li>');

                        if (snap_shot.hasChild(taskId)){
                            console.log("treeeee");
                            $("#show-hint" + num ).prop('disabled', true);
                            $("#hint" + num).css('display', 'inline-block')
                        }
                    }
                }

            });

        });
    });

}

function showHint(btn) {
    var id = btn.id;
    var index = id.split('t')[1];
    console.log(id);
    console.log(index);
    $("#" + btn.id).prop('disabled', true);
    $("#hint" + index).css("display", "inline-block");

    utid = btn.value;
    console.log("why is this task id: "+utid);
    console.log("type of the utid is: "+typeof(utid));


    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var userRef = firebase.database().ref('TheGreatHunt/users');

    userRef.child(userID).once('value', function (snapshot) {

        var challengeId = snapshot.val().activeChallenge;
        console.log("Hint challenge id: "+challengeId);
        console.log("path: "+ userID+"/tried_challenges/"+challengeId+"/task_id");

        firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge/"+utid).update({used_hint: true});

    })

}

function taskCompleted()
{
    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var count = 0;

    firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge").once('value').then((snapshot) => {
        snapshot.forEach((data) => {

            if (data.answer != undefined || data.answer != null) {
                count += 1;
            } else {
                count += 0;
            }
        })
    }).then(() => {
        console.log("test");
        return count;
    })
}

function checkTxtResponse(btn) {

    var id = btn.id;
    var index = id.split('t')[1];
    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var userRef = firebase.database().ref('TheGreatHunt/users');
    var taskRef = firebase.database().ref('TheGreatHunt').child('tasks');


    $(document).on("click","#"+btn.id, function () {
        var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
        var index = clickedBtnID.split('n')[1];

        var response = document.getElementById("txt-response" + index).value;
        response = response.trim();
        var answer = document.getElementById("correct-answer" + index).innerHTML;


        var areEqual = response.toUpperCase() === answer.toUpperCase();
        userRef.child(userID).once('value', function (datasnapshot) {



              userRef.child(userID+"/activeChallenge").once('value', function (snapshot) {
                    var data = snapshot.val();
                    var challengeId = data.challenge_id;


                    var utid = document.getElementById("show-hint"+index).value;
                    var cid = document.getElementById("btn"+index).value;
                    console.log("task id: "+utid);



                    firebase.database().ref('TheGreatHunt/users/'+userID+"/active_challenge/"+challengeId+"/"+utid).once('value',function(snapshot)
                    {


                        if (areEqual) {
                            $('#task-title'+ index).append('<span class="badge bg-success">Correct</span>');
                            firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge/"+"/"+utid).update({answer: response, correct:true});

                        }
                        else {
                            console.log("this ran at least once");
                            $('#task-title' + index).append('<span class="badge bg-important">Wrong</span>');
                            firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge/"+"/"+utid).update({answer: response, correct:false});
                         }

                        $("#"+clickedBtnID).css("display","none");
                        $("#show-hint"+index).prop('disabled', true);
                        $('#form' + index).replaceWith('<div class="room-box">\n' +
                            '                        <p>Your response: ' + response + '</p>\n' +
                            '                        <p>Correct Answer: ' + answer + '</p>\n' +
                            '                      </div>');

                        var challRef = firebase.database().ref('TheGreatHunt').child('challenges');

                        challRef.orderByKey().equalTo(cid).on("value", function(snapshot) {

                            var userObject = firebase.auth().currentUser;
                            var userID = userObject.uid;
                            var count = 0;

                            snapshot.forEach(function (snap) {

                                firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge").once('value').then((snapshot2) => {
                                    snapshot2.forEach((info) => {

                                        var data = info.val();

                                        console.log(data);

                                        if (data.answer != undefined || data.answer != null) {
                                            count += 1;
                                        } else {
                                            console.log('anjdjd');
                                            count += 0;
                                        }
                                    })
                                }).then(() => {
                                    console.log(count);
                                    console.log(snap.val().num_tasks);
                                    if(snap.val().num_tasks == count) {
                                        firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge").update({completed: true});
                                        var checker = "complete";

                                        document.cookie = 'deadline' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                        $('#clockdiv').css('display', 'none');

                                        $('#show-tasks').append('                <h5 style="font-weight: bold; font-size: 20px" id = star>' +
                                            '                 <div id = class="form-group">\n' +
                                            '                  <label id = "rating" for="sel1">Rate this Challenge:</label>\n' +
                                            '                  <select  style="width: 60px" class="form-control" id="sel1">\n' +
                                            '                    <option>1</option>\n' +
                                            '                    <option>2</option>\n' +
                                            '                    <option>3</option>\n' +
                                            '                    <option>4</option>\n' +
                                            '                    <option>5</option>\n' +
                                            '                  </select>\n' +
                                            '                </div>\n' +
                                            '                  <p>\n' +
                                            '\n' +
                                            '                  </p>\n' +
                                            '                  <button type="button" style="width: 80px" onclick="ratingUser()" class="btn btn-theme03">Submit</button>\n' +
                                            '                </h5>\n' +
                                            '\n');

                                        calculatePoints()
                                    }
                                })
                            })

                        })


                    });
                            })



            })}
            )}


function calculatePoints() {

    var user = firebase.auth().currentUser;
    var userRef = firebase.database().ref('TheGreatHunt/users');


    userRef.child(user.uid).once('value', function (snap) {
        var points = snap.val().points;

        console.log(points);

        userRef.child(user.uid+"/activeChallenge").once('value', function (snapshot) {
            // if (data == null) {
            //     var challengeId = null;
            // } else {
            //     var challengeId = data.challenge_id;
            // }

            // console.log(data);

            snapshot.forEach(function (info) {
                var data = info.val();
                console.log(data);
                if (data.correct == true) {
                    if(data.used_hint == undefined) {
                        points += 2;
                    } else {
                        points += 1;
                    }
                }

                console.log(points);

                userRef.child(user.uid).update({points: points});

            });

        });
    })
}


function checkImgResponse(btn) {

    var userRef = firebase.database().ref('TheGreatHunt/users');
    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var checker = "complete";


    userRef.child(userID).once('value', function (datasnapshot) {



    $(document).on("click","#"+btn.id, function () {
        var clickedBtnID = $(this).attr('id'); // or var clickedBtnID = this.id
        var index = clickedBtnID.split('n')[1];
        var challengeId = datasnapshot.val().activeChallenge;
        var utid = document.getElementById("show-hint"+index).value;
        var cid = document.getElementById("btn"+index).value;


        var answer = document.getElementById("correct-answer" + index).innerHTML;
        var response = document.getElementById("img-response" + index).files[0];

        EXIF.getData(response, function () {
            var long = EXIF.getTag(response, 'GPSLongitude');
            var longRef = EXIF.getTag(response, 'GPSLongitudeRef');
            long = convertLongitude(longRef, long);

            var lat = EXIF.getTag(response, 'GPSLatitude');
            var latRef = EXIF.getTag(response, 'GPSLatitudeRef');
            lat = convertLatitude(latRef, lat);

            var geocoder = new google.maps.Geocoder;
            var latlng = {lat: parseFloat(lat), lng: parseFloat(long)};
            geocoder.geocode(
                {
                    'location': latlng,
                    'region': 'US'
                }, function (results, status) {
                    if (status === 'OK') {
                        userRef.child(userID+"/activeChallenge").once('value', function (snapshot) {
                            var data = snapshot.val();
                            var challengeId = data.challenge_id;

                            if (results[0]) {
                                var areEqual = results[0].formatted_address.toUpperCase() === answer.toUpperCase();
                                 firebase.database().ref('TheGreatHunt/users/'+userID+"/active_challenge/"+challengeId+"/"+utid).once('value',function(snapshot){
                                    if (areEqual) {
                                        $('#task-title'+ index).append('<span class="badge bg-success">Correct</span>')
                                                     }
                                    else {
                                        $('#task-title' + index).append('<span class="badge bg-important">Wrong</span>')

                                    }
                                    })

                                    var userObject = firebase.auth().currentUser;
                                    var userID = userObject.uid;

                                    firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge/"+"/"+utid).update({answer: answer});



                                $(".fileupload-exists").css("display, none");
                                $("#"+clickedBtnID).css("display","none");
                                $("#show-hint"+index).prop('disabled', true);
                                $('#form' + index).replaceWith('<div class="room-box">\n' +
                                    '                        <p>Your Location: ' + results[0].formatted_address + '</p>\n' +
                                    '                        <p>Correct Location: ' + answer + '</p>\n' +
                                    '                      </div>');

                                var challRef = firebase.database().ref('TheGreatHunt').child('challenges');

                                challRef.orderByKey().equalTo(cid).on("value", function(snapshot) {

                                    var userObject = firebase.auth().currentUser;
                                    var userID = userObject.uid;
                                    var count = 0;

                                    snapshot.forEach(function (snap) {

                                        firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge").once('value').then((snapshot2) => {
                                            snapshot2.forEach((info) => {

                                                var data = info.val();

                                                console.log(data);

                                                if (data.answer != undefined || data.answer != null) {
                                                    count += 1;
                                                } else {
                                                    console.log('anjdjd');
                                                    count += 0;
                                                }
                                            })
                                        }).then(() => {
                                            console.log(count);
                                            console.log(snap.val().num_tasks);
                                            if(snap.val().num_tasks == count) {
                                                firebase.database().ref('TheGreatHunt/users/'+userID+"/activeChallenge").update({completed: true});
                                                var checker = "complete";

                                                document.cookie = 'deadline' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                                $('#clockdiv').css('display', 'none');

                                                $('#show-tasks').append('                <h5 style="font-weight: bold; font-size: 20px" id = star>' +
                                                    '                 <div id = class="form-group">\n' +
                                                    '                  <label id = "rating" for="sel1">Rate this Challenge:</label>\n' +
                                                    '                  <select  style="width: 60px" class="form-control" id="sel1">\n' +
                                                    '                    <option>1</option>\n' +
                                                    '                    <option>2</option>\n' +
                                                    '                    <option>3</option>\n' +
                                                    '                    <option>4</option>\n' +
                                                    '                    <option>5</option>\n' +
                                                    '                  </select>\n' +
                                                    '                </div>\n' +
                                                    '                  <p>\n' +
                                                    '\n' +
                                                    '                  </p>\n' +
                                                    '                  <button type="button" style="width: 80px" onclick="ratingUser()" class="btn btn-theme03">Submit</button>\n' +
                                                    '                </h5>\n' +
                                                    '\n');

                                                calculatePoints()
                                            }
                                        })
                                    })
                                })
                            } else {
                                window.alert('No results found');
                            }
                            })
                    } else {
                        if (lat == undefined || long == undefined) {
                            window.alert('Image does not have location information.');
                        } else {
                            window.alert('Geocoder failed due to: ' + status);
                        }
                    }
                });
        });
    });
})}


function convertLatitude(exifLatRef, exifLat) {
    if (exifLat == undefined || exifLatRef == undefined)
        return;

    if (exifLatRef == "S") {
        var latitude = (exifLat[0] * -1) + (( (exifLat[1] * -60) + (exifLat[2] * -1) ) / 3600);
    } else {
        var latitude = exifLat[0] + (( (exifLat[1]*60) + exifLat[2] ) / 3600);
    }
    return latitude;
}

function convertLongitude(exifLongRef, exifLong) {
    if (exifLong == undefined || exifLongRef == undefined)
        return;

    if (exifLongRef == "W") {
        var longitude = (exifLong[0] * -1) + (( (exifLong[1] * -60) + (exifLong[2] * -1) ) / 3600);
    } else {
        var longitude = exifLong[0] + (( (exifLong[1] * 60) + exifLong[2] ) / 3600);
    }
    return longitude;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function loadChallengesASNumTasks() {
    
    var tableHeaderRowCount = 1;
    var table = document.getElementById('challenge-table');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
    }  

    
    document.getElementById("numTasksb").disabled = true;
    document.getElementById("timeOrder").disabled = false;
    var challengeRef = firebase.database().ref('TheGreatHunt').child('challenges');
    var user = firebase.auth().currentUser;

    var userRef = firebase.database().ref('TheGreatHunt').child('users');
    userRef.child(user.uid).once('value', function (snapshot) {
        var data = snapshot.val();
        var num = 0;

        var challengeId = data.activeChallenge;
        var challengeId;
        challengeRef.orderByChild('num_tasks').once('value', function(snapshot) {
            snapshot.forEach(function (data) {
                var challenge = data.val();
                num ++;
                var p = challenge.sum_ratings / challenge.total_ratings;
                console.log(p);
                var stars = star(p);
                if(challenge.creatorID !== user.displayName) {
                    if (challengeId == undefined || challengeId == null) {
                        $('#challenge-table').append('<tr style="height: 50px;">\n' +
                            '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                            '                <td style="padding-top: 17px">\n' + stars +
                                              
                            '                </td>\n' +
                            '                <td style="padding-top: 14px">\n' +
                            '                    <span id="challenge-id' + num + '" style="display: none">' + data.key + '</span>\n' +
                            '                    <button class="btn btn-success btn-xs" id="play-btn' + num + '" onclick="previewChallenge(this)"><i class="fa fa-play"></i></button>\n' +
                            '                  </td>' +
                            '              </tr>')
                    } else {
                        $('#challenge-table').append('<tr style="height: 50px;">\n' +
                            '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                            '                <td style="padding-top: 17px">\n' + stars + 
                                              
                            '                </td>\n' +
                            '              </tr>')
                    }
                }
            })
        });
    });
}

function ratingUser() {

    var e = document.getElementById("sel1");
    var response = e.options[e.selectedIndex].text;
    console.log(response);


    $('#expired').remove();

    $('#star').replaceWith('<br><h4 style="text-align: center">No active challenge.</h4>' +
        '<br><br>');

    $('#show-tasks').replaceWith('<br><h4 style="text-align: center">No active challenge.</h4>' +
        '<br><br>');

    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var userRef = firebase.database().ref('TheGreatHunt/users');
    
    userRef.child(userID+"/activeChallenge").once('value', function (datasnapshot) {

                    var challengeId = datasnapshot.val().challenge_id;
    
        
                    firebase.database().ref('TheGreatHunt/challenges/' + challengeId).once('value',function(snapshot)
                    {
                        var creator = snapshot.val().creatorID;
                        var descriptionu = snapshot.val().description;
                        var numtasks = snapshot.val().num_tasks;
                        var timeuser = snapshot.val().time;
                        var titleuser = snapshot.val().title;
                        var sumratings = snapshot.val().sum_ratings;
                        var totalratings = snapshot.val().total_ratings;

                        firebase.database().ref('TheGreatHunt/challenges/' + challengeId).update({ creatorID: creator,
                            description: descriptionu, num_tasks: numtasks, time: timeuser, title: titleuser,
                            sum_ratings: (parseInt(sumratings) + parseInt(response)), total_ratings: (parseInt(totalratings) + 1) });



                        firebase.database().ref('TheGreatHunt/users/'+userID+'/tried_challenges/' + challengeId).set(datasnapshot.val());
                        firebase.database().ref('TheGreatHunt/users/'+userID+'/activeChallenge').remove();
                    });

        });

}

function ratingUserCancel() {

    var e = document.getElementById("sel1");
    var response = e.options[e.selectedIndex].text;
    console.log(response);

    $('#star').replaceWith('<br><h4 style="text-align: center">No active challenge.</h4>' +
        '<br><br>');

    var userObject = firebase.auth().currentUser;
    var userID = userObject.uid;
    var userRef = firebase.database().ref('TheGreatHunt/users');

    userRef.child(userID+"/activeChallenge").once('value', function (datasnapshot) {

        var challengeId = datasnapshot.val().challenge_id;


        firebase.database().ref('TheGreatHunt/challenges/' + challengeId).once('value',function(snapshot)
        {
            var creator = snapshot.val().creatorID;
            var descriptionu = snapshot.val().description;
            var numtasks = snapshot.val().num_tasks;
            var timeuser = snapshot.val().time;
            var titleuser = snapshot.val().title;
            var sumratings = snapshot.val().sum_ratings;
            var totalratings = snapshot.val().total_ratings;

            firebase.database().ref('TheGreatHunt/challenges/' + challengeId).update({ creatorID: creator,
                description: descriptionu, num_tasks: numtasks, time: timeuser, title: titleuser,
                sum_ratings: (parseInt(sumratings) + parseInt(response)), total_ratings: (parseInt(totalratings) + 1) });



            firebase.database().ref('TheGreatHunt/users/'+userID+'/activeChallenge').remove();

        });
    });

}

function loadChallengesTime() {
    
    var tableHeaderRowCount = 1;
    var table = document.getElementById('challenge-table');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
    }  


    document.getElementById("numTasksb").disabled = false;
    document.getElementById("timeOrder").disabled = true;
    var challengeRef = firebase.database().ref('TheGreatHunt').child('challenges');
    var user = firebase.auth().currentUser;

    var userRef = firebase.database().ref('TheGreatHunt').child('users');
    userRef.child(user.uid).once('value', function (snapshot) {
        var data = snapshot.val();
        var num = 0;

        var challengeId = data.activeChallenge;
        challengeRef.orderByChild('time').once('value', function(snapshot) {
            snapshot.forEach(function (data) {
                var challenge = data.val();
                num ++;
                var p = challenge.sum_ratings / challenge.total_ratings;
                console.log(challenge.time);
                var stars = star(p);
                if(challenge.creatorID !== user.displayName) {
                    if (challengeId == undefined || challengeId == null) {
                        $('#challenge-table').append('<tr style="height: 50px;">\n' +
                            '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                            '                <td style="padding-top: 17px">\n' + stars +
                                              
                            '                </td>\n' +
                            '                <td style="padding-top: 14px">\n' +
                            '                    <span id="challenge-id' + num + '" style="display: none">' + data.key + '</span>\n' +
                            '                    <button class="btn btn-success btn-xs" id="play-btn' + num + '" onclick="previewChallenge(this)"><i class="fa fa-play"></i></button>\n' +
                            '                  </td>' +
                            '              </tr>')
                    } else {
                        $('#challenge-table').append('<tr style="height: 50px;">\n' +
                            '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                            '                <td style="padding-top: 17px">\n' + stars + 
                                              
                            '                </td>\n' +
                            '              </tr>')
                    }
                }
            })
        });
    });
}

function loadChallengesByUser() {
    var username = document.getElementById("username").value;
    var tableHeaderRowCount = 1;
    var table = document.getElementById('challenge-table');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
    }  


    document.getElementById("numTasksb").disabled = false;
    document.getElementById("timeOrder").disabled = false;
    var challengeRef = firebase.database().ref('TheGreatHunt').child('challenges');
    var user = firebase.auth().currentUser;

    var userRef = firebase.database().ref('TheGreatHunt').child('users');
    userRef.child(user.uid).on('value', function (snapshot) {
        var data = snapshot.val();
        var num = 0;

        var challengeId = data.activeChallenge;
        challengeRef.orderByChild('creatorID').equalTo(username).on('value', function(snapshot) {
            snapshot.forEach(function (data) {
                var challenge = data.val();
                num ++;
                var p = challenge.sum_ratings / challenge.total_ratings;
                console.log(challenge.time);
                var stars = star(p);
                if(challenge.creatorID !== user.displayName) {
                    if (challengeId == undefined || challengeId == null) {
                        $('#challenge-table').append('<tr style="height: 50px;">\n' +
                            '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                            '                <td style="padding-top: 17px">\n' + stars +
                                              
                            '                </td>\n' +
                            '                <td style="padding-top: 14px">\n' +
                            '                    <span id="challenge-id' + num + '" style="display: none">' + data.key + '</span>\n' +
                            '                    <button class="btn btn-success btn-xs" id="play-btn' + num + '" onclick="previewChallenge(this)"><i class="fa fa-play"></i></button>\n' +
                            '                  </td>' +
                            '              </tr>')
                    } else {
                        $('#challenge-table').append('<tr style="height: 50px;">\n' +
                            '                <td style="padding-top: 17px">' + challenge.creatorID + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.title + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.num_tasks + '</td>\n' +
                            '                <td style="padding-top: 17px">' + challenge.time + '</td>\n' +
                            '                <td style="padding-top: 17px">\n' + stars +
                                              
                            '                </td>\n' +
                            '              </tr>')
                    }
                }
            })
        });
    });
}


function star(p){
    var i = 0;
    var j = Math.round(p * 2) / 2;
    var x;
    var $elements = [];

    if (!isNaN(j)) {
        for (i = j; i >= 1; i--)
            $elements.push('<span class="fa fa-star checked"></span> ');
        //
        // If there is a half a star, append it
        if (i > 0 && i < 1) $elements.push('<span class="fa fa-star-half-o" style="color: #4ECDC4"></span> ');

        for (x = 5 - j; x >= 1; x--) {
            $elements.push('<span class="fa fa-star"></span> ');
        }
    } else if (isNaN(j)){
        for (x = 0; x < 5; x++) {
            $elements.push('<span class="fa fa-star"></span> ');
        }
    }
    return $elements.join('');
}

