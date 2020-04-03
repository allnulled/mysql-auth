module.exports = function() {
	
	this.formatAssignPrivilegeToUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.assignPrivilegeToUser = (...args) => {
		return this.onQuery("assignPrivilegeToUser", args);
	};
	
	this.formatAssignPrivilegeToUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};