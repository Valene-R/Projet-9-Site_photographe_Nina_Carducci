/////
// CONSTANTES / VARIABLES
/////

// Récupére les images de la galerie
const imagesGallery = document.querySelectorAll(".gallery-item");
const allTags = getAllTags(imagesGallery);

// Récupére les éléments de la modale
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal-content');

// Récupére les boutons précédent et suivant pour naviguer dans le carrousel
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
let currentFilter = 'all'; // Par défaut, affiche toutes les images


/////
// FONCTIONS
/////

/**
 * Stockage de tous les tags disponibles dans un Set
 * @param {NodeList} imagesGallery - La liste des images de la galerie
 * @returns {Set} - Un Set contenant tous les tags
 */ 
function getAllTags(imagesGallery) {
    const tagsSet = new Set(); // Utilise Set pour éviter les doublons de tags
    imagesGallery.forEach(image => {
        // Récupére le tag directement depuis l'attribut "data-gallery-tag"
        const tag = image.dataset.galleryTag;
        // Ajoute le tag à "tagsSet"
        tagsSet.add(tag); 
    });
    return tagsSet;
}

/**
 * Création des boutons de filtre de la galerie
 * @param {Set} allTags - Un Set contenant tous les tags 
 */
function createFilterButtons(allTags) {
    // Sélectionne le conteneur des boutons de filtre
    const filterButtonsContainer = document.querySelector('.filter-buttons-container');
    
    // Crée un bouton "Tous" pour afficher toutes les images
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.dataset.filter = 'all';
    filterButtonsContainer.appendChild(allButton);

    // Crée un bouton pour chaque tag
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.textContent = tag;
        button.dataset.filter = tag;
        filterButtonsContainer.appendChild(button);
    });

    // Associe les boutons de filtre aux événements de clic
    const filterButtons = document.querySelectorAll('.filter-buttons-container button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Sélectionne le tag et met à jour l'apparence des boutons
            selectTag(button);

            const filter = button.dataset.filter;
            // Filtre les images en fonction du tag sélectionné
            filterImages(filter);

            // Mise à jour du carrousel en fonction du tag sélectionné
            updateCarousel(filter);
        });
    });

    // Sélectionne le bouton "Tous" par défaut au chargement de la page
    const defaultSelectButton = document.querySelector('.filter-buttons-container button[data-filter="all"]');
    selectTag(defaultSelectButton);
}
createFilterButtons(allTags);

/**
 * Sélection du tag et ajout du fond vert jaunâtre aux boutons
 * @param {HTMLElement} button - Le bouton du filtre sélectionné 
 */
function selectTag(button) {
    const filterButtons = document.querySelectorAll('.filter-buttons-container button');
    filterButtons.forEach(btn => {
        if (btn === button) {
            btn.classList.add('selectBtnTag');
        } else {
            btn.classList.remove('selectBtnTag');
        }
    });
}

/**
 * Filtrage des images en fonction du tag sélectionné
 * @param {string} filter - Le tag du filtre sélectionné 
 */
function filterImages(filter) {
    const imagesGallery = document.querySelectorAll(".gallery-item");
    imagesGallery.forEach(image => {
        const tag = image.dataset.galleryTag;
        if (filter === 'all' || tag.includes(filter)) {
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }
    });

    // Affiche la galerie avec une grille de 3 colonnes
    const gallery = document.querySelector('.gallery');
    gallery.style.display = 'grid';
    gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
    gallery.style.gridGap = '10px';
}

/**
 * Mise à jour du filtre actuel et du carrousel en fonction du tag sélectionné
 * @param {string} filter - Le tag du filtre sélectionné
 */
function updateCarousel(filter) {
    currentFilter = filter;
    showImage(currentIndex);
}

/**
 * Ouverture de la modale
 * @param {number} index - Index de l'image en cours
 */
function openModal(index) {
    const modal = document.querySelector('.modal');
    const darkBackground = document.getElementById('dark-background');

    modal.style.display = 'block';
    // Affiche l'arrière-plan sombre
    darkBackground.style.display = 'block';
    currentIndex = index;
    showImage(currentIndex);

    // Attendre un court délai pour activer l'animation de descente en ajoutant la classe .show
    setTimeout(() => {
        modal.classList.add('show');
    }, 50);// Durée de l'animation de descente (0.05s)

    // Empêche le défilement du body lorsque la modale est ouverte
    document.body.style.overflow = 'hidden';
}

/**
 * Fermeture de la modale
 */
function closeModal() {
    const modal = document.querySelector('.modal');
    const darkBackground = document.getElementById('dark-background');

    // Supprime la classe .show pour activer l'animation de montée
    modal.classList.remove('show');

    // Attendre que l'animation de montée se termine, puis masque la modale et l'arrière-plan sombre
    setTimeout(() => {
        modal.style.display = 'none';
        // Masque l'arrière-plan sombre
        darkBackground.style.display = 'none';

        // Rétablit le défilement du body lorsque la modale est fermée
        document.body.style.overflow = 'auto';
    }, 300);// Durée de l'animation de montée (0.3s)
}

/**
 * Affichage de l'image correspondant à l'index
 * @param {number} index - Index de l'image à afficher
 */
function showImage(index) {
    const image = imagesGallery[index];
    const tag = image.dataset.galleryTag;

    // Vérifie si l'image appartient au filtre actuel ou si le filtre est 'all'
    if (tag.includes(currentFilter) || currentFilter === 'all') {
        modalImg.src = image.src;
        currentIndex = index;
    }
}


/////
// EVENT LISTENERS
/////

// Écouteur du clic pour les images de la galerie
imagesGallery.forEach((image, index) => {
    image.addEventListener('click', () => {
        openModal(index);
    });
});

// Écouteur du clic pour la modale
modal.addEventListener('click', (event) => {
    // Si l'élément cliqué est la modale (et non son contenu) en comparant avec l'événement actuel
    if (event.target === modal) {
        // Appelle la fonction closeModal pour la fermer
        closeModal();
    }
});

// Écouteur du clic pour le bouton précédent
prevBtn.addEventListener('click', () => {
    // Utilisation du modulo % pour une navigation circulaire des images de la galerie
    // Évite les dépassements d'index et assure une boucle sans fin
    let prevIndex = (currentIndex - 1 + imagesGallery.length) % imagesGallery.length;
    while (prevIndex !== currentIndex) {
        const image = imagesGallery[prevIndex];
        const tag = image.dataset.galleryTag;
        if (tag.includes(currentFilter) || currentFilter === 'all') {
            showImage(prevIndex);
            break;
        }
        prevIndex = (prevIndex - 1 + imagesGallery.length) % imagesGallery.length;
    }
});

// Écouteur du clic pour le bouton suivant
nextBtn.addEventListener('click', () => {
    let nextIndex = (currentIndex + 1) % imagesGallery.length;
    while (nextIndex !== currentIndex) {
        const image = imagesGallery[nextIndex];
        const tag = image.dataset.galleryTag;
        if (tag.includes(currentFilter) || currentFilter === 'all') {
            showImage(nextIndex);
            break;
        }
        nextIndex = (nextIndex + 1) % imagesGallery.length;
    }
});

