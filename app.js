// --- Navigation SPA ---
function showSection(section) {
    document.getElementById('section-calcul').style.display      = (section === 'calcul')      ? '' : 'none';
    document.getElementById('section-recap').style.display       = (section === 'recap')       ? '' : 'none';
    document.getElementById('section-besoins').style.display     = (section === 'besoins')     ? '' : 'none';
    document.getElementById('section-impression').style.display  = (section === 'impression')  ? '' : 'none';

    document.getElementById('nav-calcul').classList.toggle('active', section === 'calcul');
    document.getElementById('nav-recap').classList.toggle('active', section === 'recap');
    document.getElementById('nav-besoins').classList.toggle('active', section === 'besoins');
    document.getElementById('nav-impression').classList.toggle('active', section === 'impression');
    if(section === 'calcul') setTimeout(initAllAutocompletes,0);
}
document.getElementById('nav-calcul').onclick     = function(e){e.preventDefault(); showSection('calcul');};
document.getElementById('nav-recap').onclick      = function(e){e.preventDefault(); showSection('recap');};
document.getElementById('nav-besoins').onclick    = function(e){e.preventDefault(); showSection('besoins');};
document.getElementById('nav-impression').onclick = function(e){e.preventDefault(); showSection('impression');};
showSection('calcul');

// --- Données produits ---
const dataProduits = [
    { nom: "ACAPULCO", poidsSac: 15, prixDetail: 98 },
    { nom: "AUSTRAL", poidsSac: 10, prixDetail: 60 },
    { nom: "CYRIUS", poidsSac: 10, prixDetail: 45 },
    { nom: "DÉROBÉES PROTÉINES 3", poidsSac: 15, prixDetail: 70 },
    { nom: "F. DES PRÉS PREVAL/COSMOPOLITAIN", poidsSac: 10, prixDetail: 93 },
    { nom: "F.ELEVEE ROSPARON", poidsSac: 10, prixDetail: 93 },
    { nom: "FANTASIA/SANTA", poidsSac: 15, prixDetail: 82 },
    { nom: "FLORIUS", poidsSac: 10, prixDetail: 65 },
    { nom: "GENERIQUE (RGI)", poidsSac: 10, prixDetail: 25 },
    { nom: "GENERIQUE 4n FABIO", poidsSac: 25, prixDetail: 90 },
    { nom: "IBIZAL", poidsSac: 10, prixDetail: 45 },
    { nom: "IMPERIO", poidsSac: 10, prixDetail: 35 },
    { nom: "LIDMETHA 20", poidsSac: 15, prixDetail: 75 },
    { nom: "LUXURY 3A", poidsSac: 15, prixDetail: 112 },
    { nom: "LUXURY AZOMAX", poidsSac: 10, prixDetail: 98 },
    { nom: "LUXURY TERRES FRANCHES", poidsSac: 15, prixDetail: 93 },
    { nom: "LUXURY TERRES SECHANTES", poidsSac: 15, prixDetail: 97 },
    { nom: "MAJESTY", poidsSac: 10, prixDetail: 34 },
    { nom: "M-ESTIVAL", poidsSac: 25, prixDetail: 98 },
    { nom: "M-VALO/PROTE HIVERNAAL", poidsSac: 15, prixDetail: 56 },
    { nom: "MÉLANGE ATLAS", poidsSac: 15, prixDetail: 100 },
    { nom: "MÉLANGE DOMINGO", poidsSac: 15, prixDetail: 138 },
    { nom: "MÉLANGE PPL", poidsSac: 15, prixDetail: 83 },
    { nom: "MÉLANGE VICKING", poidsSac: 15, prixDetail: 76 },
    { nom: "MOHA SC", poidsSac: 25, prixDetail: 98 },
    { nom: "MOUTARDE BLANCHE", poidsSac: 25, prixDetail: 75 },
    { nom: "MOUTARDE BRUNE MINARET", poidsSac: 10, prixDetail: 69 },
    { nom: "NOCULUM LUZERNE UAB", poidsSac: 1, prixDetail: 15 },
    { nom: "PALMATA", poidsSac: 10, prixDetail: 58 },
    { nom: "PIROL", poidsSac: 10, prixDetail: 49 },
    { nom: "PONCHO", poidsSac: 15, prixDetail: 84 },
    { nom: "PRESTO", poidsSac: 10, prixDetail: 93 },
    { nom: "RGA MELIPRE ARMORIK", poidsSac: 15, prixDetail: 67 },
    { nom: "RINGO/REBOUND", poidsSac: 10, prixDetail: 47 },
    { nom: "ROULON", poidsSac: 10, prixDetail: 76 },
    { nom: "SMART", poidsSac: 15, prixDetail: 76 },
    { nom: "TAMPICO", poidsSac: 10, prixDetail: 103 },
    { nom: "TONUSS", poidsSac: 15, prixDetail: 78 },
    { nom: "TRÈFLE BLANC INTERMÉDIAIRE GABBY/MELITAL", poidsSac: 5, prixDetail: 68 },
    { nom: "TRÈFLE D'ALEXANDRIE", poidsSac: 25, prixDetail: 128 },
    { nom: "TRÈFLE INCARNAT GÉNÉRIQUE (10 kg)", poidsSac: 10, prixDetail: 98 },
    { nom: "TRÈFLE INCARNAT GÉNÉRIQUE (25 kg)", poidsSac: 25, prixDetail: 128 },
    { nom: "TRÈFLE VIOLET SECRETARIAT", poidsSac: 10, prixDetail: 100 },
    { nom: "TRÈFLE VIOLET GÉNÉRIQUE (10 kg)", poidsSac: 10, prixDetail: 92 },
    { nom: "TRÈFLE VIOLET GÉNÉRIQUE (25 kg)", poidsSac: 25, prixDetail: 179 }
];

