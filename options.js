var default_usage_limit = 30;
var option_restored = "Your usage limit restored to default.";
var option_saved = "Your usage limit saved."


function getOptions()
{
    
	chrome.storage.sync.get("usage_limit_key", function(items){
		
		// if there's no value to the key
		if(!items.usage_limit_key) {
			items.usage_limit_key = default_usage_limit;
		}

		console.log("stored time_limit:" + items.usage_limit_key);
		$("#time_limit").val(items.usage_limit_key);
	});

    // if(localStorage["time_limit"] === undefined) {
    //     localStorage["time_limit"] = default_usage_limit;
    // }
    // console.log("stored time_limit:" + localStorage["time_limit"]);
    // $("#time_limit").val(localStorage["time_limit"]);
}

function saveOptions()
{
	user_input_limit = $("#time_limit").val();
	console.log("user_input: " + user_input_limit);

	chrome.storage.sync.set({"usage_limit_key":user_input_limit}, function(){
		$("#time_limit").val(user_input_limit);
	    $("#message").text(option_saved);
	    showMessage();
	    getOptions();
	});

}

function eraseOptions()
{
	
	chrome.storage.sync.set({"usage_limit_key": default_usage_limit}, function(){
		$("#message").text(option_restored);
		showMessage();
		getOptions();
	});

	// localStorage["time_limit"] = default_usage_limit;
	// $("#message").text(option_restored);
	// showMessage();
	// getOptions();
}

function showMessage() 
{  
    $("#message")
    	.fadeIn()
    	//.css({top:1000,position:'absolute'})
		.animate({top:275}, 800, function() {
    		setTimeout(function(){
    		hideMessage();
    	}, 3000);
    	
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



