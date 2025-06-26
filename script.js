// Load Google Fonts API
function loadGoogleFontsAPI() {
    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    document.head.appendChild(script);
    return new Promise(resolve => script.onload = resolve);
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
    document.getElementById('custom-text').addEventListener('input', updateCustomText);
    document.querySelector('.refresh-icon').addEventListener('click', () => {
        fonts = [...origFonts];
        generateSuggestedPairs();
    });
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

// Update custom text in preview
function updateCustomText() {
    const customText = document.getElementById('custom-text').value;
    document.querySelectorAll('.primary-font').forEach(el => el.textContent = customText || "Primary Font Heading");
    document.querySelectorAll('.secondary-font').forEach(el => el.textContent = customText || "This is a paragraph in the secondary font.");
}

// Copy styles
function copyStyles() {
    const primaryFont = document.getElementById('primary-font').value;
    const secondaryFont = document.getElementById('secondary-font').value;
    const styles = 
`font-family: '${primaryFont}', sans-serif;
font-family: '${secondaryFont}', sans-serif;`.trim();

    navigator.clipboard.writeText(styles).then(() => {
        const copyIcon = document.getElementById('copy-styles');
        copyIcon.classList.replace('fa-copy', 'fa-check');
        copyIcon.style.color = '#4CAF50';
        showCustomTextBox("Styles copied!");
        setTimeout(() => {
            copyIcon.classList.replace('fa-check', 'fa-copy');
            copyIcon.style.color = '';
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy styles:', err);
        showCustomTextBox("Failed to copy styles");
    });
}

// Show custom text box
function showCustomTextBox(message) {
    const customTextBox = document.createElement('div');
    customTextBox.textContent = message;
    customTextBox.style.position = 'fixed';
    customTextBox.style.top = '20px';
    customTextBox.style.left = '50%';
    customTextBox.style.transform = 'translateX(-50%)';
    customTextBox.style.backgroundColor = '#4CAF50';
    customTextBox.style.color = 'white';
    customTextBox.style.padding = '1rem';
    customTextBox.style.borderRadius = '4px';
    customTextBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    customTextBox.style.zIndex = '1000';
    document.body.appendChild(customTextBox);

    setTimeout(() => {
        customTextBox.style.opacity = '0';
        customTextBox.style.transition = 'opacity 0.5s';
    }, 2000);

    setTimeout(() => {
        document.body.removeChild(customTextBox);
    }, 2500);
}

// Get random fonts
function getRandomFonts(count) {
    let randomFonts = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * fonts.length);
        randomFonts.push(fonts[randomIndex]);
        fonts.splice(randomIndex, 1);
    }
    return randomFonts;
}

// Generate suggested pairs
function generateSuggestedPairs() {
    const suggestions = document.querySelector('.pair-suggestions');
    suggestions.innerHTML = '';
    
    const randomFonts = getRandomFonts(10);
    const pairs = [];
    
    for (let i = 0; i < 5; i++) {
        pairs.push({
            primary: randomFonts[i * 2].family,
            secondary: randomFonts[i * 2 + 1].family
        });
    }

    pairs.forEach(pair => {
        const pairEl = document.createElement('div');
        pairEl.className = 'suggested-pair';
        pairEl.innerHTML = `
            <i class="copy-icon fas fa-copy" aria-label="Copy font pair"></i>
            <h4 style="font-family: '${pair.primary}'">${pair.primary}</h4>
            <p style="font-family: '${pair.secondary}'">${pair.secondary}</p>
        `;
        suggestions.appendChild(pairEl);

        const copyIcon = pairEl.querySelector('.copy-icon');
        copyIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            const textToCopy = `Primary Font: ${pair.primary}\nSecondary Font: ${pair.secondary}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.classList.replace('fa-copy', 'fa-check');
                this.style.color = '#4CAF50';
                showCustomTextBox("Font pair copied!");
                setTimeout(() => {
                    this.classList.replace('fa-check', 'fa-copy');
                    this.style.color = '';
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy font pair:', err);
                showCustomTextBox("Failed to copy font pair");
            });
        });

        pairEl.addEventListener('click', () => {
            document.getElementById('primary-font').value = pair.primary;
            document.getElementById('secondary-font').value = pair.secondary;
            updatePreview();
        });
    });

    WebFont.load({
        google: {
            families: pairs.flatMap(pair => [pair.primary, pair.secondary])
        }
    });
}

// Initialize font generator
let fonts = [];
let origFonts = [];

async function initFontGenerator() {
    await loadGoogleFontsAPI();
    fonts = await fetchGoogleFonts();
    origFonts = [...fonts];
    populateFontSelects(fonts);
    setupEventListeners();
    generateRandomPair();
    generateSuggestedPairs();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFontGenerator);




