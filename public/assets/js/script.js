

  // Whenever someone clicks a p tag
  $(document).on("click", ".note", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).siblings().attr("data-id");
    console.log(thisId);
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

// When you click the save button
$(document).on("click", ".save", function () {
  // Grab the id associated with the article from the submit button

  var thisId = $(this).siblings().attr("data-id");
  var thisTitle = $(this).siblings().text().trim();
  var thisLink = $(this).siblings().attr("href");
  console.log(thisId);
  console.log(thisTitle);
  console.log(thisLink);

  // Run a POST request to change the note, using what's entered in the inputs
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
      $.ajax({
        method: "DELETE",
        url: "/articles/updated",
        data: {
          _id: thisId,
          title: thisTitle,
          link: thisLink
        }
      })
        // With that done
        .then(function (data) {
          // Log the response
          console.log(data);
    
          // // Empty the notes section
          
        });
      
    });

});
