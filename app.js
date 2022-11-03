//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "Welcome to Dezent Blog. You can write down anything through the COMPOSE function.";
const aboutContent =
  "This blog website is built by Dezan. It is a website using MongoDB to store the data and deployed through Heroku";
const contactContent =
  "If you want more information about this website, please feel free to contact Dezan through email: dezanl.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-dezan:Test123@cluster0.dglrfvm.mongodb.net/blogDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
//connected url

let posts = [];

const postSchema = {
  title: String,

  content: String,
};
//new post schema

const Post = mongoose.model("Post", postSchema);
//schema that define posts collection

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  }); //callback function
});

app.get("/posts/:postId", function (req, res) {
  // const requestedTitle = _.lowerCase(req.params.postName);

  const requestedPostId = req.params.postId;

  Post.findOneAndUpdate({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});

// posts.forEach(function (post) {
//   const storedTitle = _.lowerCase(post.title);

//   if (storedTitle === requestedTitle) {
//     res.render("post", {
//       title: post.title,
//       content: post.content,
//     });
//   }
// });
