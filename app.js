//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
let posts = [];
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Define mongoose
var mongoose = require('mongoose');
// Connection URL
//const url = 'mongodb://localhost:27017';
const url = 'mongodb+srv://admin-kumar:provider852@cluster-blog-cj9jb.mongodb.net';
// Database Name
const dbName = 'dailyBlog';
mongoose.connect(url + "/" + dbName, {
  useNewUrlParser: true
});

//Define Schema
const blogSchema = new mongoose.Schema({
  title: String,
  blog: String,
  date: String
});


app.get("/", function(req, res) {
  const Blog = mongoose.model('Blog', blogSchema);
  // Read from Person table
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.error(err);
    } else {
      res.render('home', {
        blogJournal: blogs
      });
    }
  });
});

app.get("/post/:blogDay", function(req, res) {
  const requestedPostId = req.params.blogDay;
  const Blog = mongoose.model('Blog', blogSchema);
  Blog.findOne({
    _id: requestedPostId
  }, function(err, blogs) {
    res.render("post", {
      title: blogs.title,
      blogText: blogs.blog
    });
  });
});

app.get("/about", function(req, res) {
  res.render('about');
});

app.get("/contact", function(req, res) {
  res.render('contact');
});

app.get("/compose", function(req, res) {
  res.render('compose');
});

app.post("/compose", function(req, res) {
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  let today = new Date().toLocaleDateString("en-US", options);

  // Insert in Person table
  const Blog = mongoose.model('Blog', blogSchema);
  const blog = new Blog({
    title: req.body.title,
    blog: req.body.blog,
    date: today
  });
  blog.save(function(err) {

    if (!err) {

      res.redirect("/");

    }

  });
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Sever has started on port 3000......");
});
