document.addEventListener("DOMContentLoaded", function() {
    const creerTablette = document.getElementById("creerTablette");
    let estEnCoursDeSelection = false; // Pour suivre l'état de la sélection

    creerTablette.addEventListener("click", function() {
        const lignes = parseInt(document.getElementById("lignes").value) || 3;
        const colonnes = parseInt(document.getElementById("colonnes").value) || 6;

        creerTabletteChocolat(lignes, colonnes);
    });

    // Gestionnaires d'événements pour la sélection des carrés
    document.addEventListener("mousedown", function(e) {
        if (e.target.classList.contains("carre")) {
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


creerTabletteChocolat(3, 6);

function creerTabletteChocolat(lignes, colonnes) {
    const tablette = document.getElementById("tablette");
    tablette.innerHTML = '';
    tablette.style.gridTemplateColumns = `repeat(${colonnes}, 50px)`;
    tablette.style.gridTemplateRows = `repeat(${lignes}, 50px)`;

    for (let i = 0; i < lignes * colonnes; i++) {
        let carre = document.createElement("div");
        carre.classList.add("carre");
        if(i === 0) carre.classList.add("empoisonne")
        tablette.appendChild(carre);
    }
}