// --- Variables globales ---
let melangeProduitCount = 1;
let besoinsTotaux = {};
let coutsTotaux = {};
let calculsHistorique = [];

// --- Autocomplete ---
function setupAutocomplete(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);
    if (!input || !suggestions) return;
    input.oninput = null;
    input.onfocus = null;
    input.addEventListener("input", function() {
        const value = this.value.trim().toLowerCase();
        suggestions.innerHTML = "";
        if (!value) return;
        const matches = dataProduits.filter(p => p.nom.toLowerCase().includes(value));
        matches.forEach(prod => {
            const div = document.createElement("div");
            div.textContent = prod.nom;
            div.onclick = function() {
                input.value = prod.nom;
                suggestions.innerHTML = "";
                if (inputId === "produit-unique") {
                    afficherInfoProduit(input, "info-produit-unique");
                } else if (inputId.startsWith("produit-melange-")) {
                    const idx = inputId.split("-").pop();
                    afficherInfoProduit(input, "info-produit-melange-" + idx);
                }
            };
            suggestions.appendChild(div);
        });
    });
    input.addEventListener("focus", function() {
        input.dispatchEvent(new Event('input'));
    });
    document.addEventListener("click", function(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.innerHTML = "";
        }
    });
}
function initAllAutocompletes() {
    setupAutocomplete("produit-unique", "suggestions-unique");
    document.querySelectorAll('.produit-melange').forEach(input => {
        const id = input.id;
        const idx = input.dataset.index;
        if (id && idx) setupAutocomplete(id, "suggestions-melange-" + idx);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    initAllAutocompletes();
    document.getElementById('produit-unique').addEventListener('change', function() {
        afficherInfoProduit(this, 'info-produit-unique');
    });
    document.getElementById('produit-melange-1').addEventListener('change', function() {
        afficherInfoProduit(this, 'info-produit-melange-1');
    });
});

// --- Affichage Infos produit ---
function afficherInfoProduit(inputElement, infoDivId) {
    const value = inputElement.value;
    const produit = dataProduits.find(p => p.nom === value);
    const infoDiv = document.getElementById(infoDivId);
    if (produit) {
        infoDiv.style.display = 'block';
        if (infoDivId === "info-produit-unique") {
            document.getElementById("poids-sac-unique").textContent = produit.poidsSac;
            if (document.getElementById("prix-sac-unique") && document.getElementById("prix-sac-unique").value === "" && produit.prixDetail) {
                document.getElementById("prix-sac-unique").value = produit.prixDetail;
            }
        } else {
            const poidsSacSpan = infoDiv.querySelector('.poids-sac-melange');
            if (poidsSacSpan) poidsSacSpan.textContent = produit.poidsSac;
            const idx = infoDivId.split("-").pop();
            const prixInput = infoDiv.querySelector('.prix-sac-melange[data-index="' + idx + '"]');
            if (prixInput && prixInput.value === "" && produit.prixDetail) {
                prixInput.value = produit.prixDetail;
            }
        }
    } else {
        infoDiv.style.display = 'none';
    }
}

// --- Ajout d'un produit dans le mélange ---
document.getElementById("ajouter-produit-melange").addEventListener("click", function () {
    melangeProduitCount++;
    const newMelangeDiv = document.createElement("div");
    newMelangeDiv.className = "melange-produit";
    newMelangeDiv.innerHTML = `
        <div>
            <label for="produit-melange-${melangeProduitCount}">Produit ${melangeProduitCount}:</label>
            <div class="autocomplete-container">
                <input class="produit-melange" id="produit-melange-${melangeProduitCount}" data-index="${melangeProduitCount}" type="text" placeholder="Commencez à taper le nom d'un produit..." autocomplete="off" />
                <div id="suggestions-melange-${melangeProduitCount}" class="suggestions-list"></div>
            </div>
            <div id="info-produit-melange-${melangeProduitCount}" class="produit-info" style="display: none;">
                <div class="poids-sac-info">
                    <div>Poids du sac:</div>
                    <span class="poids-sac-melange"></span> kg
                </div>
                <div class="prix-sac">
                    <div>Prix du sac:</div>
                    <input type="number" class="prix-sac-melange" data-index="${melangeProduitCount}" min="0" step="0.01" placeholder="Prix €/sac"> €
                </div>
            </div>
        </div>
        <div>
            <label for="dose-melange-${melangeProduitCount}">Dose (kg/ha):</label>
            <input type="number" class="dose-melange" id="dose-melange-${melangeProduitCount}" data-index="${melangeProduitCount}" min="0" step="0.1" value="0">
        </div>
        <div>
            <button type="button" class="supprimer-produit modern-button" data-index="${melangeProduitCount}">Supprimer</button>
        </div>
    `;
    document.getElementById("melange-container").appendChild(newMelangeDiv);
    initAllAutocompletes();
    newMelangeDiv.querySelector('.produit-melange').addEventListener('change', function () {
        afficherInfoProduit(this, `info-produit-melange-${melangeProduitCount}`);
    });
    newMelangeDiv.querySelector('.supprimer-produit').addEventListener('click', function () {
        supprimerProduitMelange(melangeProduitCount);
    });
    actualiserNumerotationProduits();
});

// --- Suppression d'un produit du mélange ---
function supprimerProduitMelange(index) {
    const produits = document.querySelectorAll('.melange-produit');
    produits.forEach(produit => {
        if (
            produit.querySelector(`[data-index="${index}"]`) ||
            produit.querySelector(`#produit-melange-${index}`)
        ) {
            produit.remove();
        }
    });
    actualiserNumerotationProduits();
}

// --- Actualiser la numérotation pour éviter les bugs d'IDs ---
function actualiserNumerotationProduits() {
    document.querySelectorAll('.melange-produit').forEach((produit, index) => {
        const currentIndex = index + 1;
        // Input produit
        const input = produit.querySelector('.produit-melange');
        if (input) {
            input.setAttribute('id', `produit-melange-${currentIndex}`);
            input.setAttribute('data-index', currentIndex);
        }
        // Suggestions div
        const suggestions = produit.querySelector('.suggestions-list');
        if (suggestions) suggestions.setAttribute('id', `suggestions-melange-${currentIndex}`);
        // Dose
        const doseInput = produit.querySelector('.dose-melange');
        if (doseInput) {
            doseInput.setAttribute('id', `dose-melange-${currentIndex}`);
            doseInput.setAttribute('data-index', currentIndex);
        }
        // Prix
        const prixSacInput = produit.querySelector('.prix-sac-melange');
        if (prixSacInput) prixSacInput.setAttribute('data-index', currentIndex);
        // Info div
        const infoDiv = produit.querySelector('.produit-info');
        if (infoDiv) infoDiv.setAttribute('id', `info-produit-melange-${currentIndex}`);
        // Supprimer bouton
        const supprimerBtn = produit.querySelector('.supprimer-produit');
        if (supprimerBtn) supprimerBtn.setAttribute('data-index', currentIndex);
    });
    melangeProduitCount = document.querySelectorAll('.melange-produit').length;

    // --- Patch : Réattache l'autocomplete à tous les inputs après renumérotation ---
    initAllAutocompletes();
}

// --- Réinitialisation ---
function reinitialiserCalculUnique() {
    document.getElementById("produit-unique").value = '';
    document.getElementById("dose-unique").value = '';
    document.getElementById("surface-unique").value = '1';
    document.getElementById("prix-sac-unique").value = '';
    document.getElementById("info-produit-unique").style.display = 'none';
}
function reinitialiserMelange() {
    const produits = document.querySelectorAll('.melange-produit');
    produits.forEach((produit, index) => {
        if (index > 0) {
            produit.remove();
        } else {
            const select = produit.querySelector('.produit-melange');
            const doseInput = produit.querySelector('.dose-melange');
            const prixSacInput = produit.querySelector('.prix-sac-melange');
            const infoDiv = produit.querySelector('.produit-info');
            if (select) select.value = '';
            if (doseInput) doseInput.value = '0';
            if (prixSacInput) prixSacInput.value = '';
            if (infoDiv) infoDiv.style.display = 'none';
        }
    });
    actualiserNumerotationProduits();
}

// --- Calcul besoin unique ---
function calculerBesoinUnique() {
    const produit = document.getElementById("produit-unique").value;
    const dose = parseFloat(document.getElementById("dose-unique").value);
    const surface = parseFloat(document.getElementById("surface-unique").value);
    const prixSac = parseFloat(document.getElementById("prix-sac-unique").value) || 0;
    if (!produit || isNaN(dose) || isNaN(surface)) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    const produitInfo = dataProduits.find(p => p.nom === produit);
    if (!produitInfo) {
        alert("Produit inconnu. Choisissez dans la liste suggérée.");
        return;
    }
    const id = `unique-${Date.now()}`;
    const calcul = {
        id: id,
        type: 'unique',
        produit: produit,
        dose: dose,
        surface: surface,
        prixSac: prixSac
    };
    ajouterRecapitulatif(calcul);
    afficherBesoinsProduits();
}

// --- Calcul besoin mélange ---
function calculerBesoinMelange() {
    const surface = parseFloat(document.getElementById("surface-melange").value);
    if (isNaN(surface)) {
        alert("Veuillez entrer une surface valide.");
        return;
    }
    let produits = [];
    let hasError = false;
    document.querySelectorAll('.melange-produit').forEach(melangeProduit => {
        const produitInput = melangeProduit.querySelector('.produit-melange');
        const produit = produitInput.value;
        const dose = parseFloat(melangeProduit.querySelector('.dose-melange').value);
        const prixSac = parseFloat(melangeProduit.querySelector('.prix-sac-melange').value) || 0;
        const produitInfo = dataProduits.find(p => p.nom === produit);
        if (!produit || isNaN(dose) || !produitInfo) {
            alert("Veuillez remplir tous les champs pour chaque produit du mélange et choisir un produit valide.");
            hasError = true;
            return;
        }
        produits.push({
            nom: produit,
            dose: dose,
            prixSac: prixSac
        });
    });
    if (hasError) return;
    const id = `melange-${Date.now()}`;
    ajouterRecapitulatif({
        id: id,
        type: 'melange',
        surface: surface,
        produits: produits
    });
    afficherBesoinsProduits();
}

// --- Recapitulatif ---
function rafraichirRecapitulatif() {
    const recapPurs = document.getElementById('recap-content-purs');
    const recapMelanges = document.getElementById('recap-content-melanges');
    recapPurs.innerHTML = '';
    recapMelanges.innerHTML = '';

    // --- Produits purs ---
    let purs = calculsHistorique.filter(c => c.type === 'unique');
    purs.forEach((calcul, idx) => {
        if (idx > 0) {
            let sep = document.createElement('tr');
            sep.className = "sep-row";
            sep.innerHTML = `<td colspan="6"></td>`;
            recapPurs.appendChild(sep);
        }
        recapPurs.appendChild(creerLignePur(calcul));
    });

    // --- Mélanges ---
    let melanges = calculsHistorique.filter(c => c.type === 'melange');
    melanges.forEach((calcul, idx) => {
        if (idx > 0) {
            let sep = document.createElement('tr');
            sep.className = "sep-row";
            sep.innerHTML = `<td colspan="6"></td>`;
            recapMelanges.appendChild(sep);
        }
        calcul.produits.forEach((produit, idxProd) => {
            recapMelanges.appendChild(
                creerLigneMelange(
                    calcul,
                    produit,
                    idxProd === 0 ? calcul.produits.length : 0,
                    idxProd === 0 // showCoutHa: true uniquement sur la première ligne du mélange !
                )
            );
        });
    });
}

// --- Création ligne produit pur ---
function creerLignePur(calcul) {
    const tr = document.createElement("tr");
    tr.dataset.recapId = calcul.id;
    tr.innerHTML = `
        <td>${calcul.produit}</td>
        <td><input type="number" class="table-input prix-modifiable" value="${calcul.prixSac}" min="0" step="0.01" data-type="unique" data-id="${calcul.id}"></td>
        <td><input type="number" class="table-input surface-modifiable" value="${calcul.surface}" min="0" step="0.01" data-type="unique" data-id="${calcul.id}"></td>
        <td><input type="number" class="table-input dose-modifiable" value="${calcul.dose}" min="0" step="0.1" data-type="unique" data-id="${calcul.id}"></td>
        <td class="cout-cell">${Math.round(calculerCoutHa(calcul))} €</td>
        <td class="actions-cell">
            <button class="modern-button danger-button" onclick="supprimerRecapitulatif('${calcul.id}')">Supprimer</button>
        </td>
    `;
    tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', listenerMiseAJourRecap);
    });
    return tr;
}

