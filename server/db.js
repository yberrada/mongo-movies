const { MongoClient } = require("mongodb");




function connectDatabase() {

    const uri ="mongodb+srv://admin:admin@cluster0.fof1o.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    return client;
}

module.exports = connectDatabase();