document.addEventListener("DOMContentLoaded", function() {
    const creerTablette = document.getElementById("creerTablette");
    let estEnCoursDeSelection = false; // Pour suivre l'état de la sélection
    let empoisonneDeplacable = true;

    creerTablette.addEventListener("click", function() {
        const lignes = parseInt(document.getElementById("lignes").value) || 3;
        const colonnes = parseInt(document.getElementById("colonnes").value) || 6;

        creerTabletteChocolat(lignes, colonnes);
    });

    const carreEmpoisonne = document.getElementById("carre-empoisonne");
    carreEmpoisonne.addEventListener("click", function () {
        if (empoisonneDeplacable) {
            deplacerEmpoisonne();
        }
    });

    // Gestionnaires d'événements pour la sélection des carrés
    document.addEventListener("mousedown", function(e) {
        if (e.target.classList.contains("carre") && !e.target.classList.contains("empoisonne")){
            estEnCoursDeSelection = true;
            e.target.classList.toggle("selectionne");
        }
    });

    document.addEventListener("mouseup", function() {
        estEnCoursDeSelection = false;
    });

    document.addEventListener("mousemove", function(e) {
        if (estEnCoursDeSelection && e.target.classList.contains("carre")) {
            e.target.classList.add("selectionne");
        }
    });
});

let l = 3, c = 6;

creerTabletteChocolat(l, c);

const elButton = document.querySelector('.chocolate-button');

elButton.addEventListener('mousedown', (event) => {
  if (!elButton.matches(':focus')) { 
    elButton.style.setProperty('--x', event.offsetX);
    elButton.style.setProperty('--y', event.offsetY);
  }
});

function creerTabletteChocolat(lignes, colonnes) {
    l = lignes;
    c = colonnes;
    const tablette = document.getElementById("tablette");
    tablette.innerHTML = '';
    tablette.style.gridTemplateColumns = `repeat(${colonnes}, 50px)`;
    tablette.style.gridTemplateRows = `repeat(${lignes}, 50px)`;

    for (let ligne = 0; ligne < lignes; ligne++) {
        for (let colonne = 0; colonne < colonnes; colonne++) {
            let carre = document.createElement("div");
            carre.classList.add("carre");
            carre.setAttribute("data-ligne", ligne);
            carre.setAttribute("data-colonne", colonne);
            if (ligne === 0 && colonne === 0) {
                carre.classList.add("empoisonne");
            }
            tablette.appendChild(carre);
        }
    }
}

function deplacerEmpoisonne() {
    const tablette = document.getElementById("tablette");

    const ancienEmpoisonne = document.querySelector(".carre.empoisonne");
    if (ancienEmpoisonne) {
        ancienEmpoisonne.classList.remove("empoisonne");
    }

    const ligneAleatoire = Math.floor(Math.random() * l);
    const colonneAleatoire = Math.floor(Math.random() * c);

    const nouveauEmpoisonne = document.querySelector(`.carre[data-ligne="${ligneAleatoire}"][data-colonne="${colonneAleatoire}"]`);
    if (nouveauEmpoisonne) {
        nouveauEmpoisonne.classList.add("empoisonne");
    }
}

function mangerCarrés() {
    const tablette = document.getElementById("tablette");
    const carresSelectionnes = Array.from(document.querySelectorAll(".carre.selectionne"));
    const button = document.querySelector(".chocolate-button");

    if (carresSelectionnes.length === 0) {
        alert("Aucun carré sélectionné !");
        return;
    }
    
    // Prendre le max de data-ligne et data-colonne pour déterminer le nombre de lignes et de colonnes
    const nbLignes = Math.max(...Array.from(carresSelectionnes, carre => parseInt(carre.getAttribute("data-ligne")))) + 1;
    const nbColonnes = Math.max(...Array.from(carresSelectionnes, carre => parseInt(carre.getAttribute("data-colonne")))) + 1;


    // Vérifie si la sélection est valide
    if (!estSelectionValide(carresSelectionnes, nbLignes, nbColonnes)) {
        alert("La sélection doit être une ligne ou une colonne complète aux extrémités !");
        return;
    }

    // Supprimer la classe "selectionne" et "carré" des carrés sélectionnés et ajouter la classe "carreDisabled"
    carresSelectionnes.forEach(carre => {
        carre.classList.remove("carre", "selectionne");
        carre.classList.add("carreDisabled");
    });

    button.classList.add("chocolate-button-animate");
    setTimeout(() => {
        button.classList.remove("chocolate-button-animate");
    }, 300);


    empoisonneDeplacable = false;
}

function estSelectionValide(carresSelectionnes, nbLignes, nbColonnes) {
    if (carresSelectionnes.some(carre => carre.classList.contains("empoisonne"))) {
        return false; // La sélection contient le carré empoisonné
    }

    const lignesSelectionnees = carresSelectionnes.map(carre => parseInt(carre.getAttribute("data-ligne")));
    const colonnesSelectionnees = carresSelectionnes.map(carre => parseInt(carre.getAttribute("data-colonne")));

    console.log("lignesSelectionnees : ", lignesSelectionnees);
    console.log("colonnesSelectionnees : ", colonnesSelectionnees);

    // Vérifier si la sélection est une ligne ou une colonne complète
    const uniqueLignes = new Set(lignesSelectionnees);
    const uniqueColonnes = new Set(colonnesSelectionnees);
    const estUneLigne = uniqueLignes.size === 1 && carresSelectionnes.length === nbColonnes;
    const estUneColonne = uniqueColonnes.size === 1 && carresSelectionnes.length === nbLignes;

    if (!estUneLigne && !estUneColonne) {
        return false; // Ni une ligne ni une colonne complète
    }

    // Vérifier si la ligne/colonne est aux extrémités
    const ligneOuColonne = estUneLigne ? lignesSelectionnees[0] : colonnesSelectionnees[0];
    const estAuxExtremites = ligneOuColonne === 0 || ligneOuColonne === (estUneLigne ? nbLignes - 1 : nbColonnes - 1);

    return estAuxExtremites;
}
