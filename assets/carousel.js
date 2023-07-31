const imagesGallery = document.querySelectorAll(".gallery-item");

const allTags = new Set();
imagesGallery.forEach(image => {
    const tags = image.dataset.galleryTag.split(' ');
    tags.forEach(tag => allTags.add(tag));
});

const filterButtonsContainer = document.querySelector('.filter-buttons-container');
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.dataset.filter = 'all';
filterButtonsContainer.appendChild(allButton);

allTags.forEach(tag => {
    const button = document.createElement('button');
    button.textContent = tag;
    button.dataset.filter = tag;
    filterButtonsContainer.appendChild(button);
});

const filterButtons = document.querySelectorAll('.filter-buttons-container button');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        if (filter === 'all') {
            imagesGallery.forEach(image => image.style.display = 'block');
        } else {
            imagesGallery.forEach(image => {
                const tags = image.dataset.galleryTag.split(' ');
                if (tags.includes(filter)) {
                    image.style.display = 'block';
                } else {
                    image.style.display = 'none';
                }
            });
        }

        const gallery = document.querySelector('.gallery');
        gallery.style.display = 'grid';
        gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gallery.style.gridGap = '10px';
    });
});

const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal-content');
const darkBackground = document.getElementById('dark-background');

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
    // Si l'élément cliqué est la modale (et non son contenu) elle-même en comparant avec l'événement actuel
    if (event.target === modal) {
        // Appelle la fonction closeModal pour la fermer
        closeModal();
    }
});

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;

function showImage(index) {
    modalImg.src = imagesGallery[index].src;
}

prevBtn.addEventListener('click', () => {
    const currentTag = imagesGallery[currentIndex].dataset.galleryTag.split(' ');
    if (currentTag.includes('all')) {
        currentIndex = (currentIndex - 1 + imagesGallery.length) % imagesGallery.length;
    } else {
        let prevIndex = currentIndex - 1;
        while (prevIndex >= 0) {
            const prevTags = imagesGallery[prevIndex].dataset.galleryTag.split(' ');
            if (prevTags.some(tag => currentTag.includes(tag))) {
                currentIndex = prevIndex;
                break;
            }
            prevIndex --;
        }

        if (prevIndex < 0) {
            prevIndex = imagesGallery.length - 1;
            while (prevIndex >= 0) {
                const prevTags = imagesGallery[prevIndex].dataset.galleryTag.split(' ');
                if (prevTags.some(tag => currentTag.includes(tag))) {
                    currentIndex = prevIndex;
                    break;
                }
                prevIndex --;
            }
        }
    }
    showImage(currentIndex);
});

nextBtn.addEventListener('click', () => {
    const currentTag = imagesGallery[currentIndex].dataset.galleryTag.split(' ');
    if (currentTag.includes('all')) {
        currentIndex = (currentIndex + 1) % imagesGallery.length;
    } else {
        let nextIndex = currentIndex + 1;
        while (nextIndex < imagesGallery.length) {
            const nextTags = imagesGallery[nextIndex].dataset.galleryTag.split(' ');
            if (nextTags.some(tag => currentTag.includes(tag))) {
                currentIndex = nextIndex;
                break;
            }
            nextIndex ++;
        }

        if (nextIndex === imagesGallery.length) {
            nextIndex = 0;
            while (nextIndex < imagesGallery.length) {
                const nextTags = imagesGallery[nextIndex].dataset.galleryTag.split(' ');
                if (nextTags.some(tag => currentTag.includes(tag))) {
                    currentIndex = nextIndex;
                    break;
                }
                nextIndex ++;
            }
        }
    }
    showImage(currentIndex);
});
