// ✅ Vérifie que les notifications sont disponibles
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    console.log("Permission de notification :", permission);
  });
}

// ✅ Utilise les données directement depuis donnees.js
document.addEventListener("DOMContentLoaded", () => {
  if (Array.isArray(donneesAnniversaires)) {
    console.log("Données chargées :", donneesAnniversaires);
    verifierAnniversaires(donneesAnniversaires);
  } else {
    console.error("Les données d'anniversaire ne sont pas disponibles.");
    afficherErreur("❌ Impossible de charger les données d'anniversaire.");
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
    afficherMessage("✅ Aucun anniversaire prévu pour demain.");
    console.log("Aucun anniversaire pour demain.");
  }
}

// ✅ Affiche une alerte HTML + notification système
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

// ✅ Affiche un message informatif dans la page
function afficherMessage(message) {
  const zoneAlertes = document.getElementById("alertes");
  if (zoneAlertes) {
    zoneAlertes.innerHTML = `<p style="color:green;">${message}</p>`;
  }
}

// ✅ Affiche une erreur dans la page
function afficherErreur(message) {
  const zoneAlertes = document.getElementById("alertes");
  if (zoneAlertes) {
    zoneAlertes.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}