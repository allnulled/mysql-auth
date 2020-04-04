const SQL = require("sqlstring");
const OPERATORS_SQL = [
	"=",
	"<",
	"<=",
	">",
	">=",
	"<>",
	"in",
	"not in",
	"like",
	"not like",
];
const getPropertiesSQL = (propertyItemsString, tableName = false) => {
	const propertyItems = propertyItemsString.split(".");
	return (propertyItems.length < 2 && tableName ? (SQL.escapeId(tableName) + ".") : "") + propertyItems.map(property => SQL.escapeId(property)).join(".")
};


module.exports = {

	generateToken(length = 255, charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("")) {
		let index = 0, token = "";
		while(index < length) {
			index++;
			token += charset[Math.floor(Math.random() * charset.length)];
		}
		return token;
	},

	rowsToObject(rows, table, columnId) {
		const ids = [];
		const objs = []
		const column = table + "." + columnId;
		let otherColumns = null;
		rows.forEach(row => {
			if (ids.indexOf(row[column]) === -1) {
				ids.push(row[column]);
				if (otherColumns === null) {
					otherColumns = Object.keys(row).filter(aColumn => aColumn.startsWith(table + "."));
				}
				const product = otherColumns.reduce((output = {}, otherColumn) => {
					output[otherColumn.replace(table + ".", "")] = row[otherColumn];
					return output;
				}, {});
				if(product.id !== null) {
					objs.push(product);
				}
			}
		});
		return objs;
	},

	whereToSQL(whereConditionsParameter = [], prefixAnd = false, tableName = false) {
		let sql = "";
		if(prefixAnd) {
			sql += " AND ";
		}
		let whereConditions = whereConditionsParameter;
		if(Array.isArray(whereConditions)) {

		} else if(typeof whereConditions === "object") {
			whereConditions = Object.keys(whereConditions).map(property => [].concat([property]).concat(whereConditions[property]));
		} else {
			throw new Error("Parameter <whereConditions> must be an array or an object");
		}
		whereConditions.forEach((whereCondition, conditionIndex) => {
			if(conditionIndex !== 0) {
				sql += "\n     AND ";
			}
			if(Array.isArray(whereCondition)) {
				if(whereCondition.length < 2) {
					throw new Error("Parameters <whereCondition> must have 2 items minimum");
				} else if(whereCondition.length === 2) {
					const property = getPropertiesSQL(whereCondition[0], tableName);
					const value = whereCondition[1];
					sql += property + " = " + SQL.escape(value);
				} else if(whereCondition.length === 3) {
					const property = getPropertiesSQL(whereCondition[0], tableName);
					const operator = whereCondition[1];
					const value = whereCondition[2];
					if(OPERATORS_SQL.indexOf(operator) === -1) {
						throw new Error("Argument 2 of a <whereCondition> must be one of: " + OPERATORS_SQL.join(" | "));
					}
					sql += property + " " + operator + " ";
					if((operator === "in" || operator === "not in") && Array.isArray(value)) {
						sql += "(";
						value.forEach((subvalue, index) => {
							if(index !== 0) {
								sql += ", " + SQL.escape(subvalue);
							} else {
								sql += SQL.escape(subvalue);
							}
						}); 
						sql += ")";
					} else {
						SQL.escape(value);
					}
				} else {
					throw new Error("Parameters <whereCondition> must have 3 items maximum");
				}
			} else if(typeof whereCondition === "object") {
				Object.keys(whereCondition).forEach(propertySlot => {
					const property = getPropertiesSQL(propertySlot, tableName);
					sql += property + " = " + SQL.escape(whereCondition[propertySlot]);
				});
			} else {
				throw new Error("Required <whereCondition> to be an array or an object instead of: " + typeof whereCondition);
			}
		});
		return sql;
	},
};