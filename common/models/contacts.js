'use strict';
var loopback = require('loopback');

module.exports = function(Contacts) {
    Contacts.beforeRemote('**', function(ctx, user, next) {
        if (!ctx.args.options) return next();
        if (!ctx.args.options.accessToken) return next();

        Contacts.app.models.companyUser.findOne({//Get user in company
			where : { user_id : ctx.args.options.accessToken.userId }
		},function(err, data){
            if (err) return next(err);            
			Contacts.app.models.connections.findOne({//Get connection
				where : { company_id : data.company_id }
			},function(err, data){
                if (err) return next(err);
                var ds = loopback.createDataSource(data);

                //Attach model to datasource
                Contacts.attachTo(ds);

                next();
			});
        });
    });
};
