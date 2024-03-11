const express = require('express');
const path = require('path');

const weatherData = require("../Utility/weatherData");

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates");

app.set("view engine", 'ejs'); 
app.set('views', templatesPath); 

app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.render("index");
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send("Address is required");
    }
    weatherData(req.query.address, (error, result) => {
        if (error) {
            return res.send(error);
        }
        res.send(result);
    });
});

app.get("*", (req, res) => {
    res.render("404");
});

app.listen(port, () => {
    console.log("Server is running at port " + port);
});
