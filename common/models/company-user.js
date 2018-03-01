'use strict';

module.exports = function(Companyuser) {
    //User list
	Companyuser.userList = function(companyId, cb) {
		Companyuser.find({
			include: "User",
			where: { 
				company_id: companyId 
			}
		}, function(err, raw) {
			cb(null, raw);
	    });
	}
	Companyuser.remoteMethod('userList', {
		http: { path:'/user_list', verb: 'get' },
		accepts:{ arg: 'companyId', type: 'number' },
	    returns: { arg: 'data', type: 'array', root: true }
	});
	//End User list

	//Change Role
	Companyuser.changeRole = function(userId, roleId, cb) {
		var RoleMapping = Companyuser.app.models.RoleMapping;

		RoleMapping.findOne({
			where: { 
				principalId: userId
			}
		}, function(err, rmap) {
			if(rmap){
				RoleMapping.replaceOrCreate({
					id: rmap.id, 
					principalType:"ROLE", 
					principalId: userId, 
					roleId: roleId
				}, function(err, raw) {
					cb(null, raw);
				});
			}else{
				cb(null, []);
			}
	    });
	}
	Companyuser.remoteMethod('changeRole', {
		http: { path:'/change_role', verb: 'post' },
		accepts:[
			{ arg: 'userId', type: 'number' },
			{ arg: 'roleId', type: 'number' }
		],
	    returns: { arg: 'data', type: 'array', root: true }
	});
	//End User list

	//Assign role
	Companyuser.assignRole = function(userId, roleId, cb) {
		var RoleMapping = Companyuser.app.models.RoleMapping;

		RoleMapping.create({
			principalType: RoleMapping.ROLE,
			principalId: userId,
			roleId : roleId
		}, function(err, principal) {
			cb(null, principal);
		});
	}
	Companyuser.remoteMethod('assignRole', {
		http: { path:'/assign_role', verb: 'post' },
		accepts:[
			{ arg: 'userId', type: 'number' },
			{ arg: 'roleId', type: 'number' }
		],
	    returns: { arg: 'data', type: 'array', root: true }
	});
	//End Assign role

	//Get company by userId
	Companyuser.getCompany = function(userId, cb) {
		Companyuser.findOne({
			where: { 
				user_id: userId 
			}
		}, function(err, obj) {
	    	Companyuser.app.models.companies.findOne({
			    where:{
		            id: obj.company_id
		        }
		    }, function(err, raw) {
		      	cb(null, raw);
		    });
	    });
	}
	Companyuser.remoteMethod('getCompany', {
		http: { path:'/get_company', verb: 'get' },
		accepts: { arg: 'userId', type: 'number' },
	    returns: { arg: 'data', type: 'array', root: true }
	});
	//End company by userId
};
