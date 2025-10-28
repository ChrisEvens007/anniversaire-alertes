// ✅ Notifications système
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    console.log("Permission de notification :", permission);
  });
}

// ✅ Vue active
let vueActuelle = 0;

// ✅ Chargement initial
document.addEventListener("DOMContentLoaded", () => {
  if (typeof donneesAnniversaires !== "undefined" && Array.isArray(donneesAnniversaires)) {
    console.log("✅ Données bien chargées :", donneesAnniversaires);
    afficherVueActuelle();
  } else {
    afficherErreur("❌ Les données d'anniversaire ne sont pas disponibles.");
  }
});

// ✅ Affiche la vue en cours
function afficherVueActuelle() {
  document.getElementById("alertes").innerHTML = "";
  mettreAJourTitreVue();

  if (vueActuelle === 0) {
    verifierAnniversaires(donneesAnniversaires);
  } else if (vueActuelle === 1) {
    afficherAnniversairesSemaine(donneesAnniversaires);
  } else {
    afficherAnniversairesMois(donneesAnniversaires);
  }
}

// ✅ Titre dynamique
function mettreAJourTitreVue() {
  const titre = document.getElementById("titre-vue");
  if (!titre) return;

  if (vueActuelle === 0) {
    titre.textContent = "🎯 Anniversaires de demain";
  } else if (vueActuelle === 1) {
    titre.textContent = "📅 Anniversaires de la semaine";
  } else {
    titre.textContent = "🗓️ Anniversaires du mois";
  }
}

// ✅ Navigation entre vues
function afficherVueSuivante() {
  vueActuelle = (vueActuelle + 1) % 3;
  afficherVueActuelle();
}

function afficherVuePrecedente() {
  vueActuelle = (vueActuelle - 1 + 3) % 3;
  afficherVueActuelle();
}

// ✅ Date de demain au format JJ/MM
function calculerDateDemain() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ✅ Vue "Demain"
function verifierAnniversaires(donnees) {
  const dateDemain = calculerDateDemain();
  const alertes = donnees.filter(p => {
    const [j, m] = p.date_naissance.split("/");
    return `${j.padStart(2, '0')}/${m.padStart(2, '0')}` === dateDemain;
  });

  if (alertes.length === 0) {
    afficherMessage("✅ Aucun anniversaire prévu pour demain.");
  } else {
    alertes.forEach(afficherAlerte);
  }
}

// ✅ Vue "Semaine"
function afficherAnniversairesSemaine(donnees) {
  const aujourdHui = new Date();
  const datesSemaine = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(aujourdHui.getTime());
    d.setDate(aujourdHui.getDate() + i);
    const jour = String(d.getDate()).padStart(2, '0');
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    datesSemaine.push(`${jour}/${mois}`);
  }

  const alertes = donnees.filter(p => {
    const [j, m] = p.date_naissance.split("/");
    const date = `${j.padStart(2, '0')}/${m.padStart(2, '0')}`;
    console.log("Date de chaque personne :", date);
    return datesSemaine.includes(date);
  });

  console.log("Dates de la semaine :", datesSemaine);

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
  if (zone) {
    zone.innerHTML = `<p style="color:green;">${msg}</p>`;
  }
}
function afficherErreur(msg) {
  const zone = document.getElementById("alertes");
  if (zone) {
    zone.innerHTML = `<p style="color:red;">${msg}</p>`;
  }
}