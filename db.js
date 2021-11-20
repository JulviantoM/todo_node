const sqlite = require("sqlite3").verbose();
const path = require("path");

const db_path = path.join(__dirname, 'todo_node.sqlite3');
const DB = new sqlite.Database(db_path, sqlite.OPEN_READWRITE, (err) => {
    if(err){
        console.error(err.message);
    }
    console.log("DB Connected");
})

module.exports = DB;