var fb_visible_duration = 0;
var fb_tab_count;
var start_time;
var end_time; 

var date_time_format = "YYYY-MM-dd HH:mm:ss";

function validate_url(url)
{
    if (/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(url))
    	return true;
 	else
    	return false;
}

function countDuration(tab_url)
{
	//console.log("@ we got " + tab_url);

	if(validate_url(tab_url)) {
		start_time = new Date();

		var start_time_str = 
			start_time.getFullYear() +"/"+ 
			(start_time.getMonth()+1) +"/"+ 
			start_time.getDate() + " "
			+ start_time.getHours() + ":" + 
			start_time.getMinutes() + ":" + 
			start_time.getSeconds();

		console.log("@ START using facebook @ " + start_time_str);

	} else {

		end_time = new Date();

		var end_time_str = 
			end_time.getFullYear() +"/"+ 
			(end_time.getMonth()+1) +"/"+ 
			end_time.getDate() + " "
			+ end_time.getHours() + ":" + 
			end_time.getMinutes() + ":" + 
			end_time.getSeconds();

		console.log("@ stop using facebook @ " + end_time_str);

		if(start_time != undefined) {
			
			fb_visible_duration += (end_time - start_time);
			console.log("@ plus " + (end_time - start_time) + " ms");
			
			var duration = getDuration(fb_visible_duration);
			var duration_str = 
				duration.hours + " hours " + 
				duration.minutes + " minutes " +
				duration.seconds + " seconds " +
				duration.millis + " millis";

			console.log("@ facebook usage is " + duration_str);
			saveToLoalStorage(duration_str);
			start_time = undefined;	
		}
		
	}		
}

function saveToLoalStorage(record)
{
	if(!record) {
		console.log("@ Error: No value specified.");
		return;
	}

	var currentTimestamp = new Date();
	var current_time_str = 
			currentTimestamp.getFullYear() +"/"+ 
			(currentTimestamp.getMonth()+1) +"/"+ 
			currentTimestamp.getDate() + " " + 
			currentTimestamp.getHours() + ":" + 
			currentTimestamp.getMinutes() + ":" + 
			currentTimestamp.getSeconds();

	record = current_time_str + "::" + record;

	console.log(record);

	chrome.storage.local.get('record', function (result) {
        
        savedRecord = result.record;
    	
    	if(savedRecord != undefined) {

    		console.log(savedRecord);

    		chrome.storage.local.set({'record': savedRecord + "\n"+ record}, function() {
				console.log("Record saved @ " + current_time_str);
			});
    	} else {
    		chrome.storage.local.set({'record': record}, function() {
				console.log("Record saved @ " + record);
			});
    	}    
    });

	
}

function getDuration(timeMillis)
{
    var units = [
        {label:"millis",    mod:1000,},
        {label:"seconds",   mod:60,},
        {label:"minutes",   mod:60,},
        {label:"hours",     mod:24,},
        {label:"days",      mod:7,},
        {label:"weeks",     mod:52,},
    ];
    var duration = new Object();
    var x = timeMillis;
    for (i = 0; i < units.length; i++){
        var tmp = x % units[i].mod;
        duration[units[i].label] = tmp;
        x = (x - tmp) / units[i].mod
    }
    return duration;
}

function dhms(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = '0' + Math.floor( (t - d * cd) / ch),
        m = '0' + Math.round( (t - d * cd - h * ch) / 60000);
        s = '0' + Math.round( (t - d * cd - h * ch) / 360000);
    return [d, h.substr(-2), m.substr(-2), s.substr(-2)].join(':');
}

function getCurrentLocation()
{
    console.log("getCurrentLocation()");
    navigator.geolocation.getCurrentPosition(success, error);
}

function success(position)
{
    console.log(position);
    lat=Math.round(position.coords.latitude*1000000);
    lng=Math.round(position.coords.longitude*1000000);
    //getWeather();
}

function error(msg)
{
    console.log(msg);
    //chrome.browserAction.setBadgeText({text:"?"});
    //errorCode="unable_to_locate_your_position";
}



chrome.tabs.onActivated.addListener(function(info){
	//var tab = 
	chrome.tabs.get(info.tabId, function(tab){
		countDuration(tab.url);	
	});
});

getCurrentLocation();