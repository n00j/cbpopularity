var db = require('./database');

exports.getTrending = function(req, res) {
	var query = req.query;
	if( !('host' in query) ) {
		res.send(400, '400 - Host parameter is required');
	}
    res.send(db.getTrending(req.query.host));
};
