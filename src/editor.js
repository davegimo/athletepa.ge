// Seleziona gli elementi dell'editor
const nameInput = document.getElementById('name');
const bioInput = document.getElementById('bio');
const bgColorInput = document.getElementById('bgColor');
const textColorInput = document.getElementById('textColor');
const fontFamilySelect = document.getElementById('fontFamily');
const profileImageInput = document.getElementById('profile-image');
const profilePreview = document.getElementById('profile-preview');
const layoutInputs = document.querySelectorAll('input[name="layout"]');
const socialInputs = document.querySelectorAll('input[placeholder*="Instagram"], input[placeholder*="Twitter"], input[placeholder*="LinkedIn"], input[placeholder*="Sito Web"]');

// Seleziona gli elementi dell'anteprima
const previewContent = document.getElementById('preview-content');
const previewName = document.getElementById('preview-name');
const previewBio = document.getElementById('preview-bio');
const previewLinks = document.getElementById('preview-links');
const previewProfileImage = document.getElementById('preview-profile-image');

// Seleziona i pulsanti di azione
const exportBtn = document.getElementById('export-btn');
const shareBtn = document.getElementById('share-btn');
const resetBtn = document.getElementById('reset-btn');

// Seleziona gli elementi del modal di condivisione
const shareModal = document.getElementById('share-modal');
const shareLink = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

// Variabile per memorizzare l'URL dell'immagine caricata
let uploadedImageUrl = null;

// Funzione per generare un ID univoco per la pagina
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Funzione per gestire il caricamento dell'immagine
profileImageInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      uploadedImageUrl = e.target.result;
      
      // Aggiorna l'anteprima nell'editor
      profilePreview.innerHTML = `<img src="${uploadedImageUrl}" class="w-full h-full object-cover" alt="Immagine profilo">`;
      
      // Aggiorna l'anteprima nello smartphone
      previewProfileImage.innerHTML = `<img src="${uploadedImageUrl}" class="w-full h-full object-cover" alt="Immagine profilo">`;
    };
    
    reader.readAsDataURL(file);
  }
});

// Funzione per ottenere il layout selezionato
function getSelectedLayout() {
  let selectedLayout = 'centered'; // Default
  
  layoutInputs.forEach(input => {
    if (input.checked) {
      selectedLayout = input.value;
    }
  });
  
  return selectedLayout;
}

// Funzione per applicare il layout all'anteprima
function applyLayout(layout) {
  // Rimuovi tutte le classi di allineamento
  previewContent.classList.remove('items-center', 'items-start', 'items-end');
  previewBio.classList.remove('text-center', 'text-left', 'text-right');
  
  // Applica le classi in base al layout selezionato
  switch(layout) {
    case 'centered':
      previewContent.classList.add('items-center');
      previewBio.classList.add('text-center');
      break;
    case 'left':
      previewContent.classList.add('items-start');
      previewBio.classList.add('text-left');
      break;
    case 'right':
      previewContent.classList.add('items-end');
      previewBio.classList.add('text-right');
      break;
  }
}

// Funzione per aggiornare l'anteprima
function updatePreview() {
  // Aggiorna nome
  previewName.textContent = nameInput.value || 'Il tuo nome';
  
  // Aggiorna bio
  previewBio.textContent = bioInput.value || 'La tua bio apparirà qui';
  
  // Aggiorna colori
  previewContent.style.backgroundColor = bgColorInput.value;
  previewContent.style.color = textColorInput.value;
  
  // Aggiorna font
  previewContent.style.fontFamily = fontFamilySelect.value;
  
  // Aggiorna layout
  applyLayout(getSelectedLayout());
  
  // Aggiorna link social
  previewLinks.innerHTML = '';
  
  socialInputs.forEach(input => {
    if (input.value.trim() !== '') {
      const link = document.createElement('a');
      link.href = input.value;
      link.target = '_blank';
      link.className = 'block py-2 px-4 bg-gray-800 text-white rounded-lg mb-2 text-center hover:bg-gray-700 transition-colors';
      
      // Determina il tipo di social
      if (input.placeholder.includes('Instagram')) {
        link.textContent = '📸 Instagram';
      } else if (input.placeholder.includes('Twitter')) {
        link.textContent = '🐦 Twitter';
      } else if (input.placeholder.includes('LinkedIn')) {
        link.textContent = '💼 LinkedIn';
      } else if (input.placeholder.includes('Sito Web')) {
        link.textContent = '🔗 Sito Web';
      }
      
      previewLinks.appendChild(link);
    }
  });
  
  // Salva lo stato corrente nel localStorage
  saveCurrentState();
}

// Funzione per salvare lo stato corrente nel localStorage
function saveCurrentState() {
  const state = {
    name: nameInput.value,
    bio: bioInput.value,
    bgColor: bgColorInput.value,
    textColor: textColorInput.value,
    fontFamily: fontFamilySelect.value,
    layout: getSelectedLayout(),
    profileImage: uploadedImageUrl,
    socialLinks: Array.from(socialInputs).map(input => input.value)
  };
  
  localStorage.setItem('editorState', JSON.stringify(state));
}

