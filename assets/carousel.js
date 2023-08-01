// Récupére toutes les images de la galerie
const imagesGallery = document.querySelectorAll(".gallery-item");

// Stocke tous les tags disponibles
const allTags = new Set(); // Utilise Set pour éviter les doublons de tags
imagesGallery.forEach(image => {
    // Récupére le tag directement depuis l'attribut "data-gallery-tag"
    const tag = image.dataset.galleryTag;
    // Ajoute le tag à "allTags"
    allTags.add(tag);
});

// Récupére les boutons de filtre de la galerie
const filterButtonsContainer = document.querySelector('.filter-buttons-container');

// Crée un bouton "Tous" pour afficher toutes les images
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.dataset.filter = 'all';
filterButtonsContainer.appendChild(allButton);

// Crée des boutons pour chaque tag
allTags.forEach(tag => {
    const button = document.createElement('button');
    button.textContent = tag;
    button.dataset.filter = tag;
    filterButtonsContainer.appendChild(button);
});

// Fonction pour sélectionner le tag et ajouter le fond vert aux boutons
function selectTag(button) {
    filterButtons.forEach(btn => {
        if (btn === button) {
            btn.classList.add('selectBtnTag');
        } else {
            btn.classList.remove('selectBtnTag');
        }
    });
}

// Sélectionne tous les boutons de filtre
const filterButtons = document.querySelectorAll('.filter-buttons-container button');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectTag(button);

        // Récupére le filtre sélectionné
        const filter = button.dataset.filter;

        // Filtre les images en fonction du filtre sélectionné
        if (filter === 'all') {
            imagesGallery.forEach(image => image.style.display = 'block');
        } else {
            imagesGallery.forEach(image => {
                const tag = image.dataset.galleryTag;
                if (tag.includes(filter)) {
                    image.style.display = 'block';
                } else {
                    image.style.display = 'none';
                }
            });
        }

        // Affiche la galerie avec une gille de 3 colonnes
        const gallery = document.querySelector('.gallery');
        gallery.style.display = 'grid';
        gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gallery.style.gridGap = '10px';

        // Mise à jour du carrousel en fonction du tag sélectionné
        updateCarousel(filter);
    });
});

// Fonction pour mettre à jour le filtre et le carrousel en fonction du tag sélectionné
let currentFilter = 'all'; // Par défaut, affiche toutes les images
function updateCarousel(filter) {
    currentFilter = filter;
    showImage(currentIndex);
}

// Sélectionne le bouton "Tous" par défaut au chargement de la page
const defaultSelectButton = document.querySelector('.filter-buttons-container button[data-filter="all"]');
selectTag(defaultSelectButton);

// Récupére les éléments de la modale
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal-content');
const darkBackground = document.getElementById('dark-background');

// Fonction pour ouvrir la modale avec l'image correspondant à l'index 
function openModal(index) {
    modal.style.display = 'block';
    darkBackground.style.display = 'block';
    currentIndex = index;
    showImage(currentIndex);

    // Attendre un court délai pour activer l'animation de descente en ajoutant la classe .show
    setTimeout(() => {
        modal.classList.add('show');
    }, 50); // Durée de l'animation de descente (0.05s)

    // Empêche le défilement du body lorsque la modale est ouverte
    document.body.style.overflow = 'hidden';
}

// fonction pour fermer la modale
function closeModal() {
    // Supprime la classe .show pour activer l'animation de montée
    modal.classList.remove('show');

    // Attendre que l'animation de montée se termine, puis masque la modale et l'arrière-plan sombre
    setTimeout(() => {
        modal.style.display = 'none';
        // Masque l'arrière-plan sombre
        darkBackground.style.display = 'none';

        // Rétablit le défilement du body lorsque la modale est fermée
        document.body.style.overflow = 'auto';

    }, 300); // Durée de l'animation de montée (0.3s)
}

// Lorsque l'une des images de la galerie est cliquée, ouvre la modale en fonction de l'index de l'image
imagesGallery.forEach((image, index) => {
    image.addEventListener('click', () => {
        openModal(index);
    });
});

// Lorsque la modale est cliquée
modal.addEventListener('click', (event) => {
    // Si l'élément cliqué est la modale (et non son contenu) en comparant avec l'événement actuel
    if (event.target === modal) {
        // Appelle la fonction closeModal pour la fermer
        closeModal();
    }
});

// Récupére les boutons précédent et suivant pour naviguer dans le carrousel
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;

// Fonction pour afficher l'image correspondant à l'index 
function showImage(index) {
    const image = imagesGallery[index];
    const tag = image.dataset.galleryTag;

    // Vérifie si l'image appartient au filtre actuel ou si le filtre est 'all'
    if (tag.includes(currentFilter) || currentFilter === 'all') {
        modalImg.src = image.src;
        currentIndex = index;
    }
}

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