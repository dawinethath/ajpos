// Run the script manually:

// $ cd server
// $ node create-lb-tables.js

var server = require('./server');
var ds = server.dataSources.posDS;
var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});