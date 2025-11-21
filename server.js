import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());

const db = JSON.parse(fs.readFileSync("./private/monmaster_bdd.json", "utf8"));

// ROUTE 1 : récupérer une formation par ID
app.get("/api/formations/:id", (req, res) => {
  const id = req.params.id;
  const formation = db.formations[id] || null;

  if (!formation) {
    return res.status(404).json({ error: "Formation introuvable" });
  }

  res.json(formation);
});

// ROUTE 2 : établissement par UAI
app.get("/api/etablissements/:uai", (req, res) => {
  const uai = req.params.uai;
  const etab = db.etablissements[uai] || null;

  if (!etab) {
    return res.status(404).json({ error: "Établissement introuvable" });
  }

  res.json(etab);
});

// ROUTE 3 : mention par code inm
app.get("/api/mentions/:inm", (req, res) => {
  const mention = db.mentions[req.params.inm] || null;

  if (!mention) {
    return res.status(404).json({ error: "Mention introuvable" });
  }

  res.json(mention);
});

// ROUTE 4 : disciplines
app.get("/api/disciplines/:id", (req, res) => {
  const d = db.discipline[req.params.id] || null;
  if (!d) return res.status(404).json({ error: "Discipline introuvable" });
  res.json(d);
});

// ROUTE 5 : liste complète des établissements
app.get("/api/etablissements", (req, res) => {
  const list = Object.values(db.etablissements);
  res.json(list);
});

// ROUTE 6 : liste complète des disciplines
app.get("/api/disciplines", (req, res) => {
  const list = Object.values(db.discipline);
  res.json(list);
});

// ROUTE 7 : liste complète des mentions
app.get("/api/mentions", (req, res) => {
  const list = Object.values(db.mentions);
  res.json(list);
});


app.get("/api/formations", (req, res) => {
  const { discipline, max } = req.query;

  if (!discipline) {
    return res
      .status(400)
      .json({ error: "Vous devez fournir ?discipline=XX en paramètre." });
  }

  // filtrer les formations
  let results = Object.values(db.formations).filter(
    f => f.id_discipline == discipline
  );

  // appliquer la limite si max fourni
  if (max && !isNaN(max)) {
    results = results.slice(0, Number(max));
  }

  res.json(results);
});

// ROUTE 8 : formations par mention (inm)
app.get("/api/formations/mention/:inm", (req, res) => {
  const { inm } = req.params;
  const { max } = req.query;

  // récupérer toutes les formations ayant la même mention
  let results = Object.values(db.formations).filter(
    f => f.mention_id == inm
  );

  if (results.length === 0) {
    return res.status(404).json({ error: "Aucune formation trouvée pour cette mention." });
  }

  // limiter le nombre de résultats si max est fourni
  if (max && !isNaN(max)) {
    results = results.slice(0, Number(max));
  }

  res.json(results);
});

// ROUTE 9 : formations par établissement (uai)
app.get("/api/formations/etablissement/:uai", (req, res) => {
  const { uai } = req.params;
  const { max } = req.query;

  // récupérer toutes les formations liées à cet établissement
  let results = Object.values(db.formations).filter(
    f => f.etablissement_id == uai
  );

  if (results.length === 0) {
    return res.status(404).json({ error: "Aucune formation trouvée pour cet établissement." });
  }

  // limiter le nombre de résultats
  if (max && !isNaN(max)) {
    results = results.slice(0, Number(max));
  }

  res.json(results);
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("API en ligne sur port " + PORT);
});
