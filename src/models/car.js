import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const carSchema = new Schema({
    id: String,
    name: String,
});

module.exports = mongoose.model("Car", carSchema);