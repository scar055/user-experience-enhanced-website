// import express en liquid
import express from "express";
import {Liquid} from "liquidjs";

// maak een express app aan
const app = express();

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}));

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static("public"));

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine("liquid", engine.express());

// Stel de map met Liquid templates in
app.set("views", "./views");

//voeg een index view aan
app.get("/", async function (request, response) {
  // Render index.liquid uit de Views map

  response.render("index.liquid", {path: request.path});
});

app.get("/nieuws", async function (request, response) {
  const params = {
    "groupBy[]": "title,description,date",
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
  await fetch("https://fdnd-agency.directus.app/items/adconnect_news", {
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
  response.redirect(303, "/nieuws-toevoegen");
});

app.get("/lado", async function (request, response) {
  // Render index.liquid uit de Views map

  response.render("lado.liquid", {path: request.path});
});

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set("port", process.env.PORT || 8000);

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console
  console.log(`ga naar http://localhost:${app.get("port")}/`);
});
