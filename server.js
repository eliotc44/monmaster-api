import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());

const db = JSON.parse(fs.readFileSync("./private/monmaster_bdd.json", "utf8"));

/* ======================================================
   CONVERSIONS INDEXÉES
   ====================================================== */

// Index formations par ID
const formationsIndex = Object.fromEntries(
  Object.values(db.formations).map(f => [f.id, f])
);

// Index établissements par UAI
const etablissementsIndex = Object.fromEntries(
  db.etablissements.map(e => [e.uai, e])
);

// Index mentions par INM
const mentionsIndex = Object.fromEntries(
  Object.values(db.mentions).map(m => [m.inm, m])
);

// Index disciplines par ID
const disciplinesIndex = Object.fromEntries(
  Object.values(db.discipline).map(d => [d.id, d])
);


/* ======================================================
   ROUTES
   ====================================================== */

// ROUTE 1 : formation par ID
app.get("/api/formations/:id", (req, res) => {
  const id = req.params.id;
  const formation = formationsIndex[id] || null;

  if (!formation) {
    return res.status(404).json({ error: "Formation introuvable" });
  }

  res.json(formation);
});

// ROUTE 2 : établissement par UAI
app.get("/api/etablissements/:uai", (req, res) => {
  const etab = etablissementsIndex[req.params.uai] || null;

  if (!etab) {
    return res.status(404).json({ error: "Établissement introuvable" });
  }

  res.json(etab);
});

// ROUTE 3 : mention par INM
app.get("/api/mentions/:inm", (req, res) => {
  const mention = mentionsIndex[req.params.inm] || null;

  if (!mention) {
    return res.status(404).json({ error: "Mention introuvable" });
  }

  res.json(mention);
});

// ROUTE 4 : discipline par ID
app.get("/api/disciplines/:id", (req, res) => {
  const d = disciplinesIndex[req.params.id] || null;

  if (!d) return res.status(404).json({ error: "Discipline introuvable" });

  res.json(d);
});

// ROUTE 5 : établissements (objet indexé UAI)
app.get("/api/etablissements", (req, res) => {
  res.json(etablissementsIndex);
});

// ROUTE 6 : disciplines (objet indexé ID)
app.get("/api/disciplines", (req, res) => {
  res.json(disciplinesIndex);
});

// ROUTE 7 : mentions (objet indexé INM)
app.get("/api/mentions", (req, res) => {
  res.json(mentionsIndex);
});

// ROUTE 8 : formations filtrées par discipline ID (retour = objet indexé)
app.get("/api/formations", (req, res) => {
  const { discipline, max } = req.query;

  if (!discipline) {
    return res
      .status(400)
      .json({ error: "Vous devez fournir ?discipline=XX en paramètre." });
  }

  const resultsArray = Object.values(formationsIndex).filter(
    f => f.id_discipline == discipline
  );

  const limited = max && !isNaN(max)
    ? resultsArray.slice(0, Number(max))
    : resultsArray;

  const resultsObject = Object.fromEntries(limited.map(f => [f.id, f]));

  res.json(resultsObject);
});

// ROUTE 9 : formations par établissement (UAI)
app.get("/api/formations/etablissement/:uai", (req, res) => {
  const { uai } = req.params;
  const { max } = req.query;

  const resultsArray = Object.values(formationsIndex).filter(
    f => f.etablissement_id == uai
  );

  if (resultsArray.length === 0) {
    return res.status(404).json({
      error: "Aucune formation trouvée pour cet établissement."
    });
  }

  const limited = max && !isNaN(max)
    ? resultsArray.slice(0, Number(max))
    : resultsArray;

  const resultsObject = Object.fromEntries(
    limited.map(f => [f.id, f])
  );

  res.json(resultsObject);
});


/* ======================================================
   SERVEUR
   ====================================================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API en ligne sur port " + PORT);
});
