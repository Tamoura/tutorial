// Car Enhancement Visual Tool - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        bodyColor: '#cc0000',
        rimColor: '#c0c0c0',
        stripeColor: '#ffffff',
        wheelStyle: 'stock',
        tint: 'none',
        enhancements: {
            spoiler: false,
            bodyKit: false,
            hoodScoop: false,
            stripes: false,
            lowered: false
        },
        originalState: null
    };

    // Save original state for comparison
    state.originalState = JSON.parse(JSON.stringify(state));

    // DOM Elements
    const carSvg = document.getElementById('car-svg');
    const bodyElements = document.querySelectorAll('.car-body-color');
    const windowElements = document.querySelectorAll('.window-tint');
    const rimElements = document.querySelectorAll('.rim-color');
    const stripeElements = document.querySelectorAll('.stripe-color');

    // Color buttons
    const colorButtons = document.querySelectorAll('.color-btn');
    const customColorInput = document.getElementById('custom-body-color');
    const rimColorButtons = document.querySelectorAll('.rim-color-btn');
    const stripeColorButtons = document.querySelectorAll('.stripe-color-btn');

    // Wheel buttons
    const wheelButtons = document.querySelectorAll('.wheel-btn');

    // Tint buttons
    const tintButtons = document.querySelectorAll('.tint-btn');

    // Enhancement toggles
    const spoilerToggle = document.getElementById('spoiler-toggle');
    const bodykitToggle = document.getElementById('bodykit-toggle');
    const hoodscoopToggle = document.getElementById('hoodscoop-toggle');
    const stripesToggle = document.getElementById('stripes-toggle');
    const loweredToggle = document.getElementById('lowered-toggle');

    // Action buttons
    const resetBtn = document.getElementById('reset-btn');
    const randomizeBtn = document.getElementById('randomize-btn');
    const exportBtn = document.getElementById('export-btn');
    const comparisonBtn = document.getElementById('toggle-comparison');

    // Modal
    const modal = document.getElementById('comparison-modal');
    const closeModal = document.querySelector('.close-modal');

    // ============ Body Color Functions ============
    function updateBodyColor(color) {
        state.bodyColor = color;
        bodyElements.forEach(el => {
            el.style.fill = color;
        });
        updateActiveColorButton(colorButtons, color);
        customColorInput.value = color;
    }

    function updateActiveColorButton(buttons, color) {
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === color) {
                btn.classList.add('active');
            }
        });
    }

    // Color button click handlers
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateBodyColor(btn.dataset.color);
        });
    });

    customColorInput.addEventListener('input', (e) => {
        updateBodyColor(e.target.value);
    });

    // ============ Rim Color Functions ============
    function updateRimColor(color) {
        state.rimColor = color;
        rimElements.forEach(el => {
            el.style.fill = color;
        });
        updateActiveColorButton(rimColorButtons, color);
    }

    rimColorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateRimColor(btn.dataset.color);
        });
    });

    // ============ Stripe Color Functions ============
    function updateStripeColor(color) {
        state.stripeColor = color;
        stripeElements.forEach(el => {
            el.style.fill = color;
        });
        updateActiveColorButton(stripeColorButtons, color);
    }

    stripeColorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateStripeColor(btn.dataset.color);
        });
    });

    // ============ Wheel Style Functions ============
    function updateWheelStyle(style) {
        state.wheelStyle = style;

        // Update button states
        wheelButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.rim === style) {
                btn.classList.add('active');
            }
        });

        // Update wheel appearance based on style
        const wheels = document.querySelectorAll('.wheel');
        const spokes = document.querySelectorAll('.rim-spokes line');

        switch(style) {
            case 'stock':
                spokes.forEach(spoke => {
                    spoke.setAttribute('stroke-width', '4');
                });
                break;
            case 'sport':
                spokes.forEach(spoke => {
                    spoke.setAttribute('stroke-width', '6');
                });
                break;
            case 'luxury':
                spokes.forEach(spoke => {
                    spoke.setAttribute('stroke-width', '3');
                });
                break;
            case 'racing':
                spokes.forEach(spoke => {
                    spoke.setAttribute('stroke-width', '8');
                });
                break;
        }
    }

    wheelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateWheelStyle(btn.dataset.rim);
        });
    });

    // ============ Window Tint Functions ============
    function updateTint(tintLevel) {
        state.tint = tintLevel;

        // Update button states
        tintButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tint === tintLevel) {
                btn.classList.add('active');
            }
        });

        // Remove all tint classes and add new one
        windowElements.forEach(el => {
            el.classList.remove('tint-none', 'tint-light', 'tint-medium', 'tint-dark', 'tint-limo');
            el.classList.add(`tint-${tintLevel}`);
        });
    }

    tintButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateTint(btn.dataset.tint);
        });
    });

    // ============ Enhancement Functions ============
    function toggleEnhancement(enhancement, isEnabled) {
        state.enhancements[enhancement] = isEnabled;

        let element;
        switch(enhancement) {
            case 'spoiler':
                element = document.getElementById('spoiler');
                break;
            case 'bodyKit':
                element = document.getElementById('body-kit');
                break;
            case 'hoodScoop':
                element = document.getElementById('hood-scoop');
                break;
            case 'stripes':
                element = document.getElementById('racing-stripes');
                break;
            case 'lowered':
                if (isEnabled) {
                    carSvg.classList.add('lowered');
                } else {
                    carSvg.classList.remove('lowered');
                }
                return;
        }

        if (element) {
            if (isEnabled) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    }

    // Enhancement toggle handlers
    spoilerToggle.addEventListener('change', (e) => {
        toggleEnhancement('spoiler', e.target.checked);
    });

    bodykitToggle.addEventListener('change', (e) => {
        toggleEnhancement('bodyKit', e.target.checked);
    });

    hoodscoopToggle.addEventListener('change', (e) => {
        toggleEnhancement('hoodScoop', e.target.checked);
    });

    stripesToggle.addEventListener('change', (e) => {
        toggleEnhancement('stripes', e.target.checked);
    });

    loweredToggle.addEventListener('change', (e) => {
        toggleEnhancement('lowered', e.target.checked);
    });

    // ============ Reset Function ============
    function resetAll() {
        // Reset state
        state.bodyColor = '#cc0000';
        state.rimColor = '#c0c0c0';
        state.stripeColor = '#ffffff';
        state.wheelStyle = 'stock';
        state.tint = 'none';
        state.enhancements = {
            spoiler: false,
            bodyKit: false,
            hoodScoop: false,
            stripes: false,
            lowered: false
        };

        // Apply reset
        updateBodyColor(state.bodyColor);
        updateRimColor(state.rimColor);
        updateStripeColor(state.stripeColor);
        updateWheelStyle(state.wheelStyle);
        updateTint(state.tint);

        // Reset enhancement toggles
        spoilerToggle.checked = false;
        bodykitToggle.checked = false;
        hoodscoopToggle.checked = false;
        stripesToggle.checked = false;
        loweredToggle.checked = false;

        // Hide all enhancements
        document.getElementById('spoiler').classList.add('hidden');
        document.getElementById('body-kit').classList.add('hidden');
        document.getElementById('hood-scoop').classList.add('hidden');
        document.getElementById('racing-stripes').classList.add('hidden');
        carSvg.classList.remove('lowered');
    }

    resetBtn.addEventListener('click', resetAll);

    // ============ Randomize Function ============
    function randomize() {
        const colors = ['#cc0000', '#0066cc', '#000000', '#ffffff', '#ffcc00', '#00cc66', '#ff6600', '#6600cc', '#c0c0c0', '#1a1a2e'];
        const rimColors = ['#c0c0c0', '#1a1a1a', '#ffd700', '#b87333', '#cc0000'];
        const stripeColors = ['#ffffff', '#000000', '#ffd700', '#c0c0c0', '#cc0000', '#0066cc'];
        const wheelStyles = ['stock', 'sport', 'luxury', 'racing'];
        const tints = ['none', 'light', 'medium', 'dark', 'limo'];

        // Random selections
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomRimColor = rimColors[Math.floor(Math.random() * rimColors.length)];
        const randomStripeColor = stripeColors[Math.floor(Math.random() * stripeColors.length)];
        const randomWheelStyle = wheelStyles[Math.floor(Math.random() * wheelStyles.length)];
        const randomTint = tints[Math.floor(Math.random() * tints.length)];

        // Apply random selections
        updateBodyColor(randomColor);
        updateRimColor(randomRimColor);
        updateStripeColor(randomStripeColor);
        updateWheelStyle(randomWheelStyle);
        updateTint(randomTint);

        // Random enhancements
        const randomSpoiler = Math.random() > 0.5;
        const randomBodyKit = Math.random() > 0.5;
        const randomHoodScoop = Math.random() > 0.5;
        const randomStripes = Math.random() > 0.5;
        const randomLowered = Math.random() > 0.5;

        spoilerToggle.checked = randomSpoiler;
        bodykitToggle.checked = randomBodyKit;
        hoodscoopToggle.checked = randomHoodScoop;
        stripesToggle.checked = randomStripes;
        loweredToggle.checked = randomLowered;

        toggleEnhancement('spoiler', randomSpoiler);
        toggleEnhancement('bodyKit', randomBodyKit);
        toggleEnhancement('hoodScoop', randomHoodScoop);
        toggleEnhancement('stripes', randomStripes);
        toggleEnhancement('lowered', randomLowered);
    }

    randomizeBtn.addEventListener('click', randomize);

    // ============ Export Function ============
    function exportImage() {
        const svgElement = document.getElementById('car-svg');
        const svgData = new XMLSerializer().serializeToString(svgElement);

        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 1600;
        canvas.height = 800;

        // Create image from SVG
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            // Draw background
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the car
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Create download link
            const link = document.createElement('a');
            link.download = 'my-custom-car.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            URL.revokeObjectURL(url);
        };

        img.src = url;
    }

    exportBtn.addEventListener('click', exportImage);

    // ============ Comparison Modal ============
    function showComparison() {
        modal.classList.remove('hidden');

        // Clone original SVG for "before"
        const beforeContainer = document.getElementById('before-car');
        const afterContainer = document.getElementById('after-car');

        // Clear containers
        beforeContainer.innerHTML = '';
        afterContainer.innerHTML = '';

        // Create original (stock) car SVG
        const originalSvg = carSvg.cloneNode(true);
        originalSvg.id = 'original-car-svg';

        // Reset original SVG to stock appearance
        const origBodyElements = originalSvg.querySelectorAll('.car-body-color');
        origBodyElements.forEach(el => {
            el.style.fill = '#cc0000';
        });

        const origWindowElements = originalSvg.querySelectorAll('.window-tint');
        origWindowElements.forEach(el => {
            el.classList.remove('tint-light', 'tint-medium', 'tint-dark', 'tint-limo');
            el.classList.add('tint-none');
        });

        const origRimElements = originalSvg.querySelectorAll('.rim-color');
        origRimElements.forEach(el => {
            el.style.fill = '#c0c0c0';
        });

        // Hide all enhancements in original
        const origEnhancements = originalSvg.querySelectorAll('.enhancement');
        origEnhancements.forEach(el => {
            el.classList.add('hidden');
        });

        originalSvg.classList.remove('lowered');

        // Clone current car for "after"
        const currentSvg = carSvg.cloneNode(true);
        currentSvg.id = 'current-car-svg';

        beforeContainer.appendChild(originalSvg);
        afterContainer.appendChild(currentSvg);
    }

    comparisonBtn.addEventListener('click', showComparison);

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // ============ Keyboard Shortcuts ============
    document.addEventListener('keydown', (e) => {
        // Escape to close modal
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }

        // R for reset
        if (e.key === 'r' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            resetAll();
        }

        // Space for randomize
        if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'BUTTON') {
            e.preventDefault();
            randomize();
        }
    });

    // ============ Initialize ============
    // Set initial active states
    updateActiveColorButton(colorButtons, state.bodyColor);
    updateActiveColorButton(rimColorButtons, state.rimColor);
    updateActiveColorButton(stripeColorButtons, state.stripeColor);

    console.log('Car Enhancement Visual Tool initialized!');
    console.log('Keyboard shortcuts: R = Reset, Space = Randomize, Escape = Close modal');
});
