var express = require("express");
var fs = require('fs');
var im = require('imagemagick');
var formidable = require('formidable');
var contour = require('./contourDetector');
var app = express();

app.get('/', function (req, res){
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile('./views/form.html', options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Displaying Index');
    }
  });
});

// Post files
app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {

    fs.readFile(files.image.path, function (err, data) {

      var imageName = files.image.name
      /// If there's an error
      if(!imageName){
        console.log("There was an error")
        res.redirect("/");
        res.end();
      } else {
        var newPath = __dirname + "/uploads/fullsize/" + imageName;
        var thumbPath = __dirname + "/uploads/thumbs/" + imageName;
        
        fs.writeFile(newPath, data, function (err) {
          // write file to uploads/thumbs folder
          im.resize({
            srcPath: newPath,
            dstPath: thumbPath,
            width:   200
          }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('resized image to fit within 200x200px');
          });
          
        });

        contour.detect(data, imageName)
          .then(results => {
            res.format({
              html: function(){
                res.send(
                  + '<div>'
                  + '<h2>'+String(results)+' dots</h2>'
                  + '<img src="/uploads/modified/contour_'+imageName+'" width="650"/>'
                  + '<img src="/uploads/fullsize/'+imageName+'" width="650"/>'
                  + '</div>'
                );
              }
            });
          })
          .catch(error => {
            res.send(error);
          });

      }

    });

	});

});

// Show files
app.get('/uploads/fullsize/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/uploads/fullsize/" + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// Show files
app.get('/uploads/modified/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/uploads/modified/" + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// Show files
app.get('/image/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/public/imgs/" + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

var port = process.env.PORT || 8080;
app.listen(port);