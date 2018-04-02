'use strict';
var loopback = require('loopback');
var noImage = "https://aijazspace.sgp1.digitaloceanspaces.com/no_image.jpg";

module.exports = function(Products) {
    Products.beforeRemote('**', function(ctx, user, next) {
        if (!ctx.args.options) return next();
        if (!ctx.args.options.accessToken) return next();

        Products.app.models.companyUser.findOne({//Get user in company
			where : { user_id : ctx.args.options.accessToken.userId }
		},function(err, data){
            if (err) return next(err);            
			Products.app.models.connections.findOne({//Get connection
				where : { company_id : data.company_id }
			},function(err, data){
                if (err) return next(err);
                var ds = loopback.createDataSource(data);

                //Attach model to datasource
                Products.attachTo(ds);

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
	
	Products.afterRemote('**', function (ctx, user, next) {
		if(ctx.result) {
			if(Array.isArray(ctx.result)) {
				ctx.result.forEach(function (result) {
					if(result.image_url=="" || result.image_url==null){
						result.image_url = noImage;
					}
				});
			}
		}
	  
		next();
	});
};
