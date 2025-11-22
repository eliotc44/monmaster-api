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

// ROUTE 4 : discipline par ID
app.get("/api/disciplines/:id", (req, res) => {
  const d = db.discipline[req.params.id] || null;
  if (!d) return res.status(404).json({ error: "Discipline introuvable" });
  res.json(d);
});

// ROUTE 5 : liste complète des établissements (on renvoie l'objet tel quel)
app.get("/api/etablissements", (req, res) => {
  res.json(db.etablissements); // objet indexé par UAI
});

// ROUTE 6 : liste complète des disciplines (objet indexé par ID)
app.get("/api/disciplines", (req, res) => {
  res.json(db.discipline);
});

// ROUTE 7 : liste complète des mentions (objet indexé par INM)
app.get("/api/mentions", (req, res) => {
  res.json(db.mentions);
});

// ROUTE 8 : formations par mention (inm)
app.get("/api/formations/mention/:inm", (req, res) => {
  const { inm } = req.params;
  const { max } = req.query;

  // récupérer toutes les formations ayant la même mention
  // + qui ont bien une géolocalisation (geo.lat / geo.lon non null)
  let results = Object.values(db.formations).filter(f =>
    f.mention_id == inm &&
    f.geo &&                       // l'objet existe
    f.geo.lat != null &&
    f.geo.lon != null
  );

  if (results.length === 0) {
    return res
      .status(404)
      .json({ error: "Aucune formation trouvée pour cette mention avec géolocalisation." });
  }

  // limiter le nombre de résultats si max est fourni
  if (max && !isNaN(max)) {
    results = results.slice(0, Number(max));
  }

  res.json(results);
});

// ROUTE 9 : formations par établissement (uai)
// → retour = objet indexé par ID de formation
app.get("/api/formations/etablissement/:uai", (req, res) => {
  const { uai } = req.params;
  const { max } = req.query;

  let results = Object.values(db.formations).filter(
    f => f.etablissement_id == uai
  );

  if (results.length === 0) {
    return res.status(404).json({
      error: "Aucune formation trouvée pour cet établissement."
    });
  }

  if (max && !isNaN(max)) {
    results = results.slice(0, Number(max));
  }

  const asObject = Object.fromEntries(results.map(f => [f.id, f]));
  res.json(asObject);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("API en ligne sur port " + PORT);
});