// Funzione per caricare lo stato dal localStorage
function loadSavedState() {
  const savedState = localStorage.getItem('editorState');
  
  if (savedState) {
    const state = JSON.parse(savedState);
    
    nameInput.value = state.name || '';
    bioInput.value = state.bio || '';
    bgColorInput.value = state.bgColor || '#ffffff';
    textColorInput.value = state.textColor || '#000000';
    fontFamilySelect.value = state.fontFamily || 'sans-serif';
    
    // Imposta il layout
    const layoutInput = document.getElementById(`layout-${state.layout}`);
    if (layoutInput) {
      layoutInput.checked = true;
    }
    
    // Imposta l'immagine del profilo
    if (state.profileImage) {
      uploadedImageUrl = state.profileImage;
      profilePreview.innerHTML = `<img src="${uploadedImageUrl}" class="w-full h-full object-cover" alt="Immagine profilo">`;
      previewProfileImage.innerHTML = `<img src="${uploadedImageUrl}" class="w-full h-full object-cover" alt="Immagine profilo">`;
    }
    
    // Imposta i link social
    if (state.socialLinks && state.socialLinks.length === socialInputs.length) {
      Array.from(socialInputs).forEach((input, index) => {
        input.value = state.socialLinks[index] || '';
      });
    }
    
    // Aggiorna l'anteprima
    updatePreview();
  }
}

// Funzione per esportare la pagina
function exportPage() {
  // Crea un oggetto con tutti i dati della pagina
  const pageData = {
    name: nameInput.value,
    bio: bioInput.value,
    bgColor: bgColorInput.value,
    textColor: textColorInput.value,
    fontFamily: fontFamilySelect.value,
    layout: getSelectedLayout(),
    profileImage: uploadedImageUrl,
    socialLinks: Array.from(socialInputs).map((input, index) => {
      return {
        type: ['Instagram', 'Twitter', 'LinkedIn', 'Website'][index],
        url: input.value
      };
    }).filter(link => link.url.trim() !== '')
  };
  
  // Converti l'oggetto in una stringa JSON
  const jsonData = JSON.stringify(pageData, null, 2);
  
  // Crea un blob con i dati JSON
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Crea un URL per il blob
  const url = URL.createObjectURL(blob);
  
  // Crea un elemento <a> per scaricare il file
  const a = document.createElement('a');
  a.href = url;
  a.download = `pagina-personale-${Date.now()}.json`;
  
  // Aggiungi l'elemento al DOM e simula un click
  document.body.appendChild(a);
  a.click();
  
  // Rimuovi l'elemento e revoca l'URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Mostra un messaggio di conferma
  alert('Pagina esportata con successo!');
}

// Funzione per mostrare il modal di condivisione
function showShareModal() {
  // Genera un ID univoco per la pagina
  const pageId = generateUniqueId();
  
  // Imposta il link di condivisione
  shareLink.value = `https://athletepa.ge/p/${pageId}`;
  
  // Mostra il modal
  shareModal.classList.remove('hidden');
}

// Funzione per copiare il link negli appunti
function copyLinkToClipboard() {
  shareLink.select();
  document.execCommand('copy');
  
  // Cambia temporaneamente il testo del pulsante
  const originalText = copyLinkBtn.textContent;
  copyLinkBtn.textContent = 'Copiato!';
  
  setTimeout(() => {
    copyLinkBtn.textContent = originalText;
  }, 2000);
}

// Funzione per chiudere il modal
function closeModal() {
  shareModal.classList.add('hidden');
}

// Funzione per reimpostare l'editor
function resetEditor() {
  if (confirm('Sei sicuro di voler reimpostare l\'editor? Tutti i dati inseriti andranno persi.')) {
    // Reimposta tutti i campi
    nameInput.value = '';
    bioInput.value = '';
    bgColorInput.value = '#ffffff';
    textColorInput.value = '#000000';
    fontFamilySelect.value = 'sans-serif';
    
    // Reimposta il layout
    document.getElementById('layout-centered').checked = true;
    
    // Reimposta l'immagine del profilo
    uploadedImageUrl = null;
    profilePreview.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    `;
    previewProfileImage.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    `;
    
    // Reimposta i link social
    socialInputs.forEach(input => {
      input.value = '';
    });
    
    // Aggiorna l'anteprima
    updatePreview();
    
    // Rimuovi lo stato salvato
    localStorage.removeItem('editorState');
  }
}

// Aggiungi event listener agli input
nameInput.addEventListener('input', updatePreview);
bioInput.addEventListener('input', updatePreview);
bgColorInput.addEventListener('input', updatePreview);
textColorInput.addEventListener('input', updatePreview);
fontFamilySelect.addEventListener('change', updatePreview);

// Aggiungi event listener ai radio button del layout
layoutInputs.forEach(input => {
  input.addEventListener('change', updatePreview);
});

socialInputs.forEach(input => {
  input.addEventListener('input', updatePreview);
});

// Aggiungi event listener ai pulsanti di azione
exportBtn.addEventListener('click', exportPage);
shareBtn.addEventListener('click', showShareModal);
resetBtn.addEventListener('click', resetEditor);

// Aggiungi event listener agli elementi del modal
copyLinkBtn.addEventListener('click', copyLinkToClipboard);
closeModalBtn.addEventListener('click', closeModal);

// Chiudi il modal quando si fa clic all'esterno
shareModal.addEventListener('click', function(event) {
  if (event.target === shareModal) {
    closeModal();
  }
});

// Carica lo stato salvato al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
  loadSavedState();
}); 