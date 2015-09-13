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
      transformWrite: resizeImageStream({
        width: 100,
        height: 50
      })
    })
  ],
});

if (Meteor.isClient) {
  Template.imageView.helpers({
    images: function () {
      return Images.find({}, {sort: [['uploadedAt', 'desc']]});
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

}

if (Meteor.isServer) {
  
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