// --- Création ligne mélange (un tr par produit d'un mélange) ---
function creerLigneMelange(calcul, produit, rowspan, showCoutHa) {
    const tr = document.createElement("tr");
    tr.dataset.recapId = calcul.id;
    // Surface et coût/ha affichés uniquement sur la première ligne avec rowspan
    const surfaceCell = rowspan > 0
        ? `<td rowspan="${rowspan}"><input type="number" class="table-input surface-modifiable" value="${calcul.surface}" min="0" step="0.01" data-type="melange" data-id="${calcul.id}"></td>`
        : "";
    const coutHaCell = showCoutHa
        ? `<td class="cout-cell cout-moyenne-melange" rowspan="${rowspan}">${Math.round(calculerCoutHaMoyenneMelange(calcul))} €</td>`
        : "";

    tr.innerHTML = `
        <td>${produit.nom}</td>
        <td><input type="number" class="table-input prix-modifiable" value="${produit.prixSac}" min="0" step="0.01" data-type="melange" data-id="${calcul.id}" data-produit="${produit.nom}"></td>
        ${surfaceCell}
        <td><input type="number" class="table-input dose-modifiable" value="${produit.dose}" min="0" step="0.1" data-type="melange" data-id="${calcul.id}" data-produit="${produit.nom}"></td>
        ${coutHaCell}
        <td class="actions-cell"${rowspan > 0 ? ` rowspan="${rowspan}"` : ''}>
            ${rowspan > 0 ? `<button class="modern-button danger-button" onclick="supprimerRecapitulatif('${calcul.id}')">Supprimer</button>` : ''}
        </td>
    `;
    tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', listenerMiseAJourRecap);
    });
    return tr;
}

