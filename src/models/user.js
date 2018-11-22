import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    name: String, 
    pictureUrl: String,
    cpf: String
});


module.exports = mongoose.model("User", userSchema);