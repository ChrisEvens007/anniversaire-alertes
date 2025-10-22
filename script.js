// ✅ Vérifie que les notifications sont disponibles
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    console.log("Permission de notification :", permission);
  });
}

// ✅ Charge le fichier JSON
fetch("anniversaires.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then(donnees => {
    console.log("Données chargées :", donnees);
    verifierAnniversaires(donnees);
  })
  .catch(erreur => {
    console.error("Erreur de chargement du fichier JSON :", erreur);
    const zoneAlertes = document.getElementById("alertes");
    if (zoneAlertes) {
      zoneAlertes.innerHTML = `<p style="color:red;">❌ Impossible de charger les données d'anniversaire.</p>`;
    }
  });

// ✅ Calcule la date de demain au format JJ/MM
function calculerDateDemain() {
  const aujourdHui = new Date();
  aujourdHui.setDate(aujourdHui.getDate() + 1);
  const jour = String(aujourdHui.getDate()).padStart(2, '0');
  const mois = String(aujourdHui.getMonth() + 1).padStart(2, '0');
  return `${jour}/${mois}`;
}

// ✅ Vérifie les anniversaires dans les données
function verifierAnniversaires(donnees) {
  const dateDemain = calculerDateDemain();
  let alertesTrouvées = false;

  donnees.forEach(personne => {
    if (!personne.date_naissance) return;

    const [jour, mois] = personne.date_naissance.split("/");
    if (!jour || !mois) return;

    const datePersonne = `${jour.padStart(2, '0')}/${mois.padStart(2, '0')}`;

    if (datePersonne === dateDemain) {
      afficherAlerte(personne);
      alertesTrouvées = true;
    }
  });

  if (!alertesTrouvées) {
    console.log("Aucun anniversaire pour demain.");
  }
}

// ✅ Affiche l’alerte dans le volet HTML + notification système
function afficherAlerte(personne) {
  const zoneAlertes = document.getElementById("alertes");
  if (!zoneAlertes) {
    console.warn("Élément #alertes introuvable dans le HTML.");
    return;
  }

  const alerte = document.createElement("div");
  alerte.className = "alerte";

  alerte.innerHTML = `
    <p>🎉 Demain c’est l’anniversaire de <strong>${personne.prenom} ${personne.nom}</strong></p>
    ${personne.contact_personnel ? `<p>📱 Personnel : <a href="tel:${personne.contact_personnel}">${personne.contact_personnel}</a></p>` : ""}
    ${personne.contact_parent ? `<p>👨‍👩‍👧 Parent : <a href="tel:${personne.contact_parent}">${personne.contact_parent}</a></p>` : ""}
  `;

  zoneAlertes.appendChild(alerte);

  // ✅ Notification système
  if (Notification.permission === "granted") {
    new Notification("🎉 Anniversaire demain !", {
      body: `Demain c’est l’anniversaire de ${personne.prenom} ${personne.nom}`,
      icon: "icone.png" // facultatif
    });
  }
}