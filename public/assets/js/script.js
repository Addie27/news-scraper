$(document).on("click", ".note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).siblings().attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h6>" + data.title + "</h6>");
      // An input to enter a new title
      $("#notes").append("<textarea id='bodyinput' placehlder='put notes here' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn btn-success' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
       
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
     
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  }); 

// When you click the save button
$(document).on("click", ".save", function () {
  // Grab the id associated with the article from the submit button

  var thisId = $(this).siblings().attr("data-id");
  var thisTitle = $(this).siblings().text().trim();
  var thisLink = $(this).siblings().attr("href");


  $.ajax({
    method: "POST",
    url: "/saved",
    data: {
      _id: thisId,
      title: thisTitle,
      link: thisLink
    }
  })
    // With that done
    .then(function (data) {
      
    });
  $(this).parent().empty();
});
