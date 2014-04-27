var request = require('request');
var settings = require('./settings');
var db = require('./database');

exports.chartBeatSubscription = function(host, frequency) {
	var cbQuery = "http://api.chartbeat.com/live/toppages/?apikey=" + settings.apiKey() + "&host=" + host + "&limit=100";
	var recursiveRetrieveTopPages = function () {
		request(cbQuery, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	var data = JSON.parse(body);
		  	db.storeHostTopPages(host, data);
		  } else {
		  	// do nothing if we can't get the data
		  }
		})
	    setTimeout(recursiveRetrieveTopPages,frequency);
	}
	recursiveRetrieveTopPages();
}

exports.processSubscriptions = function() {
	var hosts = ["gizmodo.com", "avc.com", "someecards.com"];
	for(var host in hosts) {
		this.chartBeatSubscription(hosts[host], settings.topPagesRetrievalFrequency());
	}
}