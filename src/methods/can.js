/**
 * 
 * ##### `auth.can()`
 * 
 * @class-method
 * @asynchronous
 * @parameter 
 * @parameter `one:String` - 
 * @parameter `two:String` - 
 * @throws `Error` - 
 * @returns `Promise<?>` - 
 * @description ...
 * 
 */
module.exports = function() {
	
	this.formatCanInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.can = async (token, privilege, defaultPolicy, conflictPolicy) => {
		try {
			const { data: sessionData } = await this.authenticate({ token });
			const all = sessionData.privilege;
			if(["ENABLE","FORBID"].indexOf(privilege.substr(0, 6)) === 0) {
				const oppositePrivilege = (defaultPolicy ? "FORBID " : "ENABLE ") + privilege;
				for(let index = 0; index < all.length; index++) {
					let item = all[index];
					if (item.name === oppositePrivilege) {
						return 
					}
				}
				return defaultPolicy === "ENABLE";
			} else {
				for(let index = 0; index < all.length; index++) {
					let item = all[index];
					if (item.name === privilege) {
						return true;
					}
				}
				return defaultPolicy === "ENABLE";
			}
		} catch(error) {
			throw error;
		}
	};
	
	this.formatCanOutput = (result, parameters, args, settings) => {
		return result;
	};

};