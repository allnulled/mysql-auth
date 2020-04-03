module.exports = function() {
	
	this.formatAssignUserToCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.assignUserToCommunity = (...args) => {
		return this.onQuery("assignUserToCommunity", args);
	};
	
	this.formatAssignUserToCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};