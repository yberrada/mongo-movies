const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");

const uri ="mongodb+srv://admin:admin@cluster1.fof1o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const movies = client.db("sample_mflix").collection("movies")

app.use(cors());
app.get("/search", async (req, res) => {
    const searchQuery = [
        {
            '$search': {
                'index': 'default_index',
                'text': {
                    'query': req.query.search,
                    'path': 'title',
                    'fuzzy': {}
                }
            }
        }
    ]
    const result = await movies.aggregate(searchQuery).toArray();
    res.send(result);
});

app.listen(8001, () => {
    console.log(`Server is running on port 8001.`);
});