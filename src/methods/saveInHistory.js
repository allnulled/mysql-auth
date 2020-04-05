module.exports = function() {

	this.formatSaveInHistoryInput = (args) => {
		return this.createStandardTemplateParameters({ args });
	}

	this.saveInHistory = (table, whereItems) => {
		return this.onQuery("saveInHistory", [table, whereItems]);
	}

	this.formatSaveInHistoryOutput = (result) => {
		return result;
	}

};