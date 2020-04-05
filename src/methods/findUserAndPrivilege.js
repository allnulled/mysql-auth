/**
 * 
 * -----
 * 
 * ##### `auth.findUserAndPrivilege(whereUser:Object, wherePrivilege:Object):Promise`
 * 
 */
module.exports = function() {

	this.formatFindUserAndPrivilegeInput = (args) => {
		return this.createStandardTemplateParameters({ args });
	};

	this.findUserAndPrivilege = (...args) => {
		return this.onQuery("findUserAndPrivilege", args);
	};

	this.formatFindUserAndPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};