class AuthClient {

	static get DEFAULT_OPTIONS() {
		return {};
	}

	constructor(options = {}) {
		Object.assign(this, this.constructor.DEFAULT_OPTIONS, options);
		if(!this.system) {
			throw new Error("Property <system> is required");
		}
		Object.keys(this.system.queryTemplates).forEach(methodName => {
				const methodTemplate = this.system.queryTemplates[methodName];
				const methodCallback = this.system[methodName];
				if(typeof methodCallback !== "function") {
					throw new Error("AuthSystem class must have method <" + methodName + ">");
				}
				this[methodName] = methodCallback.bind(this.system);
		});
	}

}

module.exports = AuthClient;