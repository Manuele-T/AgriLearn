// initial app setup
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const routes = require("./routes/routes.js");
const helmet = require('helmet');

// configure Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
    extname: ".hbs",
    helpers: {
        eq: (v1, v2) => v1 === v2,
    },
    partialsDir: path.join(__dirname, "views", "partials"),
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// bootstrap static assets
app.use("/css", express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "./node_modules/bootstrap/dist/js")));

// use routes
app.use("/", routes);
// use uploads folder
app.use('/uploads', express.static('uploads'));

// use helmet
app.use(helmet());

// Start server
app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000."));