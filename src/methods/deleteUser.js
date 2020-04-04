/**
 * 
 * -----
 * 
 * ##### `auth.deleteUser(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatDeleteUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteUser = (...args) => {
		return this.onQuery("deleteUser", args);
	};
	
	this.formatDeleteUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};