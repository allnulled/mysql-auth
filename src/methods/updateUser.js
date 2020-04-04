/**
 * 
 * -----
 * 
 * ##### `auth.updateUser(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatUpdateUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.updateUser = (...args) => {
		return this.onQuery("updateUser", args);
	};
	
	this.formatUpdateUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};