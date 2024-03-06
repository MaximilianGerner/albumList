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
    user:'root',
    password: 'password',
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
    try {
        console.log(req.body);


        try {

            let sql = "(SELECT album.id, albumName, GROUP_CONCAT(artistName SEPARATOR ', ') AS artists, coverLink, averageRating " +
                "FROM album JOIN albumToArtist ON album.id = albumId " +
                "JOIN artist ON artist.id = artistId " +
                "GROUP BY albumId ORDER BY releaseDate) ORDER BY " + orderBy + " " + orderDir + " LIMIT " + (page * results) + ", " + results + ";"

            return await conn.then(function (conn) {
                return conn.query(sql)
            });

        } catch (err) {
            console.log(err);
            return null;
        }

    } catch (err) {
        console.log(err);
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
