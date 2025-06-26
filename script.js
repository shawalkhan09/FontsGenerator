// color generator section

// Utility functions
function randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function adjustHue(hue) {
    return (hue + 360) % 360;
}

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

// Color scheme generation functions
function generateMonochromatic(baseColor) {
    const hsl = hexToHSL(baseColor);
    return [
        hslToHex(hsl.h, hsl.s, 20),
        hslToHex(hsl.h, hsl.s, 40),
        hslToHex(hsl.h, hsl.s, 60),
        hslToHex(hsl.h, hsl.s, 80),
        hslToHex(hsl.h, hsl.s, 100)
    ];
}

function generateComplementary(baseColor) {
    const hsl = hexToHSL(baseColor);
    return [
        baseColor,
        hslToHex(adjustHue(hsl.h + 180), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 30), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 210), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 60), hsl.s, hsl.l)
    ];
}

function generateTriadic(baseColor) {
    const hsl = hexToHSL(baseColor);
    return [
        baseColor,
        hslToHex(adjustHue(hsl.h + 120), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 240), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 60), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 300), hsl.s, hsl.l)
    ];
}

function generateAnalogous(baseColor) {
    const hsl = hexToHSL(baseColor);
    return [
        hslToHex(adjustHue(hsl.h - 30), hsl.s, hsl.l),
        baseColor,
        hslToHex(adjustHue(hsl.h + 30), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h + 60), hsl.s, hsl.l),
        hslToHex(adjustHue(hsl.h - 60), hsl.s, hsl.l)
    ];
}

// Main function to generate colors
function generateColors(scheme) {
    let baseColor = randomColor();
    switch (scheme) {
        case 'monochromatic':
            return generateMonochromatic(baseColor);
        case 'complementary':
            return generateComplementary(baseColor);
        case 'triadic':
            return generateTriadic(baseColor);
        case 'analogous':
            return generateAnalogous(baseColor);
        default:
            return Array(5).fill().map(() => randomColor());
    }
}

// Function to show custom alert
function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    // Remove the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500); // Wait for fade out animation to complete
    }, 3000);
}

// Function to update the UI
function updateColorBoxes(colors) {
    const container = document.getElementById('colors-container');
    container.innerHTML = ''; // Clear existing color boxes

    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.innerHTML = `
            <div class="color-display" style="background-color: ${color};">
                <button class="copy-button" title="Copy Color">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div class="color-info">
                <span class="color-code">${color}</span>
            </div>
        `;
        container.appendChild(colorBox);
    });

    // Add event listeners for copy buttons
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            const colorCode = this.closest('.color-box').querySelector('.color-code').textContent;
            navigator.clipboard.writeText(colorCode).then(() => {
                showCustomAlert('Color code copied to clipboard!');
            });
        });
    });
}

// Function to copy the entire palette
function copyPalette() {
    const colorCodes = Array.from(document.querySelectorAll('.color-code'))
        .map(span => span.textContent)
        .join(', ');
    
    navigator.clipboard.writeText(colorCodes).then(() => {
        showCustomAlert('Entire palette copied to clipboard!');
    });
}

// Event listener for the generate button
document.getElementById('generate-palette').addEventListener('click', function() {
    const scheme = document.getElementById('color-scheme').value;
    const colors = generateColors(scheme);
    updateColorBoxes(colors);
});

// Event listener for the copy palette button
document.getElementById('copy-palette').addEventListener('click', copyPalette);

// Initial generation
updateColorBoxes(generateColors('random'));




// font generator section
// Load Google Fonts API
function loadGoogleFontsAPI() {
    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    document.head.appendChild(script);
    return new Promise(resolve => script.onload = resolve);
}

// Initialize font generator
async function initFontGenerator() {
    await loadGoogleFontsAPI();
    
    const fonts = await fetchGoogleFonts();
    populateFontSelects(fonts);
    setupEventListeners();
    generateRandomPair();
    generateSuggestedPairs(fonts);
}

