/**
 * 
 * -----
 * 
 * ##### `auth.can(token:String, privilege:Object|String, defaultPolicy:Boolean):Promise`
 * 
 */
module.exports = function() {
	
//	this.formatCanInput = (args, settings) => {
//		return this.createStandardTemplateParameters({ args });
//	};
	
	this.can = async (token, privilege, defaultPolicy, conflictPolicy) => {
		try {
			if(typeof privilege === "string") {
				privilege = { name: privilege };
			}
			if(typeof privilege !== "object") {
				throw new Error("Parameter <privilege> must be an object to <can>");
			}
			if(!("name" in privilege)) {
				throw new Error("Parameter <privilege> must have property <name> as string to <can>");
			}
			const { data: sessionData } = await this.authenticate({ token });
			const all = sessionData.privilege;
			if(["ENABLE","FORBID"].indexOf(privilege.name.substr(0, 6)) === 0) {
				const oppositePrivilege = (defaultPolicy ? "FORBID " : "ENABLE ") + privilege.name;
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
					if (item.name === privilege.name) {
						return true;
					}
				}
				return defaultPolicy === "ENABLE";
			}
		} catch(error) {
			this.debugError("Error on <can>:", error);
			throw error;
		}
	};
	
//	this.formatCanOutput = (result, parameters, args, settings) => {
//		return result;
//	};

};