function calculerCoutHaMelange(calcul, produit) {
    const produitInfo = dataProduits.find(p => p.nom === produit.nom);
    if (produitInfo && produitInfo.poidsSac > 0) {
        return (produit.prixSac * produit.dose) / produitInfo.poidsSac;
    }
    return 0;
}
function calculerCoutHaMoyenneMelange(calcul) {
    let somme = 0;
    calcul.produits.forEach(produit => {
        const produitInfo = dataProduits.find(p => p.nom === produit.nom);
        if (produitInfo && produitInfo.poidsSac > 0) {
            somme += (produit.prixSac * produit.dose) / produitInfo.poidsSac;
        }
    });
    return somme;
}

// --- Ajoute ou retire une intention, puis refresh ---
function ajouterRecapitulatif(calcul) {
    calculsHistorique.push(calcul);
    rafraichirRecapitulatif();
    afficherBesoinsProduits();
}
function supprimerRecapitulatif(id) {
    calculsHistorique = calculsHistorique.filter(item => item.id !== id);
    rafraichirRecapitulatif();
    recalculerBesoinsTotaux();
    afficherBesoinsProduits();
}

// --- Besoins produits & coût total (TABLEAU) ---
function recalculerBesoinsTotaux() {
    besoinsTotaux = {};
    coutsTotaux = {};
    for (const calcul of calculsHistorique) {
        if (calcul.type === 'unique') {
            const produit = calcul.produit;
            const besoin = calcul.dose * calcul.surface;
            besoinsTotaux[produit] = (besoinsTotaux[produit] || 0) + besoin;
            const produitInfo = dataProduits.find(p => p.nom === produit);
            const nombreSacs = produitInfo ? Math.ceil(besoin / produitInfo.poidsSac) : 0;
            coutsTotaux[produit] = (coutsTotaux[produit] || 0) + (nombreSacs * (calcul.prixSac || 0));
        } else if (calcul.type === 'melange') {
            for (const prod of calcul.produits) {
                const besoin = prod.dose * calcul.surface;
                besoinsTotaux[prod.nom] = (besoinsTotaux[prod.nom] || 0) + besoin;
                const produitInfo = dataProduits.find(p => p.nom === prod.nom);
                const nombreSacs = produitInfo ? Math.ceil(besoin / produitInfo.poidsSac) : 0;
                coutsTotaux[prod.nom] = (coutsTotaux[prod.nom] || 0) + (nombreSacs * (prod.prixSac || 0));
            }
        }
    }
}

