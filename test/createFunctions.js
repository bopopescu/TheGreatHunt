




//INPUT VALIDATION FUNCTIONS FOR USER INPUT FOR CREATED TASKS

//Checks input of user in description field if it meets data cons
exports.validDesc = function validDesc(description)
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

exports.validTitle = function validTitle(title)
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


exports.validTask = function validTask(task)
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

exports.validHint = function validHint(hint)
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

exports.validTextAnswer = function validTextAnswer(answer)
{
    if(answer === undefined)
    {
        alert("Your hint cannot be empty");
        return false;
    }

    else if(answer.length == 0)
    {
        alert("Your answer cannot be empty");
        return false;
    }

    else if(answer.length >120)
    {
        alert("Your hint answer exceed 60 characters");
        return false;
    }

    else
    {
        return true;
    }

}


exports.validHours = function validHours(hours)
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












