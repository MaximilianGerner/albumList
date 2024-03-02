// Import the express module
const express = require('express');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost', 
     user:'root', 
     password: '3589',
     connectionLimit: 5,
     database: 'AlbumListPlayground'
});

const conn = pool.getConnection();


// Create an express app
const app = express();

// Set the port number
const port = 3000;



app.get("/", (req, res) => {
  // Send the HTML file as a response
  res.sendFile("index.html", { root: __dirname });
});

// Handle GET requests to the root path
app.get('/api/data', (req, res) => {


  // Create some JSON data
  const data = getQuery(req.query.page, req.query.results);

  data.then(function(data){
    res.setHeader("Content-Type", "application/json");
    // Send the data as a JSON string
    res.send(JSON.stringify(data));
  })
});

// Listen on the port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


async function getQuery(page, results) {
console.log("page: " + page);

  console.log("results: " + results);

  try{

  let sql = "SELECT album.id, albumName, GROUP_CONCAT(artistName SEPARATOR ', ') AS artists, coverLink, averageRating " +
  "FROM album JOIN albumToArtist ON album.id = albumId " +
  "JOIN artist ON artist.id = artistId " +
  "GROUP BY albumId ORDER BY releaseDate LIMIT " + (page * results) + ", " + results + ";"

    console.log(sql);


    return await conn.then(function(conn){return conn.query(sql)});
  //let rows = await pool.getConnection().then(function(conn){
  //  return conn.query(sql);
  //});

  return Object.assign({}, rows);
  }
  catch(err){
    console.log(err);
    return null;
  }

}


