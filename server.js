import express from "express";
import {Liquid} from "liquidjs";

// maak een express app aan
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine("liquid", engine.express());

app.set("views", "./views");

const newsURL = "https://fdnd-agency.directus.app/items/adconnect_news";

app.get("/", async function (request, response) {
  response.render("index.liquid", {path: request.path});
});

app.get("/nieuws", async function (request, response) {
  const params = {
    fields: "title,description,date",
  };
  const newsResponse = await fetch(
    "https://fdnd-agency.directus.app/items/adconnect_news/?" +
      new URLSearchParams(params),
  );

  const newsResponseJson = await newsResponse.json();

  response.render("news.liquid", {
    path: request.path,
    news: newsResponseJson.data,
  });
});

app.get("/nieuws-toevoegen", async function (request, response) {
  response.render("add-news.liquid", {path: request.path});
});

app.post("/nieuws-toevoegen", async function (request, response) {
  await fetch(newsURL, {
    method: "POST",
    body: JSON.stringify({
      description: request.body.description,
      body: request.body.body,
      status: request.body.status,
      titel: request.body.title,
      author: request.body.author,
      date: request.body.date,
    }),

    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  response.redirect(303, "/nieuws-toevoegen-succes");
});

app.get("/nieuws-toevoegen-succes", async function (request, response) {
  response.render("succes-add-news.liquid", {path: request.path});
});

app.get("/lado", async function (request, response) {
  response.render("lado.liquid", {path: request.path});
});

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`ga naar http://localhost:${app.get("port")}/`);
});
