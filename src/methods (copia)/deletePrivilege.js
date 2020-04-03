module.exports = function() {
	
	this.formatDeletePrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deletePrivilege = (...args) => {
		return this.onQuery("deletePrivilege", args);
	};
	
	this.formatDeletePrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};