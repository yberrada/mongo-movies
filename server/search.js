const express = require("express");
const cors = require("cors");
var client = require('./db');

const app = express();

app.use(cors());

const movies = client.db("sample_mflix").collection("movies")

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
    
    console.log(JSON.stringify(result));
    res.send(result);
});

app.listen(8001, () => {
    console.log(`Server is running on port 8001.`);
});