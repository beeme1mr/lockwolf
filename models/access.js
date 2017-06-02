const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

var AccessSchema = new Schema({
  userId: String,
  deviceCategory: String
}, {
  timestamps: true
});

module.exports = dynamoose.model("LockWolf-Access", AccessSchema);