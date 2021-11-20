const express = require("express");
const boser = require("body-parser");
const path = require("path");
const ejs = require("ejs");

const APP = express();
const PORT = 80 || 443;
const DB = require("./db");

APP.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

APP.use(boser.urlencoded({extended:true}));
APP.use(express.static("static"));

APP.set("view engine", "ejs");
APP.set("views", path.join(__dirname, 'views'));


APP.get("/", (req, res) => {
    let db_query = "SELECT * FROM Tasks ORDER BY id DESC";
    DB.all(db_query, (err, rows) => {
        if (err) {
            res.status(400).json({ "status":"Error" });
        }
        var datas = rows;
        res.status(200).render("base_index", {"status":"Error", "context":datas});
    });
})

APP.post("/create", (req, res) => {
    const paramTask = req.body.textInput;
    const paramCompleted = 0;
    const paramCreatedAt = getCurrentTime();

    let db_query = "INSERT INTO Tasks (task, completed, created_at) VALUES (?, ?, ?)";
    let params = [paramTask, paramCompleted, paramCreatedAt];
    DB.run(db_query, params, (err, rows) => {
        if (err) {
            res.status(404).json({ "status":"Error" });
        }
        res.status(201).redirect('/');
    });
})

APP.post("/complete/:id", (req, res) => {
    const paramId = req.params.id;

    let db_query = "UPDATE Tasks SET completed=1 WHERE id=?";
    let params = [paramId];
    DB.run(db_query, params, (err, rows) => {
        if (err) {
            res.status(404).json({ "status":"Error" });
        }
        res.status(203).redirect('/');
    });
})

APP.post("/delete/:id", (req, res) => {
    const paramId = req.params.id;

    let db_query = "DELETE FROM Tasks WHERE id=?";
    let params = [paramId];
    DB.run(db_query, params, (err, rows) => {
        if (err) {
            res.status(404).json({ "status":"Error" });
        }
        res.status(204).redirect('/');
    });
})

const getCurrentTime = () => {	
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}