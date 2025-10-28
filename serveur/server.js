// ===========================
// ✅ SERVEUR D'ANNIVERSAIRES
// ===========================

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// 🔧 Middleware
app.use(cors());
app.use(bodyParser.json());

// 📂 Fichier JSON contenant les données
const cheminFichier = "../donnee.json"; // <- Important : remonte d’un dossier

// ===========================
// 🟢 Fonctions utilitaires
// ===========================

// Lecture du fichier JSON
function lireDonnees() {
  try {
    const data = fs.readFileSync(cheminFichier, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Erreur lors de la lecture du fichier JSON :", err);
    return [];
  }
}

// ===========================
// 🟦 ROUTES API
// ===========================

// 🔹 Récupère la liste des anniversaires
app.get("/anniversaires", (req, res) => {
  const donnees = lireDonnees();
  res.json(donnees);
});

// ===========================
// 🚀 Lancement du serveur
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Serveur d'anniversaires actif sur http://localhost:${PORT}`);
});