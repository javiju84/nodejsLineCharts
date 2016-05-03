//import express package
var express = require("express");

//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://localhost:27017/Stock";

//DB Object
var dbObject;

//get instance of MongoClient to establish connection
var MongoClient = mongodb.MongoClient;

//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  dbObject = db;
});

function getData(responseObj){
  //use the find() API and pass an empty query object to retrieve all records
  dbObject.collection("ibex").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    var fechaArray = [];
    var aperturaPrecio = [];
    var alzaPrecio = [];
    var bajadaPrecio = [];
    var cierrePrecio = [];
   // var volumenPrecio = [];
    var ajuste_cierrePrecio = [];

    for ( index in docs){
      var doc = docs[index];
      //category array
      var fecha = doc['fecha'];
      //series 1 values array
      var apertura = doc['apertura'];
      //series 2 values array
      var alza = doc['alza'];
      var bajada = doc['bajada'];
      var cierre = doc['cierre'];
     // var volumen = doc['volumen'];
      var ajuste_cierre = doc['ajuste_cierre'];
      fechaArray.push({"label": fecha});
      aperturaPrecio.push({"value" : apertura});
      alzaPrecio.push({"value" : alza});
      bajadaPrecio.push({"value" : bajada});
      cierrePrecio.push({"value" : cierre});
     // volumenPrecio.push({"value" : volumen});
      ajuste_cierrePrecio.push({"value" : ajuste_cierre});

    }

    var dataset = [
      {
        "seriesname" : "Apertura Precio",
        "data" : aperturaPrecio
      },
       {
        "seriesname" : "Alza Precio",
        "data" : alzaPrecio
      },
       {
        "seriesname" : "Bajada Precio",
        "data" : bajadaPrecio
      },
       {
        "seriesname" : "Cierre Precio",
        "data" : cierrePrecio
      },
   /*    {
        "seriesname" : "Volumen Precio",
        "data" : volumenPrecio
      }*/,
       {
        "seriesname" : "Ajuste Cierre Precio",
        "data" : ajuste_cierrePrecio
      }
    ];

    var response = {
      "dataset" : dataset,
      "categories" : fechaArray
    };
    responseObj.json(response);
  });
}

//create express app
var app = express();

//NPM Module to integrate Handlerbars UI template engine with Express
var exphbs  = require('express-handlebars');

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Defining middleware to serve static files
app.use('/public', express.static('public'));
app.get("/informacion", function(req, res){
  getData(res);
});
app.get("/", function(req, res){
  res.render("chart");
});

app.listen("8800", function(){
  console.log('Server up: http://localhost:8800');
});
