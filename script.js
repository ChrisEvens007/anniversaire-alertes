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

// ✅ Vérifie les anniversaires pour demain
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

  if (Notification.permission === "granted") {
    new Notification("🎉 Anniversaire demain !", {
      body: `Demain c’est l’anniversaire de ${personne.prenom} ${personne.nom}`,
      icon: "icone.png"
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

// ✅ Génère un fichier ICS avec rappels valides
function genererICS(donnees) {
  let contenuICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anniversaires Alertes//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  const anneeActuelle = new Date().getFullYear();

  donnees.forEach(personne => {
    const [jour, mois] = personne.date_naissance.split("/");
    const uid = `${personne.nom}-${personne.prenom}@alertes`;

    contenuICS += `BEGIN:VEVENT
UID:${uid}
SUMMARY:Anniversaire de ${personne.prenom} ${personne.nom}
DTSTART;VALUE=DATE:${anneeActuelle}${mois}${jour}
RRULE:FREQ=YEARLY
DESCRIPTION:Contact parent: ${personne.contact_parent || "N/A"}, personnel: ${personne.contact_personnel || "N/A"}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Rappel: Anniversaire demain !
END:VALARM
END:VEVENT
`;
  });

  contenuICS += `END:VCALENDAR`;

  const blob = new Blob([contenuICS], { type: "text/calendar" });
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(blob);
  lien.download = "anniversaires.ics";
  lien.click();
}

// ✅ Navigation entre vues : demain, semaine, mois
let vueActuelle = 0;

function afficherVueSuivante() {
  vueActuelle = (vueActuelle + 1) % 3;
  document.getElementById("alertes").innerHTML = "";

  if (vueActuelle === 0) {
    verifierAnniversaires(donneesAnniversaires);
  } else if (vueActuelle === 1) {
    afficherAnniversairesSemaine(donneesAnniversaires);
  } else {
    afficherAnniversairesMois(donneesAnniversaires);
  }
}

function afficherVuePrecedente() {
  vueActuelle = (vueActuelle - 1 + 3) % 3;
  document.getElementById("alertes").innerHTML = "";

  if (vueActuelle === 0) {
    verifierAnniversaires(donneesAnniversaires);
  } else if (vueActuelle === 1) {
    afficherAnniversairesSemaine(donneesAnniversaires);
  } else {
    afficherAnniversairesMois(donneesAnniversaires);
  }
}

// ✅ Anniversaires de la semaine (corrigé)
function afficherAnniversairesSemaine(donnees) {
  const aujourdHui = new Date();
  const joursSuivants = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(aujourdHui);
    d.setDate(aujourdHui.getDate() + i);
    const jour = String(d.getDate()).padStart(2, '0');
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    joursSuivants.push(`${jour}/${mois}`);
  }

  const alertes = donnees.filter(p => {
    const [jour, mois] = p.date_naissance.split("/");
    const datePersonne = `${jour.padStart(2, '0')}/${mois.padStart(2, '0')}`;
    return joursSuivants.includes(datePersonne);
  });

  if (alertes.length === 0) {
    afficherMessage("✅ Aucun anniversaire cette semaine.");
  } else {
    alertes.forEach(afficherAlerte);
  }
}

// ✅ Anniversaires du mois (sécurisé)
function afficherAnniversairesMois(donnees) {
  const moisActuel = new Date().getMonth() + 1;

  const alertes = donnees.filter(p => {
    const [jour, mois] = p.date_naissance.split("/");
    return mois && parseInt(mois) === moisActuel;
  });

  if (alertes.length === 0) {
    afficherMessage("✅ Aucun anniversaire ce mois-ci.");
  } else {
    alertes.forEach(afficherAlerte);
  }
}