var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var request = require('request');
// Require all models
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var links = [];
var titles = [];
// Routes

app.get("/", function (req, res) {
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector

    var $ = cheerio.load(html);


    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.story-heading").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      var title = result.title = $(this)
        .children("a")
        .text();
      var link = result.link = $(this)
        .children("a")
        .attr("href");

      if (title && link) {
        // Insert the data in the scrapedData db


        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            // console.log(dbArticle);

          })
          .catch(function (err) {
            console.log(err);
            // If an error occurred, send it to the client
            //return res.json(err);
          });

      }
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    console.log("Scrape Complete");

    res.redirect("/articles");
  });

});



// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

  db.Article.find({})
    .then(function (dbArticle) {
      // console.log(dbArticle);
      res.render("index", { dbArticle });
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });

});

// Route for deleting saved article from main article db
app.delete("/articles/updated", function (req, res) {

  db.Article.delete(req.body)
  console.log(req.body)
    .then(function (newArticle) {
      console.log(newArticle);
      res.render("index", { newArticle });
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });

});



// Route for saving an article 
app.post("/saved", function (req, res) {
  db.Saved.create(req.body)
    .then(function (dbSaved) {
      // View the added result in the console
      console.log(dbSaved);

    })
    .catch(function (err) {
      console.log(err);
      // If an error occurred, send it to the client
      //return res.json(err);
    });

});


app.get("/saved", function (req, res) {

  db.Saved.find({})

    .then(function (savedArticle) {
      // If all Notes are successfully found, send them back to the client

      res.render("saved", { savedArticle });
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.post("/articles/id", function (req, res) {

  db.Saved.find({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/id", function (req, res) {

  db.Note.create(req.body)
  .then(function(newNote) {
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: newNote._id}, {new : true})
  })
  .then(function (data) {
    res.json(data)
  })

});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});