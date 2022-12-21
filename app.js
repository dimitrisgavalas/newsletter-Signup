
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//new instance of express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})); //use bodyParser

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

//save users info from form and print them @ console
app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/263a501966" ;

  const options = {
    method: "POST",
    auth: "jj:6a31e0d32857aced24364c268d583de6-us13"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(port, function(){
  console.log("Server is running on port " + port);
});


// API key
// 6a31e0d32857aced24364c268d583de6-us13

//List id
// 263a501966
