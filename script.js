<<<<<<< HEAD
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    console.log("Permission de notification :", permission);
  });
}

fetch("anniversaires.json")
  .then(response => response.json())
  .then(donnees => {
    console.log(donnees); // pour tester
    verifierAnniversaires(donnees); // ta fonction de traitement
  })
  .catch(erreur => {
    console.error("Erreur de chargement du fichier JSON :", erreur);
  });

function calculerDateDemain() {
  const aujourdHui = new Date();
  aujourdHui.setDate(aujourdHui.getDate() + 1);
  const jour = String(aujourdHui.getDate()).padStart(2, '0');
  const mois = String(aujourdHui.getMonth() + 1).padStart(2, '0');
  return `${jour}/${mois}`;
}

function verifierAnniversaires(donnees) {
  const dateDemain = calculerDateDemain();

  donnees.forEach(personne => {
    const [jour, mois] = personne.date_naissance.split("/");
    const datePersonne = `${jour.padStart(2, '0')}/${mois.padStart(2, '0')}`;

    if (datePersonne === dateDemain) {
      afficherAlerte(personne);
    }
  });
}

function afficherAlerte(personne) {
  const zoneAlertes = document.getElementById("alertes");

  const alerte = document.createElement("div");
  alerte.className = "alerte";

  alerte.innerHTML = `
    <p>🎉 Demain c’est l’anniversaire de <strong>${personne.prenom} ${personne.nom}</strong></p>
    ${personne.contact_personnel ? `<p>📱 Personnel : <a href="tel:${personne.contact_personnel}">${personne.contact_personnel}</a></p>` : ""}
    ${personne.contact_parent ? `<p>👨‍👩‍👧 Parent : <a href="tel:${personne.contact_parent}">${personne.contact_parent}</a></p>` : ""}
  `;

  zoneAlertes.appendChild(alerte);

  // ✅ Notification dynamique
  if (Notification.permission === "granted") {
    new Notification("🎉 Anniversaire demain !", {
      body: `Demain c’est l’anniversaire de ${personne.prenom} ${personne.nom}`,
      icon: "icone.png" // facultatif
    });
  }
=======
fetch("anniversaires.json")
  .then(response => response.json())
  .then(donnees => {
    console.log(donnees); // pour tester
    verifierAnniversaires(donnees); // ta fonction de traitement
  })
  .catch(erreur => {
    console.error("Erreur de chargement du fichier JSON :", erreur);
  });
  function calculerDateDemain(){
    const aujourdHui = new Date();
    aujourdHui.setDate(aujourdHui.getDate()+1);
    const jour = String(aujourdHui.getDate()).padStart(2, '0');
    const mois = String(aujourdHui.getMonth()+1).padStart(2, '0');
  return `${jour}/${mois}`;
}
  function verifierAnniversaires(donnees) {
  const dateDemain = calculerDateDemain();

  donnees.forEach(personne => {
    const [jour, mois] = personne.date_naissance.split("/");
    const datePersonne = `${jour.padStart(2, '0')}/${mois.padStart(2, '0')}`;

    if (datePersonne === dateDemain) {
      afficherAlerte(personne);
    }
  });
}
function afficherAlerte(personne) {
  const zoneAlertes = document.getElementById("alertes");

  const alerte = document.createElement("div");
  alerte.className = "alerte";

  alerte.innerHTML = `
    <p>🎉 Demain c’est l’anniversaire de <strong>${personne.prenom} ${personne.nom}</strong></p>
    ${personne.contact_personnel ? `<p>📱 Personnel : <a href="tel:${personne.contact_personnel}">${personne.contact_personnel}</a></p>` : ""}
    ${personne.contact_parent ? `<p>👨‍👩‍👧 Parent : <a href="tel:${personne.contact_parent}">${personne.contact_parent}</a></p>` : ""}
  `;

  zoneAlertes.appendChild(alerte);
>>>>>>> 84dfda62b7499ab8c37415a140206b096306d931
}