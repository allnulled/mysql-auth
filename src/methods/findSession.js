/**
 * 
 * -----
 * 
 * ##### `auth.findSession(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatFindSessionInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findSession = (...args) => {
		return this.onQuery("findSession", args);
	};
	
	this.formatFindSessionOutput = (result, parameters, args, settings) => {
		return result;
	};

};