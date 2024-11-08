document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    // Controlla se l'utente è già loggato
    checkAuthStatus();

    if (!form || !emailInput || !passwordInput) {
        console.error('Alcuni degli elementi richiesti non sono stati trovati!');
        return;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        const data = { email, password };

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.status === 200) {
                // Salva il token e i dati utente
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userName', result.user.name);
                
                // Reindirizza alla home
                window.location.href = '/index.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Errore durante il login:', error);
            alert('Errore durante il login, riprova più tardi.');
        }
    });
});

// Funzione per controllare lo stato di autenticazione
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    
    if (token) {
        try {
            const response = await fetch('http://localhost:3000/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            if (data.valid) {
                // L'utente è autenticato, modifica l'interfaccia
                updateUIForLoggedUser(data.user.name);
            }
        } catch (error) {
            console.error('Errore nella verifica del token:', error);
        }
    }
}

// Funzione per aggiornare l'interfaccia per utenti loggati
function updateUIForLoggedUser(userName) {
    const loginBtn = document.querySelector('.btn-login');
    const container = loginBtn.parentElement;
    
    // Rimuovi il pulsante di login
    loginBtn.remove();
    
    // Aggiungi il menu utente
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="welcome-text">Benvenuto, ${userName} !</div>
        <button class="logout-btn">Logout</button>
    `;
    
    container.appendChild(userMenu);
    
    // Aggiungi funzionalità di logout
    const logoutBtn = userMenu.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.reload();
    });
}