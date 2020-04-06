/**
 * 
 * -----
 * 
 * ##### `auth.cannotMultiple(token:String, canArgsList:Array<Object|String>):Promise`
 * 
 */
module.exports = function() {
	
//	this.formatCannotMultipleInput = (args, settings) => {
//		return this.createStandardTemplateParameters({ args });
//	};
	
	this.cannotMultiple = async (token, privilegesArgsList) => {
		try {
			if(!Array.isArray(privilegesArgsList)) {
				throw new Error("Argument 1 <privileges> must be an array to <canMultiple>");
			}
			const canOperations = privilegesArgsList.map(item => {
				const privilegeArgs = Array.isArray(item) ? item : [item];
				return this.cannot(token, ...privilegeArgs);
			});
			return await Promise.all(canOperations);
		} catch(error) {
			this.debugError("Error on <cannotMultiple>:", error);
			throw error;
		}
	};
	
//	this.formatCannotMultipleOutput = (result, parameters, args, settings) => {
//		return result;
//	};

};