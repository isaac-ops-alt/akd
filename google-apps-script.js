/**
 * =====================================================
 * GOOGLE APPS SCRIPT — I'DART / AKD Academy
 * Capture des formulaires vers Google Sheets
 * =====================================================
 *
 * INSTRUCTIONS D'INSTALLATION (5 étapes) :
 *
 * 1. Va sur https://sheets.google.com et crée un nouveau fichier
 *    Nomme-le : "Contacts I'DART"
 *
 * 2. Dans le menu, clique sur Extensions → Apps Script
 *
 * 3. Efface tout le code existant dans l'éditeur
 *    et colle TOUT le contenu de ce fichier
 *
 * 4. Clique sur "Déployer" → "Nouveau déploiement"
 *    - Type : Application Web
 *    - Qui a accès : Tout le monde (anonyme)
 *    - Clique "Déployer" et autorise les permissions
 *    - COPIE l'URL générée (elle ressemble à :
 *      https://script.google.com/macros/s/XXXXXXX/exec )
 *
 * 5. Dans tes fichiers HTML (danse.html et ateliers.html),
 *    remplace la ligne :
 *      const GOOGLE_SCRIPT_URL = 'VOTRE_URL_GOOGLE_APPS_SCRIPT_ICI';
 *    par :
 *      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TON_ID/exec';
 *
 * =====================================================
 */

// ID de ton Google Spreadsheet (trouve-le dans l'URL de ton sheet)
// Ex: https://docs.google.com/spreadsheets/d/TON_ID_ICI/edit
const SPREADSHEET_ID = 'TON_SPREADSHEET_ID_ICI'; // 👈 À remplacer

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.type === 'inscription_danse') {
      saveInscriptionDanse(ss, data);
    } else if (data.type === 'preinscription_atelier') {
      savePreinscriptionAtelier(ss, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---- Feuille 1 : Inscriptions Danse ----
function saveInscriptionDanse(ss, data) {
  let sheet = ss.getSheetByName('Inscriptions Danse');

  // Crée la feuille avec en-têtes si elle n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet('Inscriptions Danse');
    sheet.appendRow([
      'Date', 'Prénom', 'Nom', 'Âge', 'WhatsApp', 'Niveau', 'Message'
    ]);
    // Mise en forme des en-têtes
    const header = sheet.getRange(1, 1, 1, 7);
    header.setBackground('#4C1D95');
    header.setFontColor('#FFFFFF');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.date    || new Date().toLocaleString('fr-FR'),
    data.prenom  || '',
    data.nom     || '',
    data.age     || '',
    data.whatsapp || '',
    data.niveau  || '',
    data.message || ''
  ]);
}

// ---- Feuille 2 : Pré-inscriptions Ateliers ----
function savePreinscriptionAtelier(ss, data) {
  let sheet = ss.getSheetByName('Pré-inscriptions Ateliers');

  if (!sheet) {
    sheet = ss.insertSheet('Pré-inscriptions Ateliers');
    sheet.appendRow([
      'Date', 'Nom & Prénom', 'WhatsApp', 'Ateliers souhaités', 'Nb personnes'
    ]);
    const header = sheet.getRange(1, 1, 1, 5);
    header.setBackground('#D4860A');
    header.setFontColor('#FFFFFF');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.date     || new Date().toLocaleString('fr-FR'),
    data.nom      || '',
    data.whatsapp || '',
    data.ateliers || '',
    data.enfants  || '1'
  ]);
}

// ---- GET pour tester que le script fonctionne ----
function doGet(e) {
  return ContentService
    .createTextOutput('✅ Script I\'DART actif et fonctionnel !')
    .setMimeType(ContentService.MimeType.TEXT);
}
