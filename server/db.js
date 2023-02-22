const { MongoClient } = require("mongodb");




function connectDatabase() {

    const uri ="<YourConnectionString>";
    const client = new MongoClient(uri);
    return client;
}

module.exports = connectDatabase();