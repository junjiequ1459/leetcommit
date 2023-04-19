let express = require("express");
let cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let bodyParser = require("body-parser");

const CLIENT_ID = "aba66794a802d297acff";
const CLIENT_SECRET = "67de2a1e3ad9ae6ad3659cd2b0ae30da6e9bbb0c";

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
  req.query.code;

  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

//get user data

app.get("/getUserData", async function (req, res) {
  req.get("Authorization");
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json;
    })
    .then((data) => {
      res.json(data);
    });
});
app.listen(4000, function () {
  console.log("CORS server running on port 4000");
});
