let express = require("express");

let app = express();
const nocache = require("nocache");

app.use(nocache());
let databaseStatus = 503;

const { Pool } = require("pg");

const databaseConnection = async () => {
  const pool = new Pool({
    user: "abhaydeshpande",
    host: "localhost",
    database: "cloudusers",
    password: "abhaydeshpande",
    port: 5432,
  });

  pool.on("error", (err, client) => {
    console.log("postgres connection error : " + err);
  });

  try {
    const client = await pool.connect();
    databaseStatus = 200;
    client.release();
  } catch (err) {
    console.log("hitting again");
    console.log("database connection error", err);
    databaseStatus = 503;
  }
};

app.get("/healthz", async function (req, res) {
  if (Object.keys(req.body).length > 0) {
    res.sendStatus(405);
  } else {
    await databaseConnection();
    res.sendStatus(databaseStatus);
  }
});

app.put("/healthz", function (req, res) {
  res.sendStatus(405);
});

app.delete("/healthz", function (req, res) {
  res.sendStatus(405);
});

app.patch("/healthz", function (req, res) {
  res.sendStatus(405);
});

app.post("/healthz", function (req, res) {
  res.sendStatus(405);
});

let server = app.listen(8080, function () {
  console.log("the app is running on the port 8080");
});
