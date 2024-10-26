// Gestione menu mobile
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        navToggle.classList.toggle('toggle-active');
    });

    // Chiudi menu quando si clicca su un link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            navToggle.classList.remove('toggle-active');
        });
    });

    // Navbar trasparente/solida in base allo scroll
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Animazione di entrata elementi al scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .project-card, .form-group').forEach(el => {
        observer.observe(el);
    });

    // Animazione testo hero section
    const heroText = document.querySelector('.hero-content h1');
    const words = heroText.textContent.split(' ');
    heroText.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-elements > div');
    floatingElements.forEach((el, index) => {
        el.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    });

    // Form validation e animazione
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animazione di invio
        const submitBtn = form.querySelector('.submit-button');
        const formData = new FormData(form);
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio...';
        
        // Invio effettivo del form usando fetch
        fetch('https://formspree.io/f/meoqeeze', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Inviato!';
                submitBtn.classList.add('success');
                
                // Reset form dopo 2 secondi
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = 'Invia Messaggio';
                    submitBtn.classList.remove('success');
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                }, 2000);
            } else {
                throw new Error('Errore nell\'invio');
            }
        })
        .catch(error => {
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Errore nell\'invio';
            submitBtn.style.backgroundColor = '#ff3333';
            
            // Reset del bottone dopo 2 secondi
            setTimeout(() => {
                submitBtn.innerHTML = 'Invia Messaggio';
                submitBtn.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Parallax effect per hero section
    const heroSection = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        heroSection.style.backgroundPosition = `center ${scroll * 0.5}px`;
    });

    // Typed effect per il sottotitolo hero
    const heroSubtitle = document.querySelector('.hero-content p');
    let text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Avvia l'effetto typing quando la pagina è caricata
    setTimeout(typeWriter, 1000);
});

// Smooth scroll per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});