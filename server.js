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
const cheminFichier = "./donnee.json"; // <- Important : remonte d’un dossier

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

// Écriture dans le fichier JSON
function ecrireDonnees(donnees) {
  try {
    fs.writeFileSync(cheminFichier, JSON.stringify(donnees, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Erreur lors de l'écriture dans le fichier JSON :", err);
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

// 🔹 Ajoute un nouvel anniversaire
app.post("/ajouter", (req, res) => {
  const { prenom, nom, date_naissance, contact_parent, contact_personnel } = req.body;

  if (!prenom || !nom || !date_naissance) {
    return res.status(400).json({ erreur: "Champs requis manquants." });
  }

  const donnees = lireDonnees();
  donnees.push({ prenom, nom, date_naissance, contact_parent, contact_personnel });
  ecrireDonnees(donnees);

  console.log(`✅ Ajout de ${prenom} ${nom}`);
  res.json({ message: `✅ ${prenom} ${nom} ajouté(e) avec succès !`, donnees });
});

// 🔹 Supprime un anniversaire par nom
app.post("/supprimer", (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ erreur: "Nom requis pour la suppression." });
  }

  let donnees = lireDonnees();
  const avant = donnees.length;

  donnees = donnees.filter(p => p.nom.toLowerCase() !== nom.toLowerCase());
  ecrireDonnees(donnees);

  if (avant === donnees.length) {
    console.log(`❌ Aucun nom "${nom}" trouvé.`);
    res.json({ message: `❌ Aucun nom "${nom}" trouvé.` });
  } else {
    console.log(`🗑️ ${nom} supprimé.`);
    res.json({ message: `🗑️ ${nom} supprimé avec succès.`, donnees });
  }
});

// ===========================
// 🚀 Lancement du serveur
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Serveur d'anniversaires actif sur http://localhost:${PORT}`);
});
