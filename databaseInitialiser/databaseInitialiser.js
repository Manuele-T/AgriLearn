const Datastore = require('nedb');
const path = require('path');

// Initialize databases
const cropsDB = new Datastore({ filename: path.join(__dirname, '../database/Crops.db'), autoload: true });

// Crop data
const crops = [
    {
        _id: "tomato",
        name: "Tomato",
        image: "/img/tomato.jpg",
        description: "A popular vegetable known for its versatility.",
        healthStatuses: ["Healthy", "Diseased"],
        diseases: ["Virus01"],
        tips: [
            "Water regularly but avoid overwatering.",
            "Provide stakes for support.",
            "Inspect plants weekly for signs of disease."
        ]
    },
    {
        _id: "potato",
        name: "Potato",
        image: "/img/potato.jpg",
        description: "A starchy tuber grown worldwide.",
        healthStatuses: ["Healthy", "Diseased"],
        diseases: ["Virus02", "Bacteria01"],
        tips: [
            "Rotate crops to prevent soil-borne diseases.",
            "Keep soil evenly moist.",
            "Remove infected plants promptly."
        ]
    }
];

// Insert crops into the database
cropsDB.insert(crops, (err) => {
    if (err) console.error("Error inserting crops:", err);
    else console.log("Crops data inserted successfully!");
});
