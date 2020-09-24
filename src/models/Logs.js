const mongoose = require("../database");

const LogSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LogSchema.pre("save", async function (next) {
  next();
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
