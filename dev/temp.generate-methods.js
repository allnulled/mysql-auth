const fs = require("fs");

const methods = fs.readdirSync(__dirname + "/../src/methods");
const generateMethodFileFor = function(methodFile) {
	const methodName = methodFile.replace(/\.js$/g, "");
	const intercalatedMethodName =  methodName.substr(0,1).toUpperCase() + methodName.substr(1);
	return `module.exports = function() {
	
	this.format${intercalatedMethodName}Input = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.${methodName} = (...args) => {
		return this.onQuery("${methodName}", args);
	};
	
	this.format${intercalatedMethodName}Output = (result, parameters, args, settings) => {
		return result;
	};

};`;
};
const generateCommentFor = function(method) {
	return `/**
 * 
 * ##### \`auth.${method}()\`
 * 
 * @class-method
 * @asynchronous
 * @parameter 
 * @parameter \`one:String\` - 
 * @parameter \`two:String\` - 
 * @throws \`Error\` - 
 * @returns \`Promise<?>\` - 
 * @description ...
 * 
 */`;
}

const updateContents = function(method, contents) {
	return contents.replace(`/**
 * 
 * ##### \`auth.${method}()\`
 * 
 * @class-method
 * @asynchronous
 * @parameter 
 * @parameter \`one:String\` - 
 * @parameter \`two:String\` - 
 * @throws \`Error\` - 
 * @returns \`Promise<?>\` - 
 * @description ...
 * 
 */`, `/**
 * 
 * -----
 * 
 * ##### \`auth.${method}()\`
 * 
 */`);
}

methods.forEach(method => {
	const contents = fs.readFileSync(__dirname + "/../src/methods/" + method).toString();
	fs.writeFileSync(__dirname + "/../src/methods/" + method, updateContents(method.replace(/\.js$/g, ""), contents), "utf8");
});
