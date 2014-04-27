// Just store the data in memory instead of an actual database
// since we are working with a relatively small dataset
var db = {};

exports.storeHostTopPages = function(host, data) {
	// Keep track of the last 10 points of data for each host
	if(host in db) {
		if(db[host].length >= 10) {
			db[host].pop();
		} 
		db[host].push(data);
	} else {
		db[host] = [];
		db[host].push(data);
	}
}

exports.getTrending = function(host) {
	if(host in db) {
		var hostData = db[host];
		var hostDataLength = hostData.length;

		// if we have at least 2 data points for this host, calculate change
		if(hostDataLength > 2) {
			var outMap = {};
			var mostRecent = hostData[hostData.length - 1];
			var previous = hostData[hostData.length - 2];

			for (var pageIndex in mostRecent) {
				var page = mostRecent[pageIndex];
				var p = {
					i: page.path,
					change: page.visitors
				};
				outMap[page.path] = p;
			}

			// calculate the difference between the 2nd last data point
			// and the last data point
			for (var pageIndex in previous) {
				var page = previous[pageIndex];
				if(page.path in outMap) {
					outMap[page.path].change = outMap[page.path].change - page.visitors;
				} else {
					var p = {
						i: page.path,
						change: -1 * page.visitors
					};
					outMap[page.path] = p;
				}
			}
			
			// iterate through map and push only pages with a positive
			// change into return array
			var returnArray = [];
			for(var p in outMap) {
				var item = outMap[p];
				if(item.change > 0) {
					returnArray.push(item);
				}
			}	

			// Sort the response by change descending
			returnArray.sort(function(a, b) {
				if(a.change > b.change)
					return -1;
				if(a.change < b.change)
					return 1;
				return 0;
			});		
			return returnArray;

		} else {
			// 1 or less data points in the db
			return {};
		}
	} else {
		// we don't have any data for this host
		return {};
	}
}