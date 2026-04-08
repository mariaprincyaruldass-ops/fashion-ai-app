// js/data.js
// Rule-based engine data for Outfit Recommendations

window.fashionRules = {
    // Top items mapping
    tops: {
        'Casual': ['Graphic Tee', 'Oversized Button-down', 'Polo Shirt', 'Basic Crewneck', 'Hoodie'],
        'Formal': ['Crisp White Dress Shirt', 'Silk Blouse', 'Tailored Blazer', 'Turtleneck Sweater'],
        'Party': ['Sequin Top', 'Satin Shirt', 'Velvet Blazer', 'Statement Crop Top'],
        'Office': ['Oxford Shirt', 'Modest Blouse', 'Cardigan', 'V-Neck Sweater'],
        'Wedding': ['Tuxedo Shirt', 'Embellished Blouse', 'Three-Piece Suit Top']
    },
    // Bottom items mapping
    bottoms: {
        'Casual': ['Light Wash Denim', 'Cargo Pants', 'Chinos', 'Tailored Shorts'],
        'Formal': ['Suit Trousers', 'Pencil Skirt', 'Pleated Dress Pants'],
        'Party': ['Leather Pants', 'Flared Trousers', 'Mini Skirt', 'Dark Denim'],
        'Office': ['Slacks', 'A-Line Skirt', 'Khakis'],
        'Wedding': ['Formal Trousers', 'Maxi Skirt', 'Dress Pants']
    },
    // Footwear mapping
    footwear: {
        'Casual': ['White Sneakers', 'Chunky Trainers', 'Canvas Shoes', 'Slides'],
        'Formal': ['Oxford Shoes', 'Stilettos', 'Loafers', 'Kitten Heels'],
        'Party': ['Ankle Boots', 'Strappy Heels', 'Designer Sneakers', 'Chelsea Boots'],
        'Office': ['Derby Shoes', 'Block Heels', 'Ballet Flats', 'Smart Loafers'],
        'Wedding': ['Patent Leather Oxfords', 'Elegant Pumps', 'Strappy Sandals']
    },
    // Accessories based on style
    accessories: {
        'Minimal': ['Thin Silver Chain', 'Classic Watch', 'Stud Earrings', 'Simple Tote Bag'],
        'Streetwear': ['Crossbody Bag', 'Bucket Hat', 'Chunky Chain', 'Statement Sunglasses'],
        'Elegant': ['Pearl Necklace', 'Leather Briefcase', 'Silk Scarf', 'Gold Cuff'],
        'Sporty': ['Baseball Cap', 'Sports Watch', 'Backpack', 'Sweatband']
    },
    // Weather adjustments (adds phrasing/layering)
    weatherLayers: {
        'Hot': { material: 'Linen, Cotton, Breathable blends', tip: 'Keep things light and unlayered. Opt for breathable fabrics.' },
        'Cold': { material: 'Wool, Cashmere, Heavy Denim, Fleece', tip: 'Layer up! Add a tailored overcoat, scarf or a puffer jacket to base items.' },
        'Mild': { material: 'Denim, Light Wool, Cotton', tip: 'Perfect weather for a light jacket or an open over-shirt.' },
        'Rainy': { material: 'Water-resistant synthetics, Treated leather', tip: 'Include a stylish trench coat or water-resistant windbreaker. Avoid suede shoes.' }
    },
    // Color Palettes
    palettes: [
        { name: 'Monochrome Midnight', colors: ['#000000', '#1A1A1A', '#333333', '#FFFFFF'], vibes: ['Formal', 'Party', 'Minimal'] },
        { name: 'Earth Tones', colors: ['#594236', '#8F786C', '#C2B2A3', '#DCE2C6'], vibes: ['Casual', 'Streetwear'] },
        { name: 'Pastel Dream', colors: ['#FFB5E8', '#B28DFF', '#85E3FF', '#FFF5BA'], vibes: ['Party', 'Elegant', 'Casual'] },
        { name: 'Navy & Sand', colors: ['#001F3F', '#3A6D8C', '#E2D1C3', '#F9F6F0'], vibes: ['Office', 'Formal'] },
        { name: 'Neon Pop', colors: ['#39FF14', '#000000', '#FFFFFF', '#FF00FF'], vibes: ['Streetwear', 'Party'] }
    ]
};

window.trendsData = [
    {
        title: "Y2K Revival",
        category: "Streetwear",
        desc: "Baggy denim, crop tops, and chunky sneakers making a huge comeback.",
        colors: ["#FF007F", "#00FFFF", "#FFFFFF"],
        fabrics: "Denim, Velour, Mesh",
        tip: "Balance proportions: pair baggy bottoms with a fitted top.",
        colorCss: "pastel"
    },
    {
        title: "Quiet Luxury",
        category: "Formal / Minimal",
        desc: "Understated elegance focusing on exceptionally high-quality materials rather than logos.",
        colors: ["#EDE9E6", "#7B7774", "#1E1E1E"],
        fabrics: "Cashmere, Silk, Fine Wool",
        tip: "Stick to neutral color palettes and ensure clothes are perfectly tailored."
    },
    {
        title: "Utilitarian Chic",
        category: "Casual",
        desc: "Function meets fashion. Cargo pockets, tactical vests, and durable boots.",
        colors: ["#4A5D23", "#8B7355", "#000000"],
        fabrics: "Ripstop, Heavy Cotton, Nylon",
        tip: "Don't overdo the accessories—let the functional pockets be the statement."
    }
];

// Helper Function to pick a random item
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate Outfits Function
window.generateOutfits = function(specs, count = 3) {
    const results = [];
    
    // Filter palettes by matching vibe, else fallback
    const matchedPalettes = fashionRules.palettes.filter(p => 
        p.vibes.includes(specs.occasion) || p.vibes.includes(specs.stylePref)
    );
    const availablePalettes = matchedPalettes.length > 0 ? matchedPalettes : fashionRules.palettes;

    for (let i = 0; i < count; i++) {
        const top = pickRandom(fashionRules.tops[specs.occasion]);
        const bottom = pickRandom(fashionRules.bottoms[specs.occasion]);
        const shoe = pickRandom(fashionRules.footwear[specs.occasion]);
        
        let accList = fashionRules.accessories[specs.stylePref] || fashionRules.accessories['Minimal'];
        const accessory = pickRandom(accList);
        
        const palette = pickRandom(availablePalettes);
        const wLayer = fashionRules.weatherLayers[specs.weather];

        results.push({
            id: 'outfit_' + Date.now() + '_' + i,
            title: `${specs.stylePref} ${specs.occasion} Look ${i+1}`,
            top: top,
            bottom: bottom,
            shoe: shoe,
            accessory: accessory,
            palette: palette,
            fabric: wLayer.material,
            tip: wLayer.tip,
            specs: {...specs}
        });
    }

    return results;
}
