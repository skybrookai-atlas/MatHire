/* JavaScript Interactivity - Northern Rivers Mat Hire */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Core Config Data (Entry Plush Hire & Marked-Up Purchases)
    // ----------------------------------------------------
    const pricingConfig = {
        // HIRE SPECIFICATIONS: Only Entry Plush in Charcoal
        hire: {
            name: 'Entry Plush Mat (Charcoal)',
            sizes: {
                small: { name: 'Small (600 x 850 mm)', rate: 8.50 },
                medium: { name: 'Medium (850 x 1500 mm)', rate: 12.50 },
                runner: { name: 'Runner (850 x 3000 mm)', rate: 20.00 },
                large: { name: 'Large (1150 x 1800 mm)', rate: 16.50 }
            },
            frequencies: {
                weekly: { label: '1 Week Swap-out', multiplier: 1.0, divisor: 1, weeksPerMonth: 4.3 },
                fortnightly: { label: '2 Weeks Swap-out', multiplier: 1.2, divisor: 2, weeksPerMonth: 2.15 },
                monthly: { label: '4 Weeks Swap-out', multiplier: 1.5, divisor: 4, weeksPerMonth: 1.07 }
            }
        },
        
        // PURCHASE CATALOG: 20% markup over The Mat Group
        purchase: {
            coir: {
                name: 'Coir Eco-Weave (Natural Coir)',
                basePrice: 84.00,
                sizes: {
                    small: 84.00,
                    medium: 125.00,
                    large: 195.00,
                    custom: null // Request Quote
                }
            },
            scraper: {
                name: 'UltraScrape Loop (Outdoor Scraper)',
                basePrice: 60.00,
                sizes: {
                    small: 60.00,
                    medium: 98.00,
                    large: 165.00,
                    custom: null
                }
            },
            ribbed: {
                name: 'Superguard Ribbed (Heavy Duty Entry)',
                basePrice: 88.00,
                sizes: {
                    small: 88.00,
                    medium: 145.00,
                    large: 220.00,
                    custom: null
                }
            },
            logo: {
                name: 'Signature HD Brand (Logo Mat)',
                basePrice: 412.00,
                sizes: {
                    medium: 412.00,
                    large: 595.00,
                    custom: null
                }
            },
            antifatigue: {
                name: 'ComfortStand Ergonomic (Anti-Fatigue)',
                basePrice: 114.00,
                sizes: {
                    medium: 114.00,
                    large: 185.00,
                    custom: null
                }
            }
        }
    };

    // ----------------------------------------------------
    // 2. Navigation Active State & Scroll Handling
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 3. Hire Mats Calculator Logic (Entry Plush Only)
    // ----------------------------------------------------
    const hireSizeSelect = document.getElementById('hire-size');
    const hireFreqCards = document.querySelectorAll('#hire-freq .option-card');
    const hirePriceDisplay = document.getElementById('hire-price-value');
    const hirePeriodDisplay = document.querySelector('#hire-mats .price-period');
    const hireExchangeDisplay = document.getElementById('summary-hire-exchange');
    const hireSizeSummary = document.getElementById('summary-hire-size');
    const hireFreqSummary = document.getElementById('summary-hire-freq');
    const hirePromoSummary = document.getElementById('summary-hire-promo');
    const hireBookBtn = document.getElementById('hire-book-btn');

    let selectedHireFreq = 'fortnightly'; // Default

    function calculateHirePrice() {
        if (!hireSizeSelect) return;
        const sizeKey = hireSizeSelect.value;
        const sizeInfo = pricingConfig.hire.sizes[sizeKey];
        const freqInfo = pricingConfig.hire.frequencies[selectedHireFreq];

        const ratePerWeek = sizeInfo.rate * freqInfo.multiplier;
        const costPerExchange = ratePerWeek * freqInfo.divisor;
        
        // Calculate monthly average: weeks per month * weekly rate
        const monthlyCost = ratePerWeek * 4.33;
        const halfPriceFirstMonth = monthlyCost / 2;

        // Display corresponding price and period label matching the selected frequency
        if (selectedHireFreq === 'weekly') {
            hirePriceDisplay.textContent = `$${ratePerWeek.toFixed(2)}`;
            if (hirePeriodDisplay) hirePeriodDisplay.textContent = 'per 1 week';
        } else if (selectedHireFreq === 'fortnightly') {
            hirePriceDisplay.textContent = `$${costPerExchange.toFixed(2)}`;
            if (hirePeriodDisplay) hirePeriodDisplay.textContent = 'per 2 weeks';
        } else if (selectedHireFreq === 'monthly') {
            hirePriceDisplay.textContent = `$${costPerExchange.toFixed(2)}`;
            if (hirePeriodDisplay) hirePeriodDisplay.textContent = 'per 4 weeks';
        }
        
        // Update summary text
        hireSizeSummary.textContent = sizeInfo.name;
        hireFreqSummary.textContent = freqInfo.label;
        hireExchangeDisplay.textContent = `$${costPerExchange.toFixed(2)} per exchange`;
        hirePromoSummary.textContent = `$${halfPriceFirstMonth.toFixed(2)} (Save $${halfPriceFirstMonth.toFixed(2)}!)`;
    }

    // Set up Hire Calculator listeners
    if (hireSizeSelect) {
        hireSizeSelect.addEventListener('change', calculateHirePrice);

        hireFreqCards.forEach(card => {
            card.addEventListener('click', () => {
                hireFreqCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedHireFreq = card.dataset.freq;
                calculateHirePrice();
            });
        });

        // Initialize calculator
        calculateHirePrice();
    }

    // Apply Hire calculator configuration to booking form
    if (hireBookBtn) {
        hireBookBtn.addEventListener('click', () => {
            const sizeText = hireSizeSelect.options[hireSizeSelect.selectedIndex].text;
            const freqInfo = pricingConfig.hire.frequencies[selectedHireFreq].label;
            
            const bookingDetails = `Hire Booking Request:
- Mat: Entry Plush Mat (Charcoal)
- Size: ${sizeText}
- Swap Frequency: ${freqInfo}
- Offer Applied: First Month Half Price (No Lock-in)`;

            const notesField = document.getElementById('booking-notes');
            if (notesField) {
                notesField.value = bookingDetails;
                document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
                showNotification('Hire plan details applied to booking form below!');
            }
        });
    }

    // ----------------------------------------------------
    // 4. Purchase Calculator Logic (With 20% Markup & Deals)
    // ----------------------------------------------------
    const purchaseTypeSelect = document.getElementById('purchase-type');
    const purchaseSizeSelect = document.getElementById('purchase-size');
    const purchaseContractSelect = document.getElementById('purchase-contract');
    const purchasePriceDisplay = document.getElementById('purchase-price-value');
    
    // Purchase Summary Fields
    const summaryPurchaseMat = document.getElementById('summary-purchase-mat');
    const summaryPurchaseSize = document.getElementById('summary-purchase-size');
    const summaryPurchaseContract = document.getElementById('summary-purchase-contract');
    const summaryPurchasePrice = document.getElementById('summary-purchase-price');
    const purchaseBookBtn = document.getElementById('purchase-book-btn');

    function updatePurchaseSizes() {
        if (!purchaseTypeSelect || !purchaseSizeSelect) return;
        const matKey = purchaseTypeSelect.value;
        const availablePrices = pricingConfig.purchase[matKey].sizes;
        
        // Save previous selection if still valid
        const prevSize = purchaseSizeSelect.value;
        purchaseSizeSelect.innerHTML = '';

        const sizeLabels = {
            small: 'Small (600 x 850 mm)',
            medium: 'Medium (850 x 1500 mm)',
            large: 'Large (1150 x 1800 mm)',
            custom: 'Custom Made-to-measure Size'
        };

        Object.keys(availablePrices).forEach(sizeKey => {
            const opt = document.createElement('option');
            opt.value = sizeKey;
            opt.textContent = sizeLabels[sizeKey];
            purchaseSizeSelect.appendChild(opt);
        });

        if (availablePrices[prevSize] !== undefined) {
            purchaseSizeSelect.value = prevSize;
        } else {
            purchaseSizeSelect.selectedIndex = 0;
        }

        calculatePurchasePrice();
    }

    function calculatePurchasePrice() {
        if (!purchaseTypeSelect || !purchaseSizeSelect) return;
        const matKey = purchaseTypeSelect.value;
        const sizeKey = purchaseSizeSelect.value;
        const contractType = purchaseContractSelect ? purchaseContractSelect.value : 'buy';

        const matInfo = pricingConfig.purchase[matKey];
        const price = matInfo.sizes[sizeKey];

        let finalPrice = price;
        let discountMsg = '';

        // If custom size is selected
        if (price === null) {
            purchasePriceDisplay.textContent = 'Enquire';
            summaryPurchasePrice.textContent = 'Bespoke Quote Needed';
            summaryPurchaseMat.textContent = matInfo.name;
            summaryPurchaseSize.textContent = 'Custom Cut';
            summaryPurchaseContract.textContent = contractType === 'rent-6month' ? '6-Month Hire Plan' : 'Outright Purchase';
            return;
        }

        // Apply 50% discount to Custom Logo mat if linked to a 6-month contract
        if (matKey === 'logo' && contractType === 'rent-6month') {
            finalPrice = price * 0.5;
            discountMsg = ' (50% Off Contract Special!)';
        }

        purchasePriceDisplay.textContent = `$${finalPrice.toFixed(2)}`;
        
        // Update summary panel
        summaryPurchaseMat.textContent = matInfo.name;
        summaryPurchaseSize.textContent = purchaseSizeSelect.options[purchaseSizeSelect.selectedIndex].text;
        summaryPurchaseContract.textContent = contractType === 'rent-6month' ? '6-Month Hire Plan' : 'Outright Purchase';
        summaryPurchasePrice.textContent = `$${finalPrice.toFixed(2)}${discountMsg}`;
    }

    // Set up Purchase Calculator listeners
    if (purchaseTypeSelect) {
        purchaseTypeSelect.addEventListener('change', updatePurchaseSizes);
        purchaseSizeSelect.addEventListener('change', calculatePurchasePrice);
        purchaseContractSelect.addEventListener('change', calculatePurchasePrice);
        
        updatePurchaseSizes();
    }

    // Apply Purchase configuration to booking form
    if (purchaseBookBtn) {
        purchaseBookBtn.addEventListener('click', () => {
            const matText = purchaseTypeSelect.options[purchaseTypeSelect.selectedIndex].text;
            const sizeText = purchaseSizeSelect.options[purchaseSizeSelect.selectedIndex].text;
            const contractVal = purchaseContractSelect.value;
            const priceText = summaryPurchasePrice.textContent;
            
            const bookingDetails = `Purchase Order Request:
- Mat: ${matText}
- Size: ${sizeText}
- Option: ${contractVal === 'rent-6month' ? 'Linked with 6-Month Hire Contract (50% Off Logo)' : 'Outright Purchase'}
- Calculated Price: ${priceText}`;

            const notesField = document.getElementById('booking-notes');
            if (notesField) {
                notesField.value = bookingDetails;
                document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
                showNotification('Purchase configuration applied to booking form below!');
            }
        });
    }

    // ----------------------------------------------------
    // 5. Interactive Custom Mat Designer Logic
    // ----------------------------------------------------
    const designType = document.getElementById('design-type');
    const designSize = document.getElementById('design-size');
    const designOption = document.getElementById('design-option');
    const matCanvas = document.getElementById('mat-canvas');
    const matLogo = document.getElementById('mat-logo-preview');
    const logoUpload = document.getElementById('logo-upload');
    const customTextEl = document.getElementById('mat-custom-text-preview');
    const textInput = document.getElementById('design-text');
    const textColorSelect = document.getElementById('design-text-color');
    const applyDesignBtn = document.getElementById('apply-design-btn');

    // Base Color pickers
    const colorOptions = document.querySelectorAll('.color-option');
    let selectedColor = '#262626'; // Default charcoal

    colorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            colorOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedColor = opt.dataset.color;
            matCanvas.style.backgroundColor = selectedColor;
        });
    });

    // Handle logo image upload
    if (logoUpload) {
        logoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    matLogo.src = event.target.result;
                    matLogo.classList.remove('placeholder');
                    document.getElementById('upload-text').textContent = file.name;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle text overlay
    if (textInput) {
        textInput.addEventListener('input', () => {
            const textVal = textInput.value;
            customTextEl.textContent = textVal;
            customTextEl.style.display = textVal.trim() !== '' ? 'block' : 'none';
        });
    }

    if (textColorSelect) {
        textColorSelect.addEventListener('change', () => {
            customTextEl.style.color = textColorSelect.value;
        });
    }

    // Apply custom design to contact form
    if (applyDesignBtn) {
        applyDesignBtn.addEventListener('click', () => {
            const typeText = designType.options[designType.selectedIndex].text;
            const sizeText = designSize.options[designSize.selectedIndex].text;
            const optionText = designOption.options[designOption.selectedIndex].text;
            
            const designDetails = `Bespoke Logo Design Request:
- Design Style: ${typeText}
- Size Selected: ${sizeText}
- Agreement Option: ${optionText}
- Background Color Code: ${selectedColor}
- Text overlay: "${textInput ? textInput.value : 'None'}"`;

            const notesField = document.getElementById('booking-notes');
            if (notesField) {
                notesField.value = designDetails;
                document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
                showNotification('Bespoke custom mat design applied to booking form!');
            }
        });
    }

    // ----------------------------------------------------
    // 6. Booking Form Submission & Validation
    // ----------------------------------------------------
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('booking-name').value;
            const email = document.getElementById('booking-email').value;
            const phone = document.getElementById('booking-phone').value;
            const business = document.getElementById('booking-business').value;
            const address = document.getElementById('booking-address').value;
            
            if (!name || !email || !phone || !address) {
                alert('Please fill out all required fields.');
                return;
            }

            // Create booking success modal
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '10000';
            overlay.style.backdropFilter = 'blur(8px)';

            const modal = document.createElement('div');
            modal.style.backgroundColor = '#ffffff';
            modal.style.padding = '48px';
            modal.style.borderRadius = '16px';
            modal.style.maxWidth = '500px';
            modal.style.width = '90%';
            modal.style.textAlign = 'center';
            modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
            modal.style.animation = 'fadeIn 0.3s ease-out';

            modal.innerHTML = `
                <div style="font-size: 4rem; color: #e6b033; margin-bottom: 24px;">✓</div>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: #1c1e21; margin-bottom: 16px;">Request Received!</h3>
                <p style="color: #4a5568; margin-bottom: 32px; font-size: 1.05rem;">
                    Thanks, <strong>${name}</strong>. Kerry will contact you at <strong>${phone}</strong> or <strong>${email}</strong> within 24 hours to coordinate delivery to <strong>${business || 'your business'}</strong>.
                </p>
                <button class="btn btn-secondary" id="modal-close-btn" style="width: 100%;">Back to Home</button>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            document.getElementById('modal-close-btn').addEventListener('click', () => {
                overlay.remove();
                bookingForm.reset();
            });
        });
    }

    // ----------------------------------------------------
    // 7. FAQ Accordion Toggles
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Helper function for custom popups
    function showNotification(msg) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '24px';
        notification.style.right = '24px';
        notification.style.backgroundColor = '#1c1e21';
        notification.style.color = '#ffffff';
        notification.style.padding = '16px 24px';
        notification.style.borderRadius = '8px';
        notification.style.borderLeft = '4px solid #e6b033';
        notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
        notification.style.zIndex = '9999';
        notification.textContent = msg;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
});
