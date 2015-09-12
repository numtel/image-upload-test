Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("images"),
    new FS.Store.GridFS("thumbs", {
      beforeWrite: function(fileObj) {
        // We return an object, which will change the
        // filename extension and type for this store only.
        return {
          extension: 'png',
          type: 'image/png'
        };
      },
      transformWrite: function(fileObj, readStream, writeStream) {
        // XXX: Resize with PhantomJS instead of GraphicsMagick
//         console.log('file', fileObj);
//         var input = readStream.read();
//         var output = phantomExec(resizeImage, input);
//         console.log('inpiut', input);
//         writeStream.write(input);
        // Transform the image into a 10x10px PNG thumbnail
        gm(readStream).resize(60).stream('PNG').pipe(writeStream);
        // The new file size will be automatically detected and set for this store
      }
    })
  ],
});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.imageView.helpers({
    images: function () {
      return Images.find({}, {sort: [['uploadedAt', 'desc']]}); // Where Images is an FS.Collection instance
    }
  });

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click #saveimage': function () {
      Images.insert(dkrm.image.toDataURL(), function(err, fileObj) {
        console.log('hey', arguments);
      });
    }

  });
  document.addEventListener('DOMContentLoaded',function(){
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', function(e) {
      var reader = new FileReader();
      reader.onload = function(event){
        document.getElementById('darkroom').innerHTML = '<img src="' + event.target.result + '" id="target" />';

        window.dkrm = new Darkroom('#target', {
          // Canvas initialization size
          minWidth: 100,
          minHeight: 100,
          maxWidth: 500,
          maxHeight: 500,

          // Plugins options
          plugins: {
            crop: {
              minHeight: 50,
              minWidth: 50,
              ratio: 1
            },
            save: false // disable plugin
          },

          // Post initialization method
          initialize: function() {
          }
        });
      }
      reader.readAsDataURL(e.target.files[0]);   
    }, false);
  });

//   document.addEventListener('DOMContentLoaded',function(){
//   });
}

if (Meteor.isServer) {
  var phantomExec = phantomLaunch();
  // dataUrl  string   Input image to be resized
  // w, h     integer  Width, Height in pixels
  // format   string   Output image format. Default: image/png
  // quality  number   For image formats image/jpeg and image/webp, between 0-1
  // callback function Return value (error, result)
  var resizeImage = function(dataUrl, w, h, format, quality, callback) {
    var page = require('webpage').create();
    page.content = '<html><body><img src="' + dataUrl + '" /><canvas width="' + w + '" height="' + h + '"></canvas></body></html>';
    var resizedDataURL = page.evaluate(function() {
      var canvas = document.getElementsByTagName('canvas')[0];
      var ctx = c.getContext("2d");
      var img = document.getElementsByTagName('img')[0];
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL(format, quality); 
    });

    callback(null, resizedData);
  }
  
  Images.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    }
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
