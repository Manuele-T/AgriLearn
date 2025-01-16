exports.getHomePage = (req, res) => {
    res.render('home', { title: "Home" }); // Render homepage
};
