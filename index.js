require("dotenv").config(); // Load environment variables
const express = require("express");
const path = require("path");
const app = express();
const routes = require("./routes/routes.js");
const cropsDB = require("./models/cropModel.js"); // Corrected path to cropModel.js

// Configure Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
    extname: ".hbs",
    helpers: {
        eq: (v1, v2) => v1 === v2,
    },
    partialsDir: path.join(__dirname, "views", "partial"),
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Bootstrap static assets
app.use("/css", express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "./node_modules/bootstrap/dist/js")));

// Middleware to fetch crops for the side menu
app.use((req, res, next) => {
    cropsDB.find({}, { _id: 1, name: 1 }, (err, crops) => {
        if (err) {
            console.error("Error fetching crops:", err);
            crops = []; // Fallback to an empty list
        }
        res.locals.crops = crops; // Pass crops to all templates
        next();
    });
});

// Use routes
app.use("/", routes);

// Start server
app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000."));
