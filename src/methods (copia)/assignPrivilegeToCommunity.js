module.exports = function() {
	
	this.formatAssignPrivilegeToCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.assignPrivilegeToCommunity = (...args) => {
		return this.onQuery("assignPrivilegeToCommunity", args);
	};
	
	this.formatAssignPrivilegeToCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};