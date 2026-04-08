// js/state.js
// Handles LocalStorage saving and loading for favorites and profiles

window.AppState = {
    favorites: [],
    profile: {
        bodyType: 'Average',
        prefColors: ''
    },

    init() {
        const savedFavs = localStorage.getItem('styleai_favorites');
        if (savedFavs) {
            try {
                this.favorites = JSON.parse(savedFavs);
            } catch(e) {
                console.error("Error parsing favorites", e);
            }
        }

        const savedProfile = localStorage.getItem('styleai_profile');
        if (savedProfile) {
            try {
                this.profile = JSON.parse(savedProfile);
            } catch(e) {
               console.error("Error parsing profile", e);
            }
        }
    },

    saveFavorite(outfit) {
        if (!this.favorites.find(f => f.id === outfit.id)) {
            this.favorites.unshift(outfit); // Add to beginning
            localStorage.setItem('styleai_favorites', JSON.stringify(this.favorites));
            return true;
        }
        return false;
    },

    removeFavorite(id) {
        this.favorites = this.favorites.filter(f => f.id !== id);
        localStorage.setItem('styleai_favorites', JSON.stringify(this.favorites));
    },

    isFavorite(id) {
        return this.favorites.some(f => f.id === id);
    },

    saveProfile(profileData) {
        this.profile = { ...this.profile, ...profileData };
        localStorage.setItem('styleai_profile', JSON.stringify(this.profile));
    }
};
