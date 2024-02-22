import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mariadb = require('mysql2');
const pool = mariadb.createPool({
    host: 'localhsot',
    user: 'root',
    password: '3589',
    connectionLimit: 5
});



var albums = document.getElementById("albums");

asyncFuncton();


async function asyncFunction() {
    let conn;
    try {

        conn = await pool.getConnection();
        const rows = await conn.query("SELECT albumName, releaseDate FROM album WHERE albumName = 'For the first time'");
        alert(rows); // [ {val: 1}, meta: ... ]
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

