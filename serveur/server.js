// ===========================
// ✅ SERVEUR D'ANNIVERSAIRES
// ===========================
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 Middleware
app.use(cors());
app.use(bodyParser.json());

// 📂 Fichier JSON contenant les données//
const cheminFichier = "./donnee.json";// <- Important : remonte d’un dossier

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

// Récupère la date de dernière modification du fichier
function derniereMiseAJour() {
  try {
    const stats = fs.statSync(cheminFichier);
    return stats.mtime; // mtime = modification time
  } catch (err) {
    console.error("❌ Erreur lors de la récupération de la date :", err);
    return null;
  }
}

// ===========================
// 🟦 ROUTES API
// ===========================

// 🔹 Récupère la liste des anniversaires
// Si le client envoie ?since=timestamp, on ne renvoie que les nouveautés
app.get("/anniversaires", (req, res) => {
  const donnees = lireDonnees();
  const lastUpdate = derniereMiseAJour();
  const since = req.query.since ? new Date(req.query.since) : null;

  // Si le client a fourni une date de référence
  if (since) {
    // On suppose que chaque entrée possède une propriété "ajoute_le" (date d’ajout)
    const nouvelles = donnees.filter(item => {
      const dateAjout = new Date(item.ajoute_le || lastUpdate);
      return dateAjout > since;
    });

    res.json({
      maj: lastUpdate,
      nouvelles
    });
  } else {
    // Sinon on envoie tout (premier chargement)
    res.json({
      maj: lastUpdate,
      donnees
    });
  }
});

// ===========================
// 🚀 Lancement du serveur
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Serveur d'anniversaires actif sur http://localhost:${PORT}`);
});
