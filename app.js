const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');   
const Blog = require('./models/blog');
var axios = require("axios").default;

//express
const app = express();

//connect to mongodb
const dbURI = "mongodb://ziadzoz:test1234@cluster0-shard-00-00.2tukb.mongodb.net:27017,cluster0-shard-00-01.2tukb.mongodb.net:27017,cluster0-shard-00-02.2tukb.mongodb.net:27017/zozdb?ssl=true&replicaSet=atlas-3g5f60-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(dbURI)
.then((result) => app.listen(3000))
.catch((err) => console.log(err));


// api

const apiUrl = process.env.apiUrl;
const apiHost = process.env.apiHost;
const apiKey = process.env.apiKey;

//EJS view engine
app.set('view engine', 'ejs');

//middleware and static files setting
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.redirect('/blogs');
  });

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

  app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  app.post('/blogs', (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body);
  
    blog.save()
      .then(result => {
        res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });


  app.get('/dad-joke', (req,res) =>
  {
    var options = {
      method: 'GET',
      url: 'https://dad-jokes.p.rapidapi.com/random/joke/png',
      headers: {
        'x-rapidapi-host': 'dad-jokes.p.rapidapi.com',
        'x-rapidapi-key': '11286911bemsh1d567c9941358cap132e43jsn2cd65b6f5ee8'
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
      res.render("dad-joke", {
        setup: response.data.body.setup,
        punchline: response.data.body.punchline,
        title: "Random Dad Joke:"
      });
    }).catch(function (error) {
      console.error(error);
    });
  })
  
  
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });