/**
 * 
 * -----
 * 
 * ##### `auth.findPrivilege(wherePrivilege:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatFindPrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findPrivilege = (...args) => {
		return this.onQuery("findPrivilege", args);
	};
	
	this.formatFindPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};