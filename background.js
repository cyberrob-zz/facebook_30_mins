var fb_tab_count;
var start_time;
var end_time;
var fb_visiable_duration = 0;

// a usage paremeter for popup.html to retrieve
var currentUsage = 0;
var errorCode;
var today_str;

// Local storage key
var KEY_RECORD_STR = 'key_record_str';
var KEY_DAILY_SUM = 'key_daily_sum';
var KEY_TODAY_USAGE = 'key_today_usage';

var stopwatch;
var $time;
var clocktimer;

function validate_fb_url(url) {
    if (/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(url))
        return true;
    else
        return false;
}

function countDuration(tab_url) {
    // Using Facebook
    if (validate_fb_url(tab_url)) {

        start();

        // Not using Facebook
    } else {

        stop();

    }
}

// For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" +
        ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" +
        ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

Date.prototype.today = function() {
    return this.getFullYear() + "/" +
        (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" +
        ((this.getDate() < 10) ? "0" : "") + this.getDate();
}

function getTodayStr() {
    var aDate = new Date();
    return aDate.today();
}

function getNowStr() {
    var aDate = new Date();
    return aDate.timeNow();
}

function update() {
    //$time.innerHTML = formatTime(stopwatch.time());
    //console.log(formatTime(stopwatch.time()));
    currentUsage = stopwatch.time();
    //console.log("@ update per sec: " + currentUsage);
}

function start() {
    clocktimer = setInterval("update()", 1000);

    // check for today usage in the storage for resuming counting
    getUsage();
    // if we found usage in the storage, then set it to the stopwatch
    if (currentUsage != 0) {
        console.log("@ we found usage in the storage: " + currentUsage);
        stopwatch.setLapTime(currentUsage);
    } else {
        console.log("@ not usage found we start fresh from 0!");
    }

    stopwatch.start();
    console.log("START using Facebook : " + formatTime(currentUsage));

}

function stop() {
    console.log("STOP using Facebook : " + formatTime(stopwatch.time()));
    stopwatch.stop();
    clearInterval(clocktimer);
    saveUsage();
}

function reset() {
    stop();
    stopwatch.reset();
    update();
}

function saveUsage() {

    var key = getTodayStr(),
        log = JSON.stringify({
            'duration': currentUsage,
            'updated': getTodayStr() + " " + getNowStr()
        });
    var usageLog = {};
    usageLog[key] = log;
    // Object {_2014/06/17: "{"duration":3000,"updated":"_2014/06/17 10:23:05"}"}
    chrome.storage.local.set(usageLog, function() {
        console.log("Saved ", key, log);
    });
}

function getUsage() {
    var key = getTodayStr();

    chrome.storage.local.get(null, function(items) {
        //console.log("we've got " + items);

        // Reverse the string back to obj
        var log = JSON.parse(items[key]);
        // console.log(
        //     "Date: " + key +
        //     "\n\t duration: " + log.duration +
        //     "\n\t updated: " + log.updated);

        if (log) {
            console.log("Restoring today usage from storage...");
            currentUsage = log.duration;
        }
    });
}



// function getCurrentLocation() {
//     console.log("getCurrentLocation()");
//     navigator.geolocation.getCurrentPosition(success, error);
// }

// function success(position) {
//     console.log(position);
//     lat = Math.round(position.coords.latitude * 1000000);
//     lng = Math.round(position.coords.longitude * 1000000);
//     //getWeather();
// }

function error(msg) {
    console.log(msg);
    //chrome.browserAction.setBadgeText({text:"?"});
    //errorCode="unable_to_locate_your_position";
}

chrome.tabs.onActivated.addListener(function(info) {

    chrome.tabs.get(info.tabId, function(tab) {
        //if(validate_fb_url(tab.url)) {
        countDuration(tab.url);
        //}
    });
});

// Add this listener when the url of the tab is updated
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

// 		console.log("@ tab status: " + changeInfo.status
// 				+ " ,tab url: " + tab.url);
// 		countDuration(tab.url);	
// });

chrome.windows.onFocusChanged.addListener(function() {

    var getInfo = {
        populate: true
    };

    chrome.windows.getCurrent(getInfo, function(window) {

        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            console.log("@ current tab url: " + tabs[0].url);
            countDuration(tabs[0].url);
        });

        //start();
        today_str = getTodayStr();

        if (window.state != "normal" || window.state != "maximized") {
            stop();
        } else {


        }
    });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        // console.log('Storage key "%s" in namespace "%s" changed. ' +
        //     'Old value was "%s", new value is "%s".',
        //     key,
        //     namespace,
        //     storageChange.oldValue,
        //     storageChange.newValue);
    }
});


function setupDayChangeListener() {
    var tonight = new Date();
    tonight.setHours(22);
    tonight.setMinutes(59);

    var resetTime = new Date();
    resetTime.setHours(0);
    resetTime.setMinutes(0);

    var alarmInfo = {
        "when": Date.now(),
        "periodInMinutes": 1440 // every day
    };

    // var alarmInfo = {
    //     "when": tonight.getMilliseconds(), // optional
    //     "periodInMinutes": 3 // every day
    // };

    // Setup a alarm to trigger save daily usage into local storage
    chrome.alarms.create("time_to_save_daily_usage", alarmInfo);

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name == "time_to_save_daily_usage") {
            console.log("It's time to save daily usage!");
            //saveUsage();
        }
    });
}

function init() {
    today_str = getTodayStr();

    if (stopwatch == undefined)
        stopwatch = new clsStopwatch();

    setupDayChangeListener();

}


window.onload = init;
