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
         res.render("index", {page, items});
    });

    
});

// Handle GET requests to the root path
app.get('/api/data', (req, res) => {


    // Create some JSON data
    const data = getQuery(req.query.page, req.query.results, req.query.orderBy, req.query.orderDir);

    data.then(function (data) {
        res.setHeader("Content-Type", "application/json");
        // Send the data as a JSON string
        res.send(JSON.stringify(data));
    })
});

// Listen on the port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


async function getQuery(page, results, orderBy, orderDir) {

    try {

        let sql = "(SELECT album.id, albumName, GROUP_CONCAT(artistName SEPARATOR ', ') AS artists, coverLink, averageRating, releaseDate " +
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


