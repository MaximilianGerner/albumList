// Import the express module
const express = require('express');


// sql
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '4567',
    connectionLimit: 5,
    database: 'AlbumList'
});

const conn = pool.getConnection();





// Create an express app
const app = express();

// Set the port number
const port = 8000;

app.use(express.static("public"));


// ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');



app.get("", (req, res) => {

    let page = 1;

    if (req.query.page)
    {
        page = req.query.page;
    }

    const items = getQuery(page, 30, "releaseDate", "ASC");

    items.then(function(items){
        console.log(items);
         res.render("index", {page, items});
    });

    
});


// Listen on the port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


async function getQuery(page, results, orderBy, orderDir) {

    try {

        let sql = "(SELECT album.id, albumName, GROUP_CONCAT(artistName SEPARATOR ', ') AS artists, coverLink, averageRating, releaseDate, genres " +
            "FROM album JOIN albumToArtist ON album.id = albumId " +
            "JOIN artist ON artist.id = artistId " +
            "GROUP BY albumId ORDER BY releaseDate) ORDER BY " + orderBy + " " + orderDir + " LIMIT " + ((page-1) * results) + ", " + results + ";"

        return await conn.then(function (conn) {
            return conn.query(sql)
        });

    } catch (err) {
        console.log(err);
        return null;
    }

}




app.get("/album/:albumId", (req, res) => {

    console.log("hello");

    try {
        

    const albumData = getAlbumData(req.params.albumId);

    albumData.then( function(albumData) {

        const ratings = getAlbumRatings(req.params.albumId);

        ratings.then(function(ratings) {

            const remembereds = getAlbumRemembereds(req.params.albumId);

            remembereds.then(function(remembereds){

                const recommends = getAlbumRecommends(req.params.albumId);

                recommends.then(function(recommends){
                    console.log(ratings);
                    console.log(albumData);
                    console.log(remembereds);
                    console.log(recommends);
                    res.render("album", {albumData, ratings, remembereds, recommends});
                });
            });


        });
    });



    }

    catch (err) {
        console.log(err);
        return null;
    }

    
});



async function getAlbumData(albumId) {

    try {

        let sql = "SELECT album.id, albumName, GROUP_CONCAT(artistName SEPARATOR ', ') AS artists, coverLink, averageRating, releaseDate, genres, controversy " +
            "FROM album JOIN albumToArtist ON album.id = albumId " +
            "JOIN artist ON artist.id = artistId " +
            "WHERE album.id = " + albumId + ";"

        return await conn.then(function (conn) {
            return conn.query(sql)
        });

    } catch (err) {
        console.log(err);
        return null;
    }

}


async function getAlbumRatings(albumId) {

    try {

        let sql = "SELECT album.id, score, dateOfRating, userName  " +
            "FROM album JOIN rating ON album.id = albumId " +
            "JOIN user ON user.id = userId " +
            "WHERE album.id = " + albumId + ";"

        return await conn.then(function (conn) {
            return conn.query(sql)
        });

    } catch (err) {
        console.log(err);
        return null;
    }

}



async function getAlbumRemembereds(albumId) {

    try {

        let sql = "SELECT userName " +
            "FROM remember " +
            "JOIN user ON user.id = userId " +
            "WHERE albumId = " + albumId + ";"

        return await conn.then(function (conn) {
            return conn.query(sql)
        });

    } catch (err) {
        console.log(err);
        return null;
    }

}



async function getAlbumRecommends(albumId) {

    try {

        let sql = "SELECT recommender.userName AS recommenderName, recommendee.userName AS recommendeeName FROM recommend " +
            "JOIN user recommender ON recommender.id = recommenderId " +
            "JOIN user recommendee ON recommendee.id = recommendeeId " +
            "WHERE albumId = " + albumId + ";"

        return await conn.then(function (conn) {
            return conn.query(sql)
        });

    } catch (err) {
        console.log(err);
        return null;
    }

}
