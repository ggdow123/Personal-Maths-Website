document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bioEditor = document.getElementById('bioEditor');
    const saveBioBtn = document.getElementById('saveBio');
    const resetBioBtn = document.getElementById('resetBio');
    const bioPreview = document.getElementById('bioPreview');
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const imageGallery = document.getElementById('imageGallery');
    const clearImagesBtn = document.getElementById('clearImages');
    
    // Load saved biography from localStorage
    const savedBio = localStorage.getItem('personalBio');
    if (savedBio) {
        bioEditor.value = savedBio;
        updateBioPreview();
    }
    
    // Load saved images from localStorage
    loadSavedImages();
    
    // Save biography
    saveBioBtn.addEventListener('click', function() {
        const bioText = bioEditor.value.trim();
        if (bioText) {
            localStorage.setItem('personalBio', bioText);
            updateBioPreview();
            showMessage('Biography saved successfully!', 'success');
        } else {
            showMessage('Please write something in the biography editor.', 'warning');
        }
    });
    
    // Reset biography
    resetBioBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset your biography? This cannot be undone.')) {
            bioEditor.value = '';
            localStorage.removeItem('personalBio');
            bioPreview.innerHTML = '<p>Your biography will appear here...</p>';
            showMessage('Biography reset.', 'info');
        }
    });
    
    // Update preview in real-time as user types
    bioEditor.addEventListener('input', function() {
        updateBioPreview();
    });
    
    // Image upload handling
    uploadArea.addEventListener('click', () => imageUpload.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#e8f4fc';
        uploadArea.style.borderColor = '#2980b9';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
        uploadArea.style.borderColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        uploadArea.style.borderColor = '';
        
        if (e.dataTransfer.files.length) {
            handleImageUpload(e.dataTransfer.files);
        }
    });
    
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageUpload(e.target.files);
            e.target.value = '';
        }
    });
    
    // Clear all images
    clearImagesBtn.addEventListener('click', function() {
        if (imageGallery.children.length > 1 && 
            confirm('Are you sure you want to delete all images? This cannot be undone.')) {
            localStorage.removeItem('savedImages');
            imageGallery.innerHTML = '<p class="placeholder">No images uploaded yet.</p>';
            showMessage('All images cleared.', 'info');
        }
    });
    
    // Functions
    function updateBioPreview() {
        const text = bioEditor.value.trim();
        if (text) {
            // Convert line breaks to paragraphs for better formatting
            const formattedText = text.split('\n')
                .filter(para => para.trim())
                .map(para => `<p>${para}</p>`)
                .join('');
            bioPreview.innerHTML = formattedText;
        } else {
            bioPreview.innerHTML = '<p>Your biography will appear here...</p>';
        }
    }
    
    function handleImageUpload(files) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        
        Array.from(files).forEach(file => {
            if (!validTypes.includes(file.type)) {
                showMessage(`Skipped "${file.name}" - only JPG, PNG, GIF, and WebP images are allowed.`, 'warning');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showMessage(`Skipped "${file.name}" - file size must be under 5MB.`, 'warning');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                saveImageToStorage(e.target.result);
                addImageToGallery(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
    
    function saveImageToStorage(imageData) {
        let savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        savedImages.push(imageData);
        
        // Keep only last 20 images to prevent storage issues
        if (savedImages.length > 20) {
            savedImages = savedImages.slice(savedImages.length - 20);
        }
        
        localStorage.setItem('savedImages', JSON.stringify(savedImages));
    }
    
    function loadSavedImages() {
        const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        
        if (savedImages.length) {
            imageGallery.innerHTML = '';
            savedImages.forEach(imageData => {
                addImageToGallery(imageData);
            });
        }
    }
    
    function addImageToGallery(imageData) {
        // Remove placeholder if present
        const placeholder = imageGallery.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = 'Uploaded image';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '10px';
        deleteBtn.style.right = '10px';
        deleteBtn.style.padding = '8px';
        deleteBtn.style.fontSize = '0.8rem';
        
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Delete this image?')) {
                removeImageFromStorage(imageData);
                imageItem.remove();
                
                // Show placeholder if gallery is empty
                if (imageGallery.children.length === 0) {
                    imageGallery.innerHTML = '<p class="placeholder">No images uploaded yet.</p>';
                }
                
                showMessage('Image deleted.', 'info');
            }
        });
        
        imageItem.appendChild(img);
        imageItem.appendChild(deleteBtn);
        imageGallery.appendChild(imageItem);
    }
    
    function removeImageFromStorage(imageToRemove) {
        let savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        savedImages = savedImages.filter(img => img !== imageToRemove);
        localStorage.setItem('savedImages', JSON.stringify(savedImages));
    }
    
    function showMessage(text, type) {
        // Remove any existing message
        const existingMsg = document.querySelector('.message-toast');
        if (existingMsg) existingMsg.remove();
        
        const message = document.createElement('div');
        message.className = `message-toast ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        
        switch(type) {
            case 'success': message.style.background = '#2ecc71'; break;
            case 'warning': message.style.background = '#f39c12'; break;
            case 'info': message.style.background = '#3498db'; break;
            default: message.style.background = '#34495e';
        }
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    // Add CSS animations for messages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
