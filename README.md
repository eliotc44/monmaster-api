# 📚 MonMaster API — Documentation

API REST permettant de lire, filtrer et exploiter les données de la base MonMaster (formations, établissements, mentions, disciplines…).

Cette API lit les données générées dans :

```
/private/monmaster_bdd.json
```

et expose une série de routes pour les utiliser facilement dans une application web.

---

## 🚀 Installation

### Prérequis
- Node.js 16+
- npm

### Installation du projet

Dans le dossier `Api` :

```bash
npm install
```

Cela installe les dépendances :

- **express**
- **cors**

### Lancer le serveur

```bash
npm start
```

Si tout fonctionne, vous verrez :

```
API en ligne sur http://localhost:3000
```

---

## 📁 Structure du projet

```
Api/
  server.js                → serveur Express
  package.json
  /private
      monmaster_bdd.json   → base de données générée
```

---

## 🌐 Routes disponibles

### ➤ 1. Récupérer une formation par ID

```
GET /api/formations/:id
```

#### Exemple

```
GET http://localhost:3000/api/formations/1702069A42QX
```

#### Réponse

```json
{
  "id": "1702069A42QX",
  "libelle": "COMMUNICATION PUBLIQUE ET POLITIQUE",
  "parcours": "Communication animation et innovation des territoires",
  "mention_id": "1702069A",
  "etablissement_id": "0350937D",
  "id_discipline": "06",
  "stat_actuel_admission": { ... },
  "insertion_professionnelle": { ... }
}
```

---

### ➤ 2. Récupérer un établissement par UAI

```
GET /api/etablissements/:uai
```

#### Exemple

```
GET http://localhost:3000/api/etablissements/0350937D
```

---

### ➤ 3. Récupérer une mention par code INM

```
GET /api/mentions/:inm
```

---

### ➤ 4. Récupérer une discipline par ID

```
GET /api/disciplines/:id
```

---

## 📋 Routes "liste"

### ➤ 5. Liste complète des établissements

```
GET /api/etablissements
```

---

### ➤ 6. Liste complète des disciplines

```
GET /api/disciplines
```

---

### ➤ 7. Liste complète des mentions

```
GET /api/mentions
```

---

## 🎯 Routes avancées

### ➤ 8. Rechercher des formations par discipline + limiter le nombre

```
GET /api/formations?discipline=XX&max=YY
```

#### Paramètres
- `discipline` → **obligatoire**
- `max` → optionnel (limite de résultats)

#### Exemple

```
GET http://localhost:3000/api/formations?discipline=06&max=10
```

#### Réponse

```json
[
  {
    "id": "1702069A42QX",
    "libelle": "COMMUNICATION PUBLIQUE ET POLITIQUE",
    "parcours": "Communication animation et innovation des territoires",
    "id_discipline": "06",
    "capacite": 32
  }
]
```

---

## ❗ Codes d’erreurs

| Code | Signification |
|------|--------------|
| `404` | Ressource non trouvée |
| `400` | Paramètre manquant |

---

## 🔧 Améliorations possibles

- Route de recherche texte (`?q=communication`)
- Tri dynamique (`?sort=capacite_desc`)
- Pagination (`?page=1&limit=20`)
- Mise en cache RAM (performances ×50)
- Route pour régénérer la base (`/api/generate`)

---

## 📄 Licence

Projet interne étudiant — libre d’usage non commercial.
