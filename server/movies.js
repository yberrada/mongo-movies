const express = require("express");
const cors = require("cors");
const app = express();
var client = require('./db');

app.use(cors());
app.use(express.json());

const db = client.db("sample_mflix");
const movies = db.collection("movies");

app.get("/movies", async (req, res) => {
    const query = { rated: "PG", year: { $gt: 2000, $lt: 2015 } };
    const sort = { title: 1 }
    const projection = { title: 1, fullplot: 1, type: 1, poster: 1, year: 1, 'imdb.rating': 1 }
    const movie = await movies.find(query).project(projection).sort(sort).limit(16).toArray();
    res.send(movie);
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});