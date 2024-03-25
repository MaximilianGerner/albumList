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

app.post("/api/insertAlbum", async (req, res) => {

    // Create some JSON data
    let response = insertAlbum(req.body);


    response.then(function (response) {
        console.log(response)
        res.setHeader("Content-Type", "text/plain");
        res.send(response);
    });
});

async function insertAlbum(json) {
    
    try {
        
        // Album
        
        let sql = "INSERT INTO album (albumName, releaseDate, genres, coverLink, userAdded, controversy) " +
            "VALUES ('" + json.albumName + "', '" + json.releaseDate + "', '" + json.genres + "', '" + json.coverLink 
            + "', '" + json.userId + "', NULL);";


        await conn.then(async function (conn) {
            return await conn.query(sql, {title: 'title'}, function (error, results, fields){
                const albumId = results.insertId;

                // Rating

                if (json.rating) {
                    let sql = "INSERT INTO rating (userId, albumId, score, dateOfRating) " +
                        "VALUES (" + json.userId + ", " + albumId + ", " + json.rating + ", '" + (new Date()).toISOString().split('T')[0] + "');";
                    

                    conn.then(function (conn) {
                        return conn.query(sql);
                    });
                }





                // Artists

                for (let i = 0; i < Object.keys(json.artists).length; i++) {
                    let sql = "SELECT artistName, id FROM artist WHERE artistName = '" + json.artists[i] + "';";

                    let select = await conn.then(function (conn) {
                        return conn.query(sql)
                    });

                    console.log(select);
                    if (select.length == 0) {
                        let sql = "INSERT artistName FROM artist WHERE artistName = '" + json.artists[i] + "';";
        
                        let select = await conn.then(function (conn) {
                            return conn.query(sql)
                        });
                    }
                }
                
                
            })
        });
        

        return "400";

    } catch (err) {
        
        console.log(err);
        return "401";
        
    }
}

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



