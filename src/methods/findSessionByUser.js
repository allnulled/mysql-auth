/**
 * 
 * -----
 * 
 * ##### `auth.findSessionByUser(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatFindSessionByUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findSessionByUser = (...args) => {
		return this.onQuery("findSessionByUser", args);
	};
	
	this.formatFindSessionByUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};