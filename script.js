const accessKey = 'cwf7n0L1I9usiTBAi_lq1AZttiewhUNI0mOYHdyIHe8';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const personalGallery = document.getElementById('personal-gallery');
const editModal = document.getElementById('edit-modal');
const editTitleInput = document.getElementById('edit-title-input');
const saveEditButton = document.getElementById('save-edit-button');
const closeModal = document.querySelector('.close');

let currentEditId = null; 

// Função para buscar imagens na Unsplash API (GET)
async function searchImages(query) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// Função para exibir resultados da busca
function displaySearchResults(images) {
  searchResults.innerHTML = '';
  images.forEach(image => {
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.innerHTML = `
      <img src="${image.urls.small}" alt="${image.description}" onclick="addToPersonalGallery('${image.urls.small}', '${image.description}')">`;
    searchResults.appendChild(imageCard);
  });
}

// Função para adicionar imagem à galeria pessoal (POST)
function addToPersonalGallery(imageUrl, title) {
  const personalImages = JSON.parse(localStorage.getItem('personalImages')) || [];
  const newImage = { id: Date.now(), url: imageUrl, title };
  personalImages.push(newImage);
  localStorage.setItem('personalImages', JSON.stringify(personalImages));
  displayPersonalGallery();
}

const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
});

let currentPage = 1;
async function loadMoreImages() {
  currentPage++;
  const query = searchInput.value;
  const images = await searchImages(query, currentPage);
  displaySearchResults(images);
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadMoreImages();
  }
});


const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

toggleDarkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function displayPersonalGallery() {
  const personalImages = JSON.parse(localStorage.getItem('personalImages')) || [];
  personalGallery.innerHTML = '';
  personalImages.forEach(image => {
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.innerHTML = `
      <img src="${image.url}" alt="${image.title}" onclick="toggleSelection(${image.id})">
      <p>${image.title}</p>
      <button class="download-button" onclick="downloadImage('${image.url}', '${image.title}')">Baixar Imagem</button>
      <button class="delete-button" onclick="deleteImage(${image.id})">Remover Imagem</button>
    `;
    personalGallery.appendChild(imageCard);
  });
}

function addToPersonalGallery(imageUrl, title) {
    const personalImages = JSON.parse(localStorage.getItem('personalImages')) || [];
    const newImage = { id: Date.now(), url: imageUrl, title };
    personalImages.push(newImage);
    localStorage.setItem('personalImages', JSON.stringify(personalImages));
    displayPersonalGallery();
  

    const feedback = document.createElement('div');
    feedback.textContent = 'Imagem adicionada à galeria!';
    feedback.className = 'feedback-message';
    document.body.appendChild(feedback);
  
    setTimeout(() => {
      feedback.remove();
    }, 2000); 
  }


function showSkeleton() {
    document.getElementById('skeleton-loading').style.display = 'flex';
  }
  
  function hideSkeleton() {
    document.getElementById('skeleton-loading').style.display = 'none';
  }
  

  showSkeleton();
  

  hideSkeleton();


function downloadImage(imageUrl, title) {
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.jpg`; 
      link.click();
      URL.revokeObjectURL(link.href); 
    })
    .catch(error => console.error('Erro ao baixar a imagem:', error));
}

// Função para deletar imagem da galeria pessoal (DELETE)
function deleteImage(id) {
  let personalImages = JSON.parse(localStorage.getItem('personalImages')) || [];
  personalImages = personalImages.filter(image => image.id !== id);
  localStorage.setItem('personalImages', JSON.stringify(personalImages));
  displayPersonalGallery();
}


function toggleSelection(id) {
  const imageCard = document.querySelector(`.image-card img[alt*="${id}"]`).parentElement;
  imageCard.classList.toggle('selected');
}


function openEditModal(id) {
  currentEditId = id;
  const personalImages = JSON.parse(localStorage.getItem('personalImages')) || [];
  const image = personalImages.find(image => image.id === id);
  editTitleInput.value = image.title;
  editModal.style.display = 'flex';
}


function openImageModal(imageUrl) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl;
    modal.style.display = 'flex';
  }
  

  document.querySelector('#image-modal .close').addEventListener('click', () => {
    document.getElementById('image-modal').style.display = 'none';
  });
  

  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => openImageModal(img.src));
  });



function addToFavorites(imageUrl, title) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const newFavorite = { id: Date.now(), url: imageUrl, title };
    favorites.push(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
  }
  

  function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesGallery = document.getElementById('favorites-gallery');
    favoritesGallery.innerHTML = '';
    favorites.forEach(favorite => {
      const imageCard = document.createElement('div');
      imageCard.className = 'image-card';
      imageCard.innerHTML = `
        <img src="${favorite.url}" alt="${favorite.title}">
        <p>${favorite.title}</p>
        <button class="delete-button" onclick="removeFromFavorites(${favorite.id})">Remover</button>
      `;
      favoritesGallery.appendChild(imageCard);
    });
  }

  let currentP = 1;

  function updatePagination() {
    document.getElementById('current-page').textContent = currentPage;
  }

  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentP > 1) {
      currentP--;
      searchImages(searchInput.value, currentP);
      updatePagination();
    }
  });
  
  document.getElementById('next-page').addEventListener('click', () => {
    currentP++;
    searchImages(searchInput.value, currentP);
    updatePagination();
  });


document.querySelectorAll('.rating span').forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-value');
      alert(`Você avaliou com ${rating} estrelas!`);
    });
  });


function shareImage(imageUrl, title) {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: imageUrl,
      });
    } else {
      alert('Compartilhamento não suportado no seu navegador.');
    }
  }


  function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favorite => favorite.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
  }

// Função para salvar a edição do título (PUT)
function saveEdit() {
  const personalImages = JSON.parse(localStorage.getItem('personalImages')) || [];
  const imageIndex = personalImages.findIndex(image => image.id === currentEditId);
  personalImages[imageIndex].title = editTitleInput.value;
  localStorage.setItem('personalImages', JSON.stringify(personalImages));
  editModal.style.display = 'none';
  displayPersonalGallery();
}


searchButton.addEventListener('click', async () => {
  const query = searchInput.value;
  if (query) {
    const images = await searchImages(query);
    displaySearchResults(images);
  }
});

saveEditButton.addEventListener('click', saveEdit);
closeModal.addEventListener('click', () => {
  editModal.style.display = 'none';
});


displayPersonalGallery();