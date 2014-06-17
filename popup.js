var currentUsage;
var errorCode;

function renderPage()
{
	$("#reset_usage").click(function() {
		chrome.storage.sync.clear(function(){
			console.log("@ usage data is cleared.")
		});
	});

	$("#today_usage").html("<h3>"+
		chrome.i18n.getMessage("today_usage_title")+"</h3>");

	currentUsage = chrome.extension.getBackgroundPage().currentUsage;
	errorCode = chrome.extension.getBackgroundPage().errorCode;

	
	if(currentUsage) {
		
		var duration = getDuration(currentUsage);
		var duration_str = 
				duration.hours + " hours " + 
				duration.minutes + " minutes " +
				duration.seconds + " seconds "

		console.log("@ todayUsage: " + formatTime(currentUsage));
		
		$("#fb_minutes").html("<h1>"+ formatTime(currentUsage) +"</h1>");
		
		var usage_limit;
		chrome.storage.sync.get("usage_limit_key", function(items) {
			usage_limit = items.usage_limit_key;

			if(duration.minutes > usage_limit) {
				$("#friendly_reminder").html("<h3>"+chrome.i18n.getMessage("friendly_reminder_overdose_usage")+"</h3>");
				$("#friendly_reminder").css('color','overdose_minutes');
			} else {
				$("#friendly_reminder").html("<h3>"+chrome.i18n.getMessage("friendly_reminder_fair_usage")+"</h3>");
				$("#friendly_reminder").css('color','fair_minutes');
			}
		});

	} else {
		switch(errorCode) {
			// case "unable_to_load_data":
			// 	$("#current_usage").html(chrome.i18n.getMessage("unable_to_load_data"));
			// 	break;
			default:
				//$("#current_usage").html(chrome.i18n.getMessage("no_usage_for_now"));
				$("#current_usage").html(chrome.i18n.getMessage("unable_to_load_data"));
				break;
		}
	}
}

document.addEventListener('DOMContentLoaded', function(){
	renderPage();


});