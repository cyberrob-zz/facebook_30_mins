var fb_tab_count;
var start_time;
var end_time; 
var fb_visiable_duration = 0;

// a usage paremeter for popup.html to retrieve
var currentUsage = 0;
var errorCode;


// Local storage key
var KEY_RECORD_STR = 'key_record_str';
var KEY_DAILY_SUM = 'key_daily_sum';
var KEY_TODAY_USAGE = 'key_today_usage';

var stopwatch = new clsStopwatch();
var $time;
var clocktimer;

function validate_url(url)
{
    if (/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(url))
    	return true;
 	else
    	return false;
}

function countDuration(tab_url)
{
	
	if(validate_url(tab_url)) {
		
		// start_time = new Date();

		// var start_time_str = 
		// 	start_time.getFullYear() +"/"+ 
		// 	(start_time.getMonth()+1) +"/"+ 
		// 	start_time.getDate() + " " + 
		// 	start_time.getHours() + ":" + 
		// 	start_time.getMinutes() + ":" + 
		// 	start_time.getSeconds();

		// console.log("@ START using facebook @ " + start_time_str);

		if(stopwatch === undefined) {
			stopwatch = new clsStopwatch();
		}
		start();
		//currentUsage = stopwatch.time();
		console.log("START using Facebook : "+ formatTime(stopwatch.time()));


	} else {

		if(stopwatch != undefined) {
			stop();
			currentUsage = stopwatch.time();
			console.log("STOP using Facebook : "+ formatTime(stopwatch.time()));
		}

		// end_time = new Date();

		// var end_time_str = 
		// 	end_time.getFullYear() +"/"+ 
		// 	(end_time.getMonth()+1) +"/"+ 
		// 	end_time.getDate() + " "+ 
		// 	end_time.getHours() + ":" + 
		// 	end_time.getMinutes() + ":" + 
		// 	end_time.getSeconds();

		// console.log("@ stop using facebook @ " + end_time_str);

		// if(start_time != undefined) {
			
		// 	fb_visiable_duration = (end_time - start_time);
		// 	console.log("@ plus " + (end_time - start_time) + " ms");

		// 	if(currentUsage === undefined)
		// 		currentUsage = fb_visiable_duration;
		// 	else
		// 		currentUsage = currentUsage + fb_visiable_duration;
			
		// 	//saveTodayUsage(currentUsage);
			
		// 	//
		// 	var duration = getDuration(currentUsage);
		// 	var duration_str = 
		// 		duration.hours + " hours " + 
		// 		duration.minutes + " minutes " +
		// 		duration.seconds + " seconds " +
		// 		duration.millis + " millis";
		// 	console.log("@ total facebook usage: " + duration_str);
		// 	//saveRecordStr(duration_str);
			
		// 	// reset start_time
		// 	start_time = undefined;	
		// }
	}		
}

 
function update() {
	//$time.innerHTML = formatTime(stopwatch.time());
	//console.log(formatTime(stopwatch.time()));
	localStorage['daily_usage'] = currentUsage = stopwatch.time();
}
 
function start() {
	clocktimer = setInterval("update()", 1000);
	stopwatch.start();
}
 
function stop() {
	stopwatch.stop();
	clearInterval(clocktimer);
}
 
function reset() {
	stop();
	stopwatch.reset();
	update();
}


function saveRecordStr(record)
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

	//console.log(record);

	chrome.storage.local.get('key_record_str', function (result) {
        
        savedRecord = result.record;
    	
    	if(savedRecord != undefined) {

    		console.log(savedRecord);

    		chrome.storage.local.set({'key_record_str': savedRecord + "\n"+ record}, function() {
				console.log("Record saved @ " + current_time_str);
			});
    	} else {

    		chrome.storage.local.set({'key_record_str': record}, function() {
				console.log("Record saved @ " + record);
			});
    	}    
    });
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
	
	//currentUsage = restoreTodayUsage();
	chrome.tabs.get(info.tabId, function(tab){
		countDuration(tab.url);	
	});
});

chrome.windows.onFocusChanged.addListener(function() {
	console.log("Focus changed.");
	chrome.windows.getCurrent(function(window){
		console.log(window.state);
		if(window.state == "normal") {
			console.log("It's normal.Stop the watch.");
			//stop();
		} else if(window.state == "maximized"){
			console.log("It's maximized.Start the watch.");
			//countDuration();
		}
	});
});


update();
getCurrentLocation();


