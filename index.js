"use strict";
var express = require('express');
var app = express();
var firebase = require("firebase");
var exphbs = require("express-handlebars");
var path = require('path');
var bodyParser = require('body-parser');

var config = {
    apiKey: "AIzaSyDxNTxKH-Feyk1v4qkFqGhu1wG-pBAiWIE",
    authDomain: "paint-63eec.firebaseapp.com",
    databaseURL: "https://paint-63eec.firebaseio.com",
    storageBucket: "paint-63eec.appspot.com",
    messagingSenderId: "431318731275",
    databaseAuthVariableOverride: {
        uid: "serdimoa",
        password: "27051993"
    }
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

firebase.initializeApp(config);

app.get('/', function (req, res) {
    var db = firebase.database();
    var structure = db.ref('structure');
    structure.once("value").then(function (snapshot) {
        var obj = {};
        obj.menu = snapshot.val().menu;
        obj.gallery = snapshot.val().gallery;
        res.render('index', obj);
    });
});

app.get('/category/:categoryType', function (req, res) {
    var db = firebase.database();
    var structure = db.ref('structure');
    structure.once("value").then(function (snapshot) {
        var obj = {};
        obj.menu = snapshot.val().menu;
        var items = db.ref("gallery/" + req.params.categoryType);
        items.once("value").then(function (snapshot) {
            var filter_array = {};
            items = snapshot.val();
            items.forEach(function (element) {
                element = element.filters;

                element.forEach(function (el) {
                    filter_array[el.hash] = el.name;
                }, this);
            }, this);
            var filter = [];
            for (var key in filter_array) {
                var filter_item = new Object();
                filter_item["key"] = key;
                filter_item["value"] = filter_array[key];
                filter.push(filter_item);
            }
            obj.filters = filter;
            obj.items = items;

            res.render('category', obj);

        });
    });
});

app.get('/paint/:paintGroup', function (req, res) {
    var db = firebase.database();
    var items = db.ref('gallery/' + req.params.paintGroup);
    var struct = db.ref('structure/gallery');
    var obj = { "name": 1 };
    struct.once("value").then(function (snapshot) {
        obj.menu = snapshot.val();
        items.once("value").then(function (snapshot) {
            obj.gal = snapshot.val();
            res.render('index', obj);
        });
    });



    // res.send('Hello ' + req.params.paintGroup + "!");
});

app.get('/admin', function (req, res) {
    var db = firebase.database();
    res.render('admin');


});

app.get('/login', function (req, res) {
    res.render('login');
});
//&& auth.password === '27051993'
app.post('/login', function (req, res) {
    var db = firebase.database();
    var auth = firebase.auth();
    
    var token = firebase.auth().signInWithEmailAndPassword( req.body.username, req.body.password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

    auth.onAuthStateChanged(function (user) {
        if (user) {
            var userRef = db.ref("users/");
            var newUser = {
                age: 2
            };
            userRef.set(newUser);

            console.log("Welcome UID:" + user.uid);
        }
    });



    
    
    res.send("hello");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});