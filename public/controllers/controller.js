 $(document).ready(function() {
     console.log("ready!");
     $('#container').on('click', '#show', function() { // code
         alert("hello in on");
         $.get('/data', {}, function(data) {
             console.log(data);
         });
     });
     $('#container').on('click', '#submit', function() { // code
         alert("hello in on");
         var bookDetails = {
             'author': $('#author').val(),
             'title': $('#title').val(),
             'body': $('#body').val()
         };
         $.ajax({
             url: '/insertion',
             type: 'post',
             contentType: 'application/json',
             data: JSON.stringify(bookDetails),
             success: function(data) {
                 alert("data inserted successfully");
                 console.log(data);
                 $("#results").text(data);
                 $.ajax({
                     url: '/getOtherBooks',
                     type: 'post',
                     contentType: 'application/json',
                     data: JSON.stringify({'author' : bookDetails.author}),
                     success: function(data) {
                        var listofBooks = [];
                        var data = JSON.parse(data);
                        alert(data.length);
                        for(var i=0; i<data.length; i++){
                            listofBooks.push("<li><span>" + data[i].title + "</span><span>" + data[i].genere + "</span></li>");
                        }
                        listofBooks.join("");
                        $("#listOfSimilarBooks").append(listofBooks);
                     },
                     error : function(jqXHR, textStatus, errorThrown) {
                         alert('error ' + textStatus + " " + errorThrown);
                     }
                });
                 //once the data comes back -- show the line which was added and books of same author or genere
                 //once more ajax call inside this
             },
             error: function(jqXHR, textStatus, errorThrown) {
                 alert('error ' + textStatus + " " + errorThrown);
             }
         });
     });
 });