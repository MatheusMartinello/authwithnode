const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/logs", { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
