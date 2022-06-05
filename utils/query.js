const Query = {
  getQuery(dataObj, tableName, conditions) {
    return `SELECT ${dataObj.toString()} from ${tableName} where ${conditions}`;
  },
  postQuery(tableName, values) {
    console.log("values", values);
    return `INSERT INTO ${tableName} VALUES( ${values.toString()} )`;
  },

  updateQuery(tableName, key, values, email) {
    return `UPDATE ${tableName} SET ${key} =${values.toString()} WHERE email=${email.toString()}  `;
  },
};
module.exports = Query;
