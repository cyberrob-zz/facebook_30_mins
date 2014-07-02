var currentUsage;
var errorCode;
var duration;
var usage_limit;

function renderPage() {

	// chrome.extension.getBackgroundPage().tracker
	// 	.sendEvent("Page", "Click", "Popup");


    $("#reset_usage").click(function() {
        chrome.storage.sync.clear(function() {
            console.log("@ usage data is cleared.")
        });
    });


    $("#today_str").html("<h3>" +
        chrome.i18n.getMessage("today_is") +
        chrome.extension.getBackgroundPage().today_str +
        chrome.i18n.getMessage("dot") +
        "</h3>");

    $("#today_usage").html("<h3>\t" +
        chrome.i18n.getMessage("today_usage_title") + "</h3>");

    currentUsage = chrome.extension.getBackgroundPage().currentUsage;
    errorCode = chrome.extension.getBackgroundPage().errorCode;


    if (currentUsage) {

        duration = getDuration(currentUsage);
        // var duration_str =
        //     duration.hours + " hours " +
        //     duration.minutes + " minutes " +
        //     duration.seconds + " seconds "

        console.log("@ todayUsage: " + formatTime(currentUsage));

        $("#fb_minutes").html("<h1>" + formatTime(currentUsage) + "</h1>");

        
        chrome.storage.sync.get("usage_limit_key", function(items) {
            usage_limit = items.usage_limit_key;

            if(usage_limit === undefined) {
            	usage_limit = 30;
            }
            console.log("@ we got limit of " + usage_limit);
            console.log("@ we got minutes of " + duration.minutes);

            if (duration.minutes >= usage_limit) {
                $("#friendly_reminder").html("<h4>" + chrome.i18n.getMessage("friendly_reminder_overdose_usage") + "</h4>");
                $("#friendly_reminder").css('color', 'overdose_minutes');
            } else {
                $("#friendly_reminder").html("<h4>" + chrome.i18n.getMessage("friendly_reminder_fair_usage") + "</h4>");
                $("#friendly_reminder").css('color', 'fair_minutes');
            }
        });

    } else {
        switch (errorCode) {
            // case "unable_to_load_data":
            // 	$("#current_usage").html(chrome.i18n.getMessage("unable_to_load_data"));
            // 	break;
            default:
            //$("#current_usage").html(chrome.i18n.getMessage("no_usage_for_now"));
            $("#current_usage").
            	html("<h3>"+chrome.i18n.getMessage("welcome_first_start")+"</h3>"+
            		"<h4>"+chrome.i18n.getMessage("unable_to_load_data")+"</h4>");
            break;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderPage();


});
