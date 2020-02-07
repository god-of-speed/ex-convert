const connection = require("../config/database");
const path = require("path");
const xlsx = require("node-xlsx");
const fs = require("fs");

const execute = async function(req, res, next) {
  var body = req.body;
  var file = req.file;
  var errors = [];
  if (body.fromFileType == "") {
    errors.push("Select the type of file you want to convert");
  }
  if (body.toFileType == "") {
    errors.push("Select the type of file you want to convert to");
  }
  if (file == null) {
    errors.push("please select a file");
  }
  if (body.fromFileType == "excel" && body.tableName == "") {
    errors.push("Table name cannot be empty");
  }

  if (!file) {
    errors.push("Please select a file to convert");
  }
  if (errors.length > 0) {
    res.status("422").send({ errors: errors });
  }
  if (body.fromFileType == "excel") {
    body.fieldNames = body.fieldNames.split(",");
    body.fieldTypes = body.fieldTypes.split(",");
    if (body.fieldNames.length == 0) {
      errors.push("Field names cannot be empty");
    }
    if (body.fieldTypes.length == 0) {
      errors.push("Field names cannot be empty");
    }
    if (errors.length > 0) {
      res.status("422").send({ errors: errors });
    }
    var obj = xlsx.parse(
      path.dirname(__dirname) + "/public/uploads/" + req.file
    );
    var excelHeaders = obj[0].data[0];
    var excelPosBasedOnHeaders = [];
    var newData = [];
    var sqlTypes = {
      string: "varchar(255)",
      int: "int(10)",
      text: "longtext",
      datetime: "datetime",
      timestamp: "timestamp"
    };
    body.fieldNames.forEach(fieldName => {
      if (excelHeaders.indexOf(fieldName) != -1) {
        console.log(fieldName);
        excelPosBasedOnHeaders.push(excelHeaders.indexOf(fieldName));
      }
    });
    var newSQL = "CREATE TABLE `" + body.tableName + "` (";
    for (var i = 0; i < excelPosBasedOnHeaders.length; i++) {
      if (i == excelPosBasedOnHeaders.length - 1) {
        newSQL +=
          "`" +
          excelHeaders[excelPosBasedOnHeaders[i]] +
          "`" +
          " " +
          sqlTypes[body.fieldTypes[i]] +
          " NULL);";
      } else {
        newSQL +=
          "`" +
          excelHeaders[excelPosBasedOnHeaders[i]] +
          "`" +
          " " +
          sqlTypes[body.fieldTypes[i]] +
          " NULL,";
      }
    }
    newSQL += "INSERT INTO `" + body.tableName + "`(";
    for (var i = 0; i < excelPosBasedOnHeaders.length; i++) {
      if (i == excelPosBasedOnHeaders.length - 1) {
        newSQL += "`" + excelHeaders[excelPosBasedOnHeaders[i]] + "`) ";
      } else {
        newSQL += "`" + excelHeaders[excelPosBasedOnHeaders[i]] + "`,";
      }
    }
    newSQL += "VALUES";
    for (var i = 1; i < obj[0].data.length; i++) {
      for (var j = 0; j < excelPosBasedOnHeaders.length; j++) {
        if (j == 0) {
          $sT = sqlTypes[body.fieldTypes[j]];
          if (
            ($sT == "DATETIME" || $sT == "TIMESTAMP") &&
            [obj[0].data[i][excelPosBasedOnHeaders[j]]] == ""
          ) {
            newSQL += "(" + null + ",";
          } else {
            newSQL += "('" + [obj[0].data[i][excelPosBasedOnHeaders[j]]] + "',";
          }
        } else if (
          j == excelPosBasedOnHeaders.length - 1 &&
          i == obj[0].data.length - 1
        ) {
          $sT = sqlTypes[body.fieldTypes[j]];
          if (
            ($sT == "DATETIME" || $sT == "TIMESTAMP") &&
            [obj[0].data[i][excelPosBasedOnHeaders[j]]] == ""
          ) {
            newSQL += null + ")";
          } else {
            newSQL += "'" + [obj[0].data[i][excelPosBasedOnHeaders[j]]] + "')";
          }
        } else if (j == excelPosBasedOnHeaders.length - 1) {
          if (
            ($sT == "DATETIME" || $sT == "TIMESTAMP") &&
            [obj[0].data[i][excelPosBasedOnHeaders[j]]] == ""
          ) {
            newSQL += null + "),";
          } else {
            newSQL += "'" + [obj[0].data[i][excelPosBasedOnHeaders[j]]] + "'),";
          }
        } else {
          if (
            ($sT == "DATETIME" || $sT == "TIMESTAMP") &&
            [obj[0].data[i][excelPosBasedOnHeaders[j]]] == ""
          ) {
            newSQL += null + ",";
          } else {
            newSQL += "'" + [obj[0].data[i][excelPosBasedOnHeaders[j]]] + "',";
          }
        }
      }
    }
    //generate a custom name
    var letters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var sqlName = "";
    for (var i = 0; i <= 24; i++) {
      sqlName += letters[Math.floor(Math.random() * 62)];
    }
    var writeSqlToFile = fs.createWriteStream(
      path.dirname(__dirname) + "/public/sql/" + sqlName + ".sql"
    );
    writeSqlToFile.write(newSQL);
    writeSqlToFile.end();
    res.status(200).send({ downloadLink: "sql/" + sqlName + ".sql" });
  }
};

module.exports = {
  execute
};
