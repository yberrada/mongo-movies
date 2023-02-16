const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");

const uri =
    "mongodb+srv://admin:admin@cluster1.fof1o.mongodb.net/?retryWrites=true&w=majority";





app.get("/movies", async (req, res) => {
    const client = new MongoClient(uri);
    try {
        const db = client.db("sample_mflix");
        const movies = db.collection("movies");
        const query = {rated : "PG", year:{$gt: 2000, $lt: 2015}};
        const sort = {title: 1}
        const projection = { title: 1, fullplot: 1, type: 1, poster: 1, year:1, 'imdb.rating': 1 }
        const movie = await movies.find(query).project(projection).sort(sort).limit(16).toArray();
        res.send(movie);
    } finally {
        await client.close();
    }
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});