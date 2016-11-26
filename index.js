var express = require('express');
var app = express();

app.use(express.static('public'));


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://mongo:27017/docker-demo';

var score;

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    findScore(db, function(docs) {
        if (docs.length == 0) {
            console.log("No score found, setting score to 0");
            initScore(db, function() {
                db.close();
            });
        } else {
            score = docs[0].score;
            console.log("Score is " + score);
        }
    });
});

app.get('/score', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        findScore(db, function(docs) {
            res.send({ score: docs[0].score });
            db.close();
        });
    });
});

app.post('/incrementScore', function (req, res) {
    if (score <= 3) {
        score = score + 1;
    }
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        updateScore(db, score, function(docs) {
            res.send({ score: score });
            db.close();
        });
    });
});

app.post('/decrementScore', function (req, res) {
    if (score > 0) {
        score = score - 1;
    }
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        updateScore(db, score, function(docs) {
            res.send({ score: score });
            db.close();
        });
    });
});

var initScore = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('scores');
    // Insert some documents
    collection.insert({
        score: 0
    }, function(err, result) {
        console.log("Inserted zero score into the collection");
        callback(result);
    });
}

var findScore = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('scores');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

var updateScore = function(db, score, callback) {
  // Get the documents collection
  var collection = db.collection('scores');
  collection.updateOne({ score : score - 1 }
    , { $set: { score : score } }, function(err, result) {
    console.log("Updated the score to " + score);
    callback(result);
  });
}

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});
