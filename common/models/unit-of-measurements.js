'use strict';
var loopback = require('loopback');

module.exports = function(UnitOfMeasurements) {
    UnitOfMeasurements.beforeRemote('**', function(ctx, user, next) {
        if (!ctx.args.options) return next();
        if (!ctx.args.options.accessToken) return next();

        UnitOfMeasurements.app.models.companyUser.findOne({//Get user in company
			where : { user_id : ctx.args.options.accessToken.userId }
		},function(err, data){
            if (err) return next(err);            
			UnitOfMeasurements.app.models.connections.findOne({//Get connection
				where : { company_id : data.company_id }
			},function(err, data){
                if (err) return next(err);
                var ds = loopback.createDataSource(data);

                //Attach model to datasource
                UnitOfMeasurements.attachTo(ds);

                //Move models to ctx.data
				if (!ctx.args.data) return next();
				if (!ctx.args.data.models) return next();
				var mod = JSON.parse(ctx.args.data.models);
				if(ctx.req.method=="PUT"){
					mod.forEach(function(m) {
						if(mod.indexOf(m)==0){
							ctx.args.data = m;
						}else{
							// app.models[m].replaceOrCreate(m);
						}
					});
					next();
				}else{
					ctx.args.data = mod;
					next();
				}
			});
        });
    });
};
