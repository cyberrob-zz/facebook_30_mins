var default_time_limit = 30;
var option_restored = "Your usage limit restored to default.";
var option_saved = "Your usage limit saved."

function getOptions()
{
    if(localStorage["time_limit"] === undefined) {
        localStorage["time_limit"]= default_time_limit;
    }
    console.log("stored time_limit:" + localStorage["time_limit"]);
    $("#time_limit").val(localStorage["time_limit"]);
}

function saveOptions()
{
	user_time_limit = $("#time_limit").val();
	console.log("user_input: " + user_time_limit);

	if(user_time_limit != undefined) {
        localStorage["time_limit"] = user_time_limit;
    }
    $("#time_limit").val(localStorage["time_limit"]);
    $("#message").text(option_saved);
    showMessage();
    getOptions();
}

function eraseOptions()
{
	localStorage["time_limit"] = default_time_limit;
	$("#message").text(option_restored);
	showMessage();
	getOptions();
}

function showMessage() 
{  
    $("#message")
    	.fadeIn()
    	//.css({top:1000,position:'absolute'})
		.animate({top:275}, 800, function() {
    		setTimeout(function(){
    		hideMessage();
    	}, 2000);
    	
    });
} 
     
function hideMessage() 
{ 
	$("#message").fadeOut(800);    
}

$(document).ready(function() {
//$(window).load(function() {
	hideMessage();
	getOptions();

	$("#saveOption").click(function(){
		saveOptions();
	});

	$("#eraseOption").click(function(){
		eraseOptions();
	});

});



