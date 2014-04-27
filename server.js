var express = require('express'),
    trending = require('./libs/routes'),
    chartbeat = require('./libs/chartbeat'),
    db = require('./libs/database');
 
var app = express();
app.get('/api/trending', trending.getTrending);
app.listen(3000);
console.log('Listening on port 3000...');


// Retrieve data from Chartbeat toppages every 5 seconds
chartbeat.processSubscriptions();
