/**
 * 
 * -----
 * 
 * ##### `auth.cannot(token:String, privilege:Object|String, defaultPolicy:Boolean):Promise`
 * 
 */
module.exports = function() {
	
//	this.formatCannotInput = (args, settings) => {
//		return this.createStandardTemplateParameters({ args });
//	};
	
	this.cannot = async (...args) => {
		try {
			return !await this.can(...args);
		} catch(error) {
			this.debugError("Error on <cannot>:", error);
			throw error;
		}
	};
	
//	this.formatCannotOutput = (result, parameters, args, settings) => {
//		return result;
//	};

};