/* ==========================================================================
   RS LABS - PHASE 3 JAVASCRIPT FUNCTIONALITY & INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* .
       1. ACCORDION COMPONENT (About Us Page)
       . */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const icon = header.querySelector('.icon');
                
                // Toggle active state
                item.classList.toggle('active');
                if (icon) {
                    icon.textContent = item.classList.contains('active') ? '−' : '+';
                }
            });
        });
    }

    /* .
       2. PRODUCT SEARCH & CATEGORY FILTER (Products Page)
       . */
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const productCards = document.querySelectorAll('#product-list .product-card');

    if (searchInput && categoryFilter && productCards.length > 0) {
        function filterProducts() {
            const query = searchInput.value.toLowerCase().trim();
            const category = categoryFilter.value;

            productCards.forEach(card => {
                const cardName = card.getAttribute('data-name').toLowerCase();
                const cardCategory = card.getAttribute('data-category');

                const matchesSearch = cardName.includes(query);
                const matchesCategory = (category === 'all' || cardCategory === category);

                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }

    /* .
       3. GALLERY LIGHTBOX MODAL (Products Page)
       . */
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalTitle = document.getElementById('lightbox-title');
    const modalPrice = document.getElementById('lightbox-price');
    const modalDesc = document.getElementById('lightbox-desc');
    const modalClose = document.querySelector('.lightbox-close');

    if (modal) {
        const detailButtons = document.querySelectorAll('.view-details');
        const galleryTriggers = document.querySelectorAll('.gallery-trigger');

        function openModal(name, price, img, desc) {
            modalImg.src = img;
            modalImg.alt = name;
            modalTitle.textContent = name;
            modalPrice.textContent = price;
            modalDesc.textContent = desc || '';
            modal.classList.add('active');
        }

        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                openModal(
                    btn.getAttribute('data-name'),
                    btn.getAttribute('data-price'),
                    btn.getAttribute('data-img'),
                    btn.getAttribute('data-desc')
                );
            });
        });

        galleryTriggers.forEach(img => {
            img.addEventListener('click', () => {
                const card = img.closest('.product-card');
                const btn = card.querySelector('.view-details');
                if (btn) {
                    openModal(
                        btn.getAttribute('data-name'),
                        btn.getAttribute('data-price'),
                        btn.getAttribute('data-img'),
                        btn.getAttribute('data-desc')
                    );
                }
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    /* .
       4. ENQUIRY FORM VALIDATION & DYNAMIC COST CALCULATOR (Enquiry Page)
       . */
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        const productSelect = document.getElementById('product-type');
        const quantityInput = document.getElementById('quantity');
        const unitPriceDisplay = document.getElementById('unit-price-display');
        const totalPriceDisplay = document.getElementById('total-price-display');

        function updatePricing() {
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const unitPrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
            const qty = parseInt(quantityInput.value, 10) || 1;
            const total = unitPrice * qty;

            unitPriceDisplay.textContent = `R ${unitPrice.toFixed(2)}`;
            totalPriceDisplay.textContent = `R ${total.toFixed(2)}`;
        }

        productSelect.addEventListener('change', updatePricing);
        quantityInput.addEventListener('input', updatePricing);
        updatePricing(); // Initial calculation

        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            const name = document.getElementById('fullname');
            const email = document.getElementById('email');
            const qty = document.getElementById('quantity');
            const message = document.getElementById('message');

            // Name validation
            if (name.value.trim().length < 3) {
                document.getElementById('fullname-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('fullname-error').classList.remove('active');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                document.getElementById('email-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('email-error').classList.remove('active');
            }

            // Quantity validation
            if (parseInt(qty.value, 10) < 1 || isNaN(parseInt(qty.value, 10))) {
                document.getElementById('quantity-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('quantity-error').classList.remove('active');
            }

            // Message validation
            if (message.value.trim().length < 10) {
                document.getElementById('message-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('message-error').classList.remove('active');
            }

            if (isValid) {
                const responseBox = document.getElementById('enquiry-response');
                const totalText = totalPriceDisplay.textContent;
                
                responseBox.innerHTML = `
                    <div style="background-color: #dcfce7; color: #15803d; padding: 20px; border-radius: 8px; border: 1px solid #86efac;">
                        <h3>Enquiry Received!</h3>
                        <p>Thank you <strong>${name.value}</strong>. We have calculated your estimated quote at <strong>${totalText}</strong>.</p>
                        <p>A confirmation email has been dispatched to <em>${email.value}</em>. Our sales team will get back to you within 24 hours.</p>
                    </div>
                `;
                enquiryForm.reset();
                updatePricing();
            }
        });
    }

    /* .
       5. CONTACT FORM VALIDATION & EMAIL GENERATOR (Contact Page)
       . */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const messageTextarea = document.getElementById('contact-message');
        const charCounter = document.getElementById('char-counter');

        messageTextarea.addEventListener('input', () => {
            charCounter.textContent = messageTextarea.value.length;
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            const name = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const phone = document.getElementById('contact-phone');
            const subject = document.getElementById('contact-subject');
            const message = document.getElementById('contact-message');

            // Name
            if (name.value.trim().length < 2) {
                document.getElementById('cname-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('cname-error').classList.remove('active');
            }

            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                document.getElementById('cemail-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('cemail-error').classList.remove('active');
            }

            // Phone (SA & International formats allowed)
            const phoneRegex = /^(\+?\d{1,4}[[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                document.getElementById('cphone-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('cphone-error').classList.remove('active');
            }

            // Subject
            if (subject.value.trim().length < 3) {
                document.getElementById('csubject-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('csubject-error').classList.remove('active');
            }

            // Message
            if (message.value.trim().length < 10) {
                document.getElementById('cmessage-error').classList.add('active');
                isValid = false;
            } else {
                document.getElementById('cmessage-error').classList.remove('active');
            }

            if (isValid) {
                const responseBox = document.getElementById('contact-response');
                const mailtoLink = `mailto:za-support@rslabs.com?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent("From: " + name.value + "\nPhone: " + phone.value + "\nEmail: " + email.value + "\n\nMessage:\n" + message.value)}`;

                responseBox.innerHTML = `
                    <div style="background-color: #dcfce7; color: #15803d; padding: 20px; border-radius: 8px; border: 1px solid #86efac;">
                        <h3>Message Validated!</h3>
                        <p>Your message to <strong>za-support@rslabs.com</strong> has been compiled successfully.</p>
                        <a href="${mailtoLink}" class="btn" style="margin-top: 15px; display: inline-block;">Open Email Client to Send</a>
                    </div>
                `;
                contactForm.reset();
                charCounter.textContent = '0';
            }
        });
    }

    /* .
       6. INTERACTIVE LEAFLET MAP INITIALIZATION (Contact Page)
       . */
    const mapContainer = document.getElementById('interactive-map');
    if (mapContainer && typeof L !== 'undefined') {
        // Initialize map centered on Africa/Europe view balance
        const map = L.map('interactive-map').setView([-25.9964, 28.1267], 4);

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Marker 1: Midrand, South Africa HQ
        const saMarker = L.marker([-25.9964, 28.1267]).addTo(map);
        saMarker.bindPopup(`
            <strong>RS Labs Primary R&D Facility</strong><br>
            100 Athletic Performance Way, Midrand, South Africa<br>
            <em>Phone: +27 12 345 6789</em>
        `).openPopup();

        // Marker 2: Manchester, UK Distribution Centre
        const ukMarker = L.marker([53.4722, -2.3252]).addTo(map);
        ukMarker.bindPopup(`
            <strong>RS Labs UK Distribution Centre</strong><br>
            25 Innovation Park, Manchester, M17 1EH, UK<br>
            <em>Phone: +44 161 555 5555</em>
        `);
    }
});