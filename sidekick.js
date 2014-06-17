

function saveTodayUsage(today_usage)
{
    if(today_usage == undefined || isNaN(today_usage)) return;

    chrome.storage.sync.set({'key_today_usage': today_usage}, function() {
        console.log("Today usage saved @ " + today_usage);
    });
}

function restoreTodayUsage()
{
    chrome.storage.sync.get('key_today_usage', function(today_usage) {
        
        console.log(today_usage.record);

        if(today_usage.record != undefined || !isNaN(today_usage)) {
            return today_usage.record;
        } else {
            return 0;
        }
    });
}
