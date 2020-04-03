module.exports = function() {
	
	this.formatRegisterPrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.registerPrivilege = (...args) => {
		return this.onQuery("registerPrivilege", args);
	};
	
	this.formatRegisterPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};