// Fetch Google Fonts
async function fetchGoogleFonts() {
    const response = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAtCxjjOq4DcfLuf7Jo0k_ZqNx3FN0Rdls');
    const data = await response.json();
    return data.items.filter(font => font.category !== 'handwriting' && font.category !== 'display');
}

// Populate font select elements
function populateFontSelects(fonts) {
    const primarySelect = document.getElementById('primary-font');
    const secondarySelect = document.getElementById('secondary-font');
    
    fonts.forEach(font => {
        const option = new Option(font.family, font.family);
        primarySelect.add(option.cloneNode(true));
        secondarySelect.add(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('generate-pair').addEventListener('click', generateRandomPair);
    document.getElementById('copy-styles').addEventListener('click', copyStyles);
    document.getElementById('primary-font').addEventListener('change', updatePreview);
    document.getElementById('secondary-font').addEventListener('change', updatePreview);
    document.getElementById('background-color').addEventListener('input', updatePreviewColors);
    document.getElementById('text-color').addEventListener('input', updatePreviewColors);
}

// Generate random font pair
function generateRandomPair() {
    const primarySelect = document.getElementById('primary-font');
    const secondarySelect = document.getElementById('secondary-font');
    
    primarySelect.selectedIndex = Math.floor(Math.random() * primarySelect.options.length);
    do {
        secondarySelect.selectedIndex = Math.floor(Math.random() * secondarySelect.options.length);
    } while (primarySelect.value === secondarySelect.value);
    
    updatePreview();
}

// Update preview
function updatePreview() {
    const primaryFont = document.getElementById('primary-font').value;
    const secondaryFont = document.getElementById('secondary-font').value;
    
    WebFont.load({
        google: {
            families: [primaryFont, secondaryFont]
        },
        active: () => {
            document.querySelectorAll('.primary-font').forEach(el => el.style.fontFamily = primaryFont);
            document.querySelectorAll('.secondary-font').forEach(el => el.style.fontFamily = secondaryFont);
        }
    });
}

// Update preview colors
function updatePreviewColors() {
    const previewArea = document.querySelector('.preview-area');
    previewArea.style.backgroundColor = document.getElementById('background-color').value;
    previewArea.style.color = document.getElementById('text-color').value;
}

// Copy styles
function copyStyles() {
    const primaryFont = document.getElementById('primary-font').value;
    const secondaryFont = document.getElementById('secondary-font').value;
    const styles = `
font-family: '${primaryFont}', sans-serif;
font-family: '${secondaryFont}', sans-serif;
    `.trim();
    
    navigator.clipboard.writeText(styles).then(() => {
        alert('Font styles copied to clipboard!');
    });
}

// Generate suggested pairs
function generateSuggestedPairs(fonts) {
    const suggestions = document.querySelector('.pair-suggestions');
    const pairs = [
        { primary: 'Roboto', secondary: 'Open Sans' },
        { primary: 'Lato', secondary: 'Merriweather' },
        { primary: 'Oswald', secondary: 'Lora' },
        { primary: 'Montserrat', secondary: 'PT Serif' },
        { primary: 'Playfair Display', secondary: 'Source Sans Pro' }
    ];
    
    pairs.forEach(pair => {
        const suggestionEl = document.createElement('div');
        suggestionEl.className = 'suggested-pair';
        suggestionEl.innerHTML = `
            <h4 style="font-family: '${pair.primary}'">${pair.primary}</h4>
            <p style="font-family: '${pair.secondary}'">${pair.secondary}</p>
        `;
        suggestionEl.addEventListener('click', () => {
            document.getElementById('primary-font').value = pair.primary;
            document.getElementById('secondary-font').value = pair.secondary;
            updatePreview();
        });
        suggestions.appendChild(suggestionEl);
    });
    
    WebFont.load({
        google: {
            families: pairs.flatMap(pair => [pair.primary, pair.secondary])
        }
    });
}

// Initialize the font generator when the page loads
window.addEventListener('load', initFontGenerator);