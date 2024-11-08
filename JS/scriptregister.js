// scriptregister.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Preveniamo il comportamento di submit di default

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        const userData = {
            name: name,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Errore durante la registrazione');
            }

            const data = await response.json();
            console.log('Registrazione riuscita:', data.message);

            // Reindirizza l'utente alla pagina di login
            window.location.href = 'registration-success.html'; // Sostituisci con il percorso della tua pagina di login
        } catch (error) {
            console.error('Errore durante la registrazione:', error);
        }
    });
});
