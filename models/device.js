const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

var DeviceSchema = new Schema({
  id: String,
  type: String,
  subtype: String
}, {
  timestamps: true
});

module.exports = dynamoose.model("LockWolf-Device", DeviceSchema);