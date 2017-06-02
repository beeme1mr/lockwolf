const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

var UserSchema = new Schema({
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String
},
{
  timestamps: true
}
);

module.exports = dynamoose.model("LockWolf-User", UserSchema);