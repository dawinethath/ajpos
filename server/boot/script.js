var loopback = require('loopback');

module.exports = function(app) {
	var User = app.models.User;
	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;
	var companyUser = app.models.company_user;

	User.hasMany(companyUser, {as: 'companyUser', foreignKey: 'user_id'});
	companyUser.belongsTo(User, {as: 'User', foreignKey: 'user_id'});

	// User.hasMany(Role, {as: 'Role', foreignKey: 'principalId'});
	// Role.hasMany(User, {as: 'User', foreignKey: 'roleId'});
}