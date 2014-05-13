var currentUsage;
var errorCode;

function renderPage()
{
	$("#today_usage").html("<h3>"+
		chrome.i18n.getMessage("today_usage_title")+"</h3>");

	currentUsage = chrome.extension.getBackgroundPage().currentUsage;
	errorCode = chrome.extension.getBackgroundPage().errorCode;

	// if(currentUsage == undefined)
	// 	currentUsage = restoreTodayUsage;

	if(currentUsage) {
		
		var duration = getDuration(currentUsage);
		var duration_str = 
				duration.hours + " hours " + 
				duration.minutes + " minutes " +
				duration.seconds + " seconds " +
				duration.millis + " millis";
		
		$("#fb_minutes").html("<h1>"+ duration_str +"</h1>");
		
		console.log("@ todayUsage: " + duration_str);

		if(duration.minutes > 30) {
			$("#friendly_reminder").html("<h3>"+chrome.i18n.getMessage("friendly_reminder_overdose_usage")+"</h3>");
			$("#friendly_reminder").css('color','overdose_minutes');
		} else {
			$("#friendly_reminder").html("<h3>"+chrome.i18n.getMessage("friendly_reminder_fair_usage")+"</h3>");
			$("#friendly_reminder").css('color','fair_minutes');
		}

	} else {
		switch(errorCode) {
			case "unable_to_load_data":
				$("#current_usage").html(chrome.i18n.getMessage("unable_to_load_data"));
				break;
			default:
				$("#current_usage").html(chrome.i18n.getMessage("no_usage_for_now"));
		}
	}
}

document.addEventListener('DOMContentLoaded', function(){
	renderPage();
});