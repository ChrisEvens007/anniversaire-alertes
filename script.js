// ✅ Notifications système
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    console.log("Permission de notification :", permission);
  });
}

// ✅ Chargement des données
document.addEventListener("DOMContentLoaded", () => {
  if (Array.isArray(donneesAnniversaires)) {
    verifierAnniversaires(donneesAnniversaires);
  } else {
    afficherErreur("❌ Impossible de charger les données d'anniversaire.");
  }
});

// ✅ Date de demain au format JJ/MM
function calculerDateDemain() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ✅ Vue "Demain"
function verifierAnniversaires(donnees) {
  const dateDemain = calculerDateDemain();
  let alertes = donnees.filter(p => {
    const [j, m] = p.date_naissance.split("/");
    return `${j.padStart(2, '0')}/${m.padStart(2, '0')}` === dateDemain;
  });

  if (alertes.length === 0) {
    afficherMessage("✅ Aucun anniversaire prévu pour demain.");
  } else {
    alertes.forEach(afficherAlerte);
  }
}

// ✅ Affichage d'une alerte
function afficherAlerte(personne) {
  const zone = document.getElementById("alertes");
  if (!zone) return;

  const bloc = document.createElement("div");
  bloc.className = "alerte";
  bloc.innerHTML = `
    <p>🎉 Anniversaire de <strong>${personne.prenom} ${personne.nom}</strong></p>
    ${personne.contact_personnel ? `<p>📱 Personnel : <a href="tel:${personne.contact_personnel}">${personne.contact_personnel}</a></p>` : ""}
    ${personne.contact_parent ? `<p>👨‍👩‍👧 Parent : <a href="tel:${personne.contact_parent}">${personne.contact_parent}</a></p>` : ""}
  `;
  zone.appendChild(bloc);

  if (Notification.permission === "granted") {
    new Notification("🎉 Anniversaire demain !", {
      body: `Demain c’est l’anniversaire de ${personne.prenom} ${personne.nom}`,
      icon: "icone.png"
    });
  }
}

// ✅ Messages
function afficherMessage(msg) {
  const zone = document.getElementById("alertes");
  if (zone) zone.innerHTML = `<p style="color:green;">${msg}</p>`;
}
function afficherErreur(msg) {
  const zone = document.getElementById("alertes");
  if (zone) zone.innerHTML = `<p style="color:red;">${msg}</p>`;
}

// ✅ Génération ICS avec rappels
function genererICS(donnees) {
  let contenu = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anniversaires Alertes//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
  const annee = new Date().getFullYear();

  donnees.forEach(p => {
    const [j, m] = p.date_naissance.split("/");
    const uid = `${p.nom}-${p.prenom}@alertes`;

    contenu += `BEGIN:VEVENT
UID:${uid}
SUMMARY:Anniversaire de ${p.prenom} ${p.nom}
DTSTART;VALUE=DATE:${annee}${m}${j}
RRULE:FREQ=YEARLY
DESCRIPTION:Contact parent: ${p.contact_parent || "N/A"}, personnel: ${p.contact_personnel || "N/A"}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Rappel: Anniversaire demain !
END:VALARM
END:VEVENT
`;
  });

  contenu += `END:VCALENDAR`;

  const blob = new Blob([contenu], { type: "text/calendar" });
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(blob);
  lien.download = "anniversaires.ics";
  lien.click();
}

// ✅ Navigation entre vues
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

// ✅ Vue "Semaine"
function afficherAnniversairesSemaine(donnees) {
  const aujourdHui = new Date();
  const datesSemaine = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(aujourdHui);
    d.setDate(aujourdHui.getDate() + i);
    const jour = String(d.getDate()).padStart(2, '0');
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    datesSemaine.push(`${jour}/${mois}`);
  }

  const alertes = donnees.filter(p => {
    const [j, m] = p.date_naissance.split("/");
    const date = `${j.padStart(2, '0')}/${m.padStart(2, '0')}`;
    return datesSemaine.includes(date);
  });

  if (alertes.length === 0) {
    afficherMessage("✅ Aucun anniversaire cette semaine.");
  } else {
    alertes.forEach(afficherAlerte);
  }
}

// ✅ Vue "Mois"
function afficherAnniversairesMois(donnees) {
  const moisActuel = new Date().getMonth() + 1;

  const alertes = donnees.filter(p => {
    const [j, m] = p.date_naissance.split("/");
    return parseInt(m) === moisActuel;
  });

  if (alertes.length === 0) {
    afficherMessage("✅ Aucun anniversaire ce mois-ci.");
  } else {
    alertes.forEach(afficherAlerte);
  }
}