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

app.get("/", function (req, res) {
  res.send("Hello, world!");
});

app.get("/getAccessToken", async function (req, res) {
  req.query.code;
  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code +
    "&scope=repo,user,workflow,write:repo_hook,read:user,user:email,user:follow";

  const response = await fetch(
    "https://github.com/login/oauth/access_token" + params,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (
    !response.ok ||
    response.headers.get("content-type").indexOf("application/json") === -1
  ) {
    console.error(
      "Error fetching access token:",
      response.status,
      response.statusText
    );
    res.status(response.status).send(response.statusText);
    return;
  }

  const data = await response.json();
  console.log(data);
  res.json(data);
});

app.listen(8080, function () {
  console.log("CORS server running on port 8080");
});