// Affichage : Tableau
function afficherBesoinsProduits() {
    recalculerBesoinsTotaux();
    const besoinsContent = document.getElementById('besoins-content');
    const coutContent = document.getElementById('cout-content');
    besoinsContent.innerHTML = '';
    let totalGeneral = 0;

    // Création du tableau HTML (toujours visible, SANS la colonne Prix sac)
    let table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
        <thead>
            <tr>
                <th style="border-bottom:1px solid #b6e5a6;text-align:left;padding:6px;">Produit</th>
                <th style="border-bottom:1px solid #b6e5a6;text-align:right;padding:6px;">Conditionnement (kg)</th>
                <th style="border-bottom:1px solid #b6e5a6;text-align:right;padding:6px;">Besoins (sacs)</th>
                <th style="border-bottom:1px solid #b6e5a6;text-align:right;padding:6px;">Coût total (€)</th>
                <th style="border-bottom:1px solid #b6e5a6;text-align:right;padding:6px;">Reste (kg)</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    let hasBesoins = false;
    for (const produit in besoinsTotaux) {
        hasBesoins = true;
        const produitInfo = dataProduits.find(p => p.nom === produit);
        if (produitInfo) {
            const besoinTotal = besoinsTotaux[produit];
            const poidsSac = produitInfo.poidsSac;
            const nombreSacs = Math.ceil(besoinTotal / poidsSac);
            const coutTotal = coutsTotaux[produit] || 0;
            const resteKg = poidsSac - (besoinTotal % poidsSac);
            const resteAffiche = (resteKg === poidsSac) ? '0' : resteKg.toFixed(2);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:6px 4px;vertical-align:top;">${produit}</td>
                <td style="text-align:right;padding:6px 4px;vertical-align:top;">${poidsSac}</td>
                <td style="text-align:right;padding:6px 4px;vertical-align:top;">${nombreSacs}</td>
                <td style="text-align:right;padding:6px 4px;vertical-align:top;">${Math.round(coutTotal)}</td>
                <td style="text-align:right;padding:6px 4px;vertical-align:top;">${resteAffiche}</td>
            `;
            tbody.appendChild(tr);
            totalGeneral += coutTotal;
        }
    }

    // Si aucun besoin, affiche un tableau vide avec l'en-tête
    if (!hasBesoins) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="text-align:center;color:#aaa;padding:12px;">Aucun besoin calculé pour le moment.</td>`;
        tbody.appendChild(tr);
    }

    besoinsContent.appendChild(table);

    // Récupère la remise totale
    let remiseInput = document.getElementById('remise-besoins');
    let remisePct = remiseInput ? parseFloat(remiseInput.value) || 0 : 0;
    let montantRemise = totalGeneral * remisePct / 100;
    let totalAvecRemise = totalGeneral - montantRemise;

    // Affichage du coût total selon remise
    if (remisePct > 0) {
        coutContent.innerHTML = `
            <div class="total-row">
                <strong>Coût Total Estimé (par sacs complets):</strong> 
                <span style="text-decoration:line-through">${Math.round(totalGeneral)} €</span>
                <span style="color:green;font-weight:bold;font-size:1.05em;"> ${Math.round(totalAvecRemise)} €</span>
                <span style="color:green;">(-${Math.round(montantRemise)} €, Remise ${remisePct}%)</span>
            </div>
        `;
    } else {
        coutContent.innerHTML = `
            <div class="total-row">
                <strong>Coût Total Estimé (par sacs complets):</strong> 
                <span>${Math.round(totalGeneral)} €</span>
            </div>
        `;
    }
}
// --- Calcul coût/ha ---
function calculerCoutHa(calcul) {
    let coutHa = 0;
    if (calcul.type === 'unique') {
        if (calcul.prixSac) {
            const produitInfo = dataProduits.find(p => p.nom === calcul.produit);
            if (produitInfo && produitInfo.poidsSac > 0) {
                coutHa = (calcul.prixSac * calcul.dose) / produitInfo.poidsSac;
            }
        }
    } else if (calcul.type === 'melange') {
        calcul.produits.forEach(produit => {
            if (produit.prixSac) {
                const produitInfo = dataProduits.find(p => p.nom === produit.nom);
                if (produitInfo && produitInfo.poidsSac > 0) {
                    coutHa += (produit.prixSac * produit.dose) / produitInfo.poidsSac;
                }
            }
        });
    }
    return coutHa;
}

// --- Listeners Recap (modifs doses/prix dynamiques) ---
function attacherListenersModifications() {
    document.querySelectorAll('.dose-modifiable').forEach(input => {
        input.oninput = null;
        input.onchange = null;
    });
    document.querySelectorAll('.prix-modifiable').forEach(input => {
        input.oninput = null;
        input.onchange = null;
    });
    document.querySelectorAll('.dose-modifiable').forEach(input => {
        input.addEventListener('input', listenerMiseAJourRecap);
        input.addEventListener('change', listenerMiseAJourRecap);
    });
    document.querySelectorAll('.prix-modifiable').forEach(input => {
        input.addEventListener('input', listenerMiseAJourRecap);
        input.addEventListener('change', listenerMiseAJourRecap);
    });
}

function listenerMiseAJourRecap(e) {
    const input = e.target;
    const type = input.dataset.type;
    const id = input.dataset.id;
    const produitNom = input.dataset.produit;
    const value = parseFloat(input.value) || 0;

    if (type === 'unique') {
        const obj = calculsHistorique.find(c => c.id === id);
        if (obj) {
            if (input.classList.contains('prix-modifiable')) obj.prixSac = value;
            if (input.classList.contains('dose-modifiable')) obj.dose = value;
            if (input.classList.contains('surface-modifiable')) obj.surface = value;
        }
    }
    if (type === 'melange') {
        const calcul = calculsHistorique.find(c => c.id === id);
        if (calcul) {
            if (input.classList.contains('surface-modifiable')) calcul.surface = value;
            if (produitNom) {
                const prod = calcul.produits.find(p => p.nom === produitNom);
                if (prod) {
                    if (input.classList.contains('prix-modifiable')) prod.prixSac = value;
                    if (input.classList.contains('dose-modifiable')) prod.dose = value;
                }
            }
        }
    }
    rafraichirRecapitulatif();
    afficherBesoinsProduits();
}

// --- Réinitialiser tout le récapitulatif ---
function reinitialiserRecapitulatif() {
    calculsHistorique = [];
    document.getElementById('recap-content-purs').innerHTML = '';
    document.getElementById('recap-content-melanges').innerHTML = '';
    besoinsTotaux = {};
    coutsTotaux = {};
    document.getElementById('besoins-content').innerHTML = '';
    document.getElementById('cout-content').innerHTML = '';
}

// Navigation : affiche la page impression
document.getElementById('nav-impression').addEventListener('click', function(e) {
    e.preventDefault();
    // Masquer les autres sections
    document.getElementById('section-calcul').style.display = 'none';
    document.getElementById('section-recap').style.display = 'none';
    document.getElementById('section-besoins').style.display = 'none';
    document.getElementById('section-impression').style.display = '';
    // Activer le bouton de navigation
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
});

// --- Impression PDF avec découpage multi-page des captures d'écran ---
document.getElementById('creer-pdf').addEventListener('click', function(e) {
    e.preventDefault();

    const form = document.getElementById('form-impression');
    const recapChecked    = form.querySelector('input[name="recap"]').checked;
    const besoinsChecked  = form.querySelector('input[name="besoins"]').checked;
    const coutChecked     = form.querySelector('input[name="cout"]').checked;

    // Collecte des sections à capturer
    const captures = [];
    if (recapChecked) {
        const recapEl = document.querySelector('#recapitulatif-semis') || document.getElementById('section-recap');
        if (recapEl) captures.push(recapEl);
    }
    if (besoinsChecked) {
        const besoinsEl = document.getElementById('besoins-produits');
        if (besoinsEl) captures.push(besoinsEl);
    }
    if (coutChecked) {
        const coutEl = document.getElementById('cout-total');
        if (coutEl) captures.push(coutEl);
    }

    if (captures.length === 0) {
        alert("Sélectionnez au moins une section à imprimer.");
        return;
    }

    // Affiche temporairement les sections parentes masquées
    const shownTemporarily = [];
    function showIfHidden(el) {
        if (!el) return;
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none') {
            shownTemporarily.push(el);
            el.style.display = '';
        }
    }
    showIfHidden(document.getElementById('section-recap'));
    showIfHidden(document.getElementById('section-besoins'));

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let isFirstPage = true;

    // Fonction pour capturer et ajouter
    function captureAndAdd(el, done) {
        // Sauvegarde style original
        const original = {
            width: el.style.width,
            maxWidth: el.style.maxWidth,
            marginLeft: el.style.marginLeft,
            marginRight: el.style.marginRight
        };
        // Force largeur plein écran
        el.style.width = '100vw';
        el.style.maxWidth = '100vw';
        el.style.marginLeft = '0';
        el.style.marginRight = '0';

        setTimeout(function(){
            html2canvas(el, {
                scale: 2,
                useCORS: true,
                windowWidth: el.scrollWidth,
                windowHeight: el.scrollHeight
            }).then(function(canvas){
                // Restaure style
                el.style.width = original.width;
                el.style.maxWidth = original.maxWidth;
                el.style.marginLeft = original.marginLeft;
                el.style.marginRight = original.marginRight;

                // Multi-pages
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const marginX = 10, marginY = 10;
                const imgWidth = pdfWidth - marginX * 2;
                const availableHeight = pdfHeight - marginY * 2;

                let y = 0;
                while (y < canvas.height) {
                    if (!isFirstPage) pdf.addPage();
                    isFirstPage = false;

                    const sHeight = Math.min(canvas.height - y, canvas.width * availableHeight / imgWidth);
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = sHeight;
                    const ctx = pageCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, y, canvas.width, sHeight, 0, 0, canvas.width, sHeight);
                    const imgData = pageCanvas.toDataURL('image/png');
                    const drawHeight = imgWidth * sHeight / canvas.width;

                    pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, drawHeight);
                    y += sHeight;
                }
                done();
            });
        }, 100);
    }

    // Enchaînement séquentiel (pas async !)
    let idx = 0;
    function nextCapture() {
        if (idx < captures.length) {
            captureAndAdd(captures[idx], function() {
                idx++;
                nextCapture();
            });
        } else {
            // Remasque les sections
            shownTemporarily.forEach(function(el){ el.style.display = 'none'; });
            pdf.save('besoins-prairies.pdf');
        }
    }
    nextCapture();
});