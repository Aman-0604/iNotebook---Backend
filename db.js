const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/iNotebook-db";

const connectToMongo = async () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfuly");
    })
}
module.exports = connectToMongo;