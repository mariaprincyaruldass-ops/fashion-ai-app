// js/app.js

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    feather.replace();
    
    // Initialize State
    AppState.init();

    // Set up globally accessible app methods
    window.app = {
        navigate: navigateTo,
        saveOutfit: saveOutfitHandler,
        deleteOutfit: deleteOutfitHandler,
        improveOutfit: improveOutfitHandler
    };

    // Navigation Events
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            navigateTo(target);
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        // Implement lightweight mobile sidebar toggle logic if needed over custom CSS
    }

    // Header Profile button navigation
    document.getElementById('header-profile-btn').addEventListener('click', () => {
        navigateTo('profile');
    });

    // Init specific views
    initRecommendationForm();
    initQuickGenerator();
    initTrends();
    initProfile();
    initColorModule();
    
    // Default load
    navigateTo('home');
});

function navigateTo(viewId) {
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if(btn.getAttribute('data-target') === viewId) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // Update active view
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewId);
    if(targetView) targetView.classList.add('active');

    // Update Title
    const titleEl = document.getElementById('current-page-title');
    const titles = {
        'home': 'Dashboard',
        'recommendations': 'AI Recommendations',
        'generator': 'Quick Mode',
        'trends': 'Fashion Trends',
        'color': 'Color Intelligence',
        'favorites': 'Your Favorites',
        'profile': 'User Profile'
    };
    if(titleEl) titleEl.innerText = titles[viewId] || 'StyleAI';

    // Reload dynamics for specific views
    if (viewId === 'favorites') {
        renderFavorites();
    }
}

let currentGeneratedOutfits = [];

function initRecommendationForm() {
    const form = document.getElementById('rec-form');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const specs = {
            gender: formData.get('gender'),
            occasion: formData.get('occasion'),
            weather: formData.get('weather'),
            stylePref: formData.get('stylePref')
        };

        // UI Loading State
        document.getElementById('rec-results').classList.add('d-none');
        document.getElementById('rec-loading').classList.remove('d-none');
        
        // Ensure minimum 1 sec loading for UX feel
        setTimeout(() => {
            currentGeneratedOutfits = generateOutfits(specs, 3);
            renderOutfits(currentGeneratedOutfits, 'rec-results');
            document.getElementById('rec-loading').classList.add('d-none');
            document.getElementById('rec-results').classList.remove('d-none');
            feather.replace(); // Refresh newly added icons
        }, 1200);
    });
}

function initQuickGenerator() {
    const form = document.getElementById('quick-form');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const specs = {
            gender: 'Unisex', // Default for quick
            occasion: formData.get('quickOccasion'),
            weather: formData.get('quickWeather'),
            stylePref: 'Casual', // Default fallback
            favColor: formData.get('quickColor')
        };

        // Loading State
        document.getElementById('quick-results').innerHTML = '';
        const loadingBox = document.getElementById('quick-loading');
        loadingBox.classList.remove('d-none');

        setTimeout(() => {
            const singleOutfitArr = generateOutfits(specs, 1);
            // Append color logic simply into the tip for quick mode
            singleOutfitArr[0].tip += ` Looks great with touches of ${specs.favColor}!`;
            
            loadingBox.classList.add('d-none');
            renderOutfits(singleOutfitArr, 'quick-results');
            feather.replace();
        }, 800);
    });
}

