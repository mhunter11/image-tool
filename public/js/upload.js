$(document).ready(function () {
  var token = document.getElementById('token').innerHTML;
    $('.uploadBtn').click(function() {
      for (var i = 0; i < theFile.length; i++) {
        var btn = document.getElementsByClassName('imageA');
        if (theFile[i].delete) {
          console.log(theFile[i].name + ' deleted ignoring');
          continue;
        }
        getSlug(theFile[i], function(file) {
          var theId = document.getElementById(file.liID);
          if (file.slug) {
            uploadFile(file, function(data) {
              $(theId).find("button").removeClass("btn-danger");
              $(theId).find("button").addClass("btn-success");
              $(theId).find("button").addClass("noPointEvent");
              $(theId).find("button").html('<i class="fa fa-check" aria-hidden="true"></i>');
              console.log(data);
              return;
            })
          }
          else {
            $(theId).find("button").removeClass("btn-danger");
            $(theId).find("button").addClass("btn-fail");
          }
        });
      }
    });
  function getSlug(file, callback) {
    var seriesID = file.name.split('_')[0];
    $.ajax({
      type:'POST',
      url: "https://graphiti-dev-preview.smithsonianearthtv.com/graphql", //url: "https://graphiti-dev-live.smithsonianearthtv.com/graphql",
      data: '{getSeries(seriesId: "' + seriesID + '") { slug }}',
      cache: false,
      contentType: false,
      processData: false,
      success:
        function(data){
          file.slug = data.data.getSeries.slug;
          callback(file);
        },
      error:
        function(data){
          callback(false);
        }
    });
  }
  function uploadFile(file, callback) {
    var fd = new FormData();
        fd.append('file', file);
        $.ajax({
            type:'POST',
            url: "https://kanvas-dev.smithsonianearthtv.com/test/" + file.slug,
            beforeSend:
              function(xhr) {
                xhr.setRequestHeader('Authorization','Bearer ' + token );
              },
            data: fd,
            cache:false,
            contentType: false,
            processData: false,
            success:
              function(data){
                data.file = file;
                callback(data);
              },
            error:
              function(){
                callback(false);
              }
        });
  }
});