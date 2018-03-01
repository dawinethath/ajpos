var loopback = require('loopback');

module.exports = function(app) {
	var remotes = app.remotes(),
		comUser = app.models.company_user,
		conn = app.models.connections;
	
	remotes.before('**', function (ctx, next){		
		//Datasource attachs models
		if (!ctx.args.options) return next();
		if (!ctx.args.options.accessToken) return next();
		comUser.findOne({//Get user in company
			where: {user_id: ctx.args.options.accessToken.userId}
		},function(err, data){
			if (err) return next(err);
			conn.findOne({//Get connection
				where: {company_id: data.company_id}
			},function(err, data){
				if (err) return next(err);
				//Define datasource
				var ds = loopback.createDataSource(data),
					modelNames = Object.keys(app.models),
					models = [],
					lbModels = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'connections', 'companies', 'company_user'];
				//List down all non-loopback models
				modelNames.forEach(function(m) {
					var modelName = app.models[m].modelName;
					if (models.indexOf(modelName) === -1) {
						models.push(modelName);
					}
				});
				//Attach models to datasource
				models.forEach(function(m) {
					if (lbModels.indexOf(m) === -1) {
						ds.attach(app.models[m]);
					}
				});

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
					console.log(mod);
					ctx.args.data = mod;
					next();
				}				
			});
		});
	});

	// Modify all returned values
	remotes.after('**', function (ctx, next) {
		var filter;
	    if (ctx.args && ctx.args.filter) {
	      	filter = ctx.args.filter.where;
	    }

		this.count(filter, function (err, count) {
	        ctx.result = {
		      	data: ctx.result,
		      	total: count
		    };

		    next();
	    });
	   
	});
};