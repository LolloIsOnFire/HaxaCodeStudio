// verification.js

let auth0Client = null;

const configureClient = async () => {
    auth0Client = await createAuth0Client({
        domain: 'dev-nkf1rrp5slqxchxx.eu.auth0.com',
        client_id: 'JrhokXG0oW1h04ftgoCi4rgVXmwACrIs',
        redirect_uri: window.location.origin + '/verification.html'
    });
};

// Inizializza l'interfaccia di Auth0
const initAuth = async () => {
    await configureClient();
    
    // Gestisce il callback dopo la verifica
    if (window.location.search.includes("code=")) {
        try {
            // Gestisce il redirect di autenticazione
            await auth0Client.handleRedirectCallback();
            // Ottiene le info dell'utente
            const user = await auth0Client.getUser();
            showVerificationSuccess(user);
        } catch (error) {
            showError("Errore durante la verifica dell'email");
            console.error("Errore:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const resendButton = document.getElementById('resendButton');
    const countdownSpan = document.querySelector('.countdown');
    const emailContainer = document.querySelector('.email-info span');
    let countdownTime = 60;
    let countdownInterval;

    // Inizializza Auth0
    await initAuth();

    // Recupera l'email dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email && emailContainer) {
        emailContainer.textContent = `Abbiamo inviato un link di verifica a: ${email}`;
        // Salva l'email per il reinvio
        localStorage.setItem('verificationEmail', email);
    }

    // Funzione per mostrare notifiche toast
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${isError ? 'error' : 'success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Funzione per mostrare il successo della verifica
    function showVerificationSuccess(user) {
        const container = document.querySelector('.verification-container');
        container.innerHTML = `
            <div class="email-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Email Verificata!</h2>
            <p>Benvenuto ${user.email}!</p>
            <a href="/registration-success" class="resend-btn">
            Go to Registration Completer
            </a>
        `;
        container.classList.add('success');
    }

    // Funzione per mostrare errori
    function showError(message) {
        const container = document.querySelector('.verification-container');
        container.innerHTML = `
            <div class="email-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h2>Errore di Verifica</h2>
            <p>${message}</p>
            <button onclick="window.location.reload()" class="resend-btn">
                Riprova
            </button>
        `;
        container.classList.add('error');
    }

    // Funzione countdown per il pulsante di reinvio
    function startCountdown() {
        resendButton.disabled = true;
        countdownTime = 60;
        
        countdownInterval = setInterval(() => {
            countdownTime--;
            countdownSpan.textContent = ` (${countdownTime}s)`;
            
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                resendButton.disabled = false;
                countdownSpan.textContent = '';
            }
        }, 1000);
    }

    // Gestione del reinvio email
    resendButton.addEventListener('click', async function() {
        try {
            const email = localStorage.getItem('verificationEmail');
            if (!email) {
                throw new Error('Email non trovata');
            }

            await auth0Client.passwordlessStart({
                connection: 'email',
                email: email,
                send: 'link'
            });

            showToast('Email di verifica reinviata con successo!');
            startCountdown();
        } catch (error) {
            showToast('Errore durante il reinvio dell\'email', true);
            console.error('Errore:', error);
        }
    });
});