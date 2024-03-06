// In your server.js file, import express and create an app
const express = require("express");
const app = express();

const {Client} = require("spotify-api.js");
const client = Client.create({
    refreshToken: true,
    token: {
        clientID: "2fb52cb937c4463fa82e1158ba35daeb", // Your spotify application client id.
        clientSecret: "7515671af8db47b7a907fa5e0a640304", // Your spotify application client secret.
    },
});


const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '4567',
    connectionLimit: 5,
    database: 'AlbumListPlayground'
});

const conn = pool.getConnection();

app.use(express.json());
app.use(express.static("public"));


app.get("/", async (req, res) => {
    try {
        res.sendFile("public/search.html", {root: __dirname});
    } catch (error) {
        // Handle any errors, such as database or server issues
        console.error(error);
        res.status(500).send({message: "An error occurred"});
    }
});


app.get("/api/getAccessToken", async (req, res) => {
    try {
        res.setHeader("Content-Type", "text/plain");

        console.log((await client).token);

        res.send((await client).token);

    } catch (err) {
        console.log(err);
    }
});

app.post("/api/insertAlbum", (req, res) => {

    // Create some JSON data
    const response = insertAlbum(req.body.albumName, req.body.releaseDate, req.body.genres, req.body.coverLink, req.body.userId, req.body.rating);

    response.then(data => console.log(data));

    response.then(function (response) {
        res.setHeader("Content-Type", "text/plain");
        // Send the data as a JSON string
        res.send("hi");
    })
});

async function insertAlbum(albumName, releaseDate, genres, coverLink, userId, rating) {
    try {

        let sql = "INSERT INTO album (albumName, releaseDate, genres, coverLink, userAdded, controversy) " +
            "VALUES ('" + albumName + "', '" + releaseDate + "', '" + genres + "', '" + coverLink + "', '" + userId + "', NULL);";


        await conn.then(async function (conn) {
            return await conn.query(sql)
        });


        if (rating) {

            let sql = "INSERT INTO rating (userId, albumId, score, dateOfRating) " +
                "VALUES (" + userId + ", LAST_INSERT_ID(), " + rating + ", '" + (new Date()).toISOString().split('T')[0] + "');";

            console.log(sql);

            await conn.then(async function (conn) {
                return await conn.query(sql)
            });
        }

        return "all fine!";

    } catch (err) {
        console.log(err);
        return null;
    }
}

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



