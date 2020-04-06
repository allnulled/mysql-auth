/**
 * 
 * -----
 * 
 * ##### `auth.canMultiple(token:String, canArgsList:Array<Object|String>):Promise`
 * 
 */
module.exports = function() {
	
	// this.formatCanMultipleInput = (args, settings) => {
	// 	return this.createStandardTemplateParameters({ args });
	// };
	
	this.canMultiple = async (token, canArgsList) => {
		try {
			if(!Array.isArray(canArgsList)) {
				throw new Error("Argument 1 <privileges> must be an array to <canMultiple>");
			}
			const canOperations = canArgsList.map(item => {
				const privilegeArgs = Array.isArray(item) ? item : [item];
				return this.can(token, ...privilegeArgs);
			});
			return await Promise.all(canOperations);
		} catch(error) {
			this.debugError("Error on <canMultiple>:", error);
			throw error;
		}
	};
	
	// this.formatCanMultipleOutput = (result, parameters, args, settings) => {
	// 	return result;
	// };

};