function renderOutfits(outfitArray, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    container.innerHTML = '';
    
    outfitArray.forEach(outfit => {
        const isFav = AppState.isFavorite(outfit.id);
        const favIconFill = isFav ? 'currentColor' : 'none';
        
        let paletteHtml = '';
        if(outfit.palette && outfit.palette.colors) {
            paletteHtml = `
                <div class="palette-container" title="Recommended Palette: ${outfit.palette.name}">
                    ${outfit.palette.colors.map(c => `<div class="color-swatch" style="background-color: ${c}"></div>`).join('')}
                </div>
            `;
        }

        const html = `
            <div class="outfit-card" id="card-${outfit.id}">
                <div class="outfit-header">
                    <h4>${outfit.title}</h4>
                    <div class="outfit-actions">
                        <button onclick="window.app.improveOutfit('${outfit.id}')" title="Shuffle/Improve"><i data-feather="refresh-cw"></i></button>
                        <button onclick="window.app.saveOutfit('${outfit.id}', this)" title="Save to Favorites"><i data-feather="heart" fill="${favIconFill}"></i></button>
                    </div>
                </div>
                <div class="outfit-body">
                    <div class="outfit-item">
                        <i data-feather="layers" class="outfit-item-icon"></i>
                        <div><p>Top</p><span>${outfit.top}</span></div>
                    </div>
                    <div class="outfit-item">
                        <i data-feather="scissors" class="outfit-item-icon"></i>
                        <div><p>Bottom</p><span>${outfit.bottom}</span></div>
                    </div>
                    <div class="outfit-item">
                        <i data-feather="navigation" class="outfit-item-icon"></i>
                        <div><p>Footwear</p><span>${outfit.shoe}</span></div>
                    </div>
                    <div class="outfit-item">
                        <i data-feather="anchor" class="outfit-item-icon"></i>
                        <div><p>Accessory</p><span>${outfit.accessory}</span></div>
                    </div>
                    ${paletteHtml}
                    <div class="outfit-item">
                        <i data-feather="info" class="outfit-item-icon"></i>
                        <div><p>Fabrics</p><span>${outfit.fabric}</span></div>
                    </div>
                </div>
                <div class="outfit-footer">
                    <p>💡 ${outfit.tip}</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function initTrends() {
    const container = document.getElementById('trends-container');
    if(!container) return;
    
    trendsData.forEach(trend => {
        const extraClass = trend.colorCss ? trend.colorCss : '';
        const palette = trend.colors.map(c => `<div class="color-swatch" style="background-color: ${c}"></div>`).join('');
        
        const html = `
            <div class="trend-card ${extraClass}">
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 600;">${trend.category}</span>
                <h3 style="margin: 8px 0;">${trend.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">${trend.desc}</p>
                
                <p style="font-size: 0.85rem; margin-bottom: 4px;"><strong>Trending Colors:</strong></p>
                <div class="palette-container" style="margin-top: 4px;">${palette}</div>
                
                <p style="font-size: 0.85rem; margin-top: 12px;"><strong>Fabrics:</strong> ${trend.fabrics}</p>
                
                <div style="margin-top: 16px; padding: 12px; background: var(--accent-light); border-radius: 6px; font-size: 0.85rem; font-style: italic;">
                    ${trend.tip}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function initColorModule() {
    const input = document.getElementById('base-color-picker');
    if(!input) return;

    input.addEventListener('input', (e) => {
        renderColorIntel(e.target.value);
    });
    
    // Initial render
    renderColorIntel(input.value);
}

function renderColorIntel(hexHex) {
    const container = document.getElementById('color-results');
    if(!container) return;
    
    // Simple mock logic for color intelligence based on lightness or just random facts
    let psych = "A strong, versatile color that pairs well with neutrals.";
    let complimentary = "#F3F4F6";
    
    // basic hex math
    const hex = hexHex.replace('#','');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    
    if (b > r && b > g) {
        psych = "Blue represents calm, trust, and intelligence. Perfect for interviews or office wear.";
        complimentary = "#FACC15"; // Yellow/gold
    } else if (r > b && r > g) {
        psych = "Red is bold and energetic. Great as an accent piece or for party wear.";
        complimentary = "#10B981"; // Green
    } else if (g > r && g > b) {
        psych = "Green is associated with nature and tranquility. Works beautifully in streetwear.";
        complimentary = "#EC4899"; // Pink
    } else if (r > 200 && g > 200 && b > 200) {
        psych = "Light neutrals feel exceptionally clean, modern, and high-end.";
        complimentary = "#111827"; // Dark
    } else if (r < 50 && g < 50 && b < 50) {
        psych = "Black/Dark shades are universally sleek, slimming, and powerful.";
        complimentary = "#FFFFFF"; // White
    }
    
    container.innerHTML = `
        <div class="color-card">
            <h4>Psychology of Selected Color</h4>
            <div style="display: flex; align-items: center; gap: 12px; margin: 16px 0;">
                <div class="color-swatch" style="background: ${hexHex}; width: 40px; height: 40px;"></div>
                <p style="font-weight: 500;">${hexHex}</p>
            </div>
            <p style="color: var(--text-muted); font-size: 0.95rem;">${psych}</p>
        </div>
        <div class="color-card">
            <h4>Complementary Accent</h4>
            <div style="display: flex; align-items: center; gap: 12px; margin: 16px 0;">
                <div class="color-swatch" style="background: ${complimentary}; width: 40px; height: 40px;"></div>
                <p style="font-weight: 500;">${complimentary}</p>
            </div>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Pair your base color with this accent for striking contrast.</p>
        </div>
    `;
}

function initProfile() {
    const form = document.getElementById('profile-form');
    if(!form) return;
    
    // Load values
    if(AppState.profile.bodyType) {
        form.elements['bodyType'].value = AppState.profile.bodyType;
    }
    if(AppState.profile.prefColors) {
        form.elements['prefColors'].value = AppState.profile.prefColors;
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        AppState.saveProfile({
            bodyType: form.elements['bodyType'].value,
            prefColors: form.elements['prefColors'].value
        });
        
        const status = document.getElementById('profile-status');
        status.classList.remove('d-none');
        setTimeout(() => {
            status.classList.add('d-none');
        }, 3000);
    });
}

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    if(!container) return;
    
    if (AppState.favorites.length === 0) {
        container.innerHTML = '<p class="empty-state">No favorite outfits saved yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    AppState.favorites.forEach(outfit => {
        let paletteHtml = '';
        if(outfit.palette && outfit.palette.colors) {
            paletteHtml = `
                <div class="palette-container">
                    ${outfit.palette.colors.map(c => `<div class="color-swatch" style="background-color: ${c}"></div>`).join('')}
                </div>
            `;
        }

        const html = `
            <div class="outfit-card">
                <div class="outfit-header">
                    <h4>${outfit.title}</h4>
                    <div class="outfit-actions">
                        <button onclick="window.app.deleteOutfit('${outfit.id}')" title="Remove"><i data-feather="trash-2"></i></button>
                    </div>
                </div>
                <div class="outfit-body">
                    <div class="outfit-item"><i data-feather="layers" class="outfit-item-icon"></i><div><p>Top</p><span>${outfit.top}</span></div></div>
                    <div class="outfit-item"><i data-feather="scissors" class="outfit-item-icon"></i><div><p>Bottom</p><span>${outfit.bottom}</span></div></div>
                    <div class="outfit-item"><i data-feather="navigation" class="outfit-item-icon"></i><div><p>Footwear</p><span>${outfit.shoe}</span></div></div>
                    ${paletteHtml}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    feather.replace();
}

// Global Handlers
function saveOutfitHandler(id, btnElement) {
    // Find outfit in currently generated ones over the UI
    const outfit = currentGeneratedOutfits.find(o => o.id === id) || 
                   [].concat(currentGeneratedOutfits).find(o => o.id === id); // Mock fallback if it was in quick generator
                   
    // If we click from quick mode it might not be in the array if we didn't save quick mode to array. Let's handle gracefully.
    if(outfit) {
        if(AppState.isFavorite(id)) {
            AppState.removeFavorite(id);
            btnElement.querySelector('i').setAttribute('fill', 'none');
            showToast("Removed from favorites");
        } else {
            AppState.saveFavorite(outfit);
            btnElement.querySelector('i').setAttribute('fill', 'currentColor');
            showToast("Saved to favorites!");
        }
    } else {
        // Just for edge cases
        showToast("Cannot save this outfit context.");
    }
}

function deleteOutfitHandler(id) {
    AppState.removeFavorite(id);
    renderFavorites();
    showToast("Removed from favorites");
}

function improveOutfitHandler(id) {
    let outfitObj = currentGeneratedOutfits.find(o => o.id === id);
    if(outfitObj && outfitObj.specs) {
        // Regenerate single
        const newArr = generateOutfits(outfitObj.specs, 1);
        const newObj = newArr[0];
        
        // Update array state
        const idx = currentGeneratedOutfits.findIndex(o => o.id === id);
        currentGeneratedOutfits[idx] = newObj;
        
        // Re-render only that card
        renderOutfits(currentGeneratedOutfits, 'rec-results');
        feather.replace();
        showToast("Outfit Shuffled!");
    }
}

function showToast(message) {
    let toast = document.getElementById('app-toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
