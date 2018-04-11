'use strict';
var loopback = require('loopback');

module.exports = function(dashboard) {
    //User list
	dashboard.overview = function(companyId, cb) {
		dashboard.find({
			include: "User",
			where: { 
				company_id: companyId 
			}
		}, function(err, raw) {
			cb(null, raw);
	    });
	}
	dashboard.remoteMethod('overview', {
		http: { path:'/overview', verb: 'get' },
		accepts:{ arg: 'companyId', type: 'number' },
	    returns: { arg: 'data', type: 'array', root: true }
	});
};
