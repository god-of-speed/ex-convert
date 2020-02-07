require("dotenv").config();
const express = require("express");
const apiRoutes = require("./routes/api");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(apiRoutes);

app.listen(port, console.log("Application running on " + port));