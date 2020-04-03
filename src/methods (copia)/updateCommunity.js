module.exports = function() {
	
	this.formatUpdateCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.updateCommunity = (...args) => {
		return this.onQuery("updateCommunity", args);
	};
	
	this.formatUpdateCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};