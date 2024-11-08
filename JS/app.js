const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./db');
const cors = require('cors'); // Importa cors
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'la_tua_chiave_segreta'; // In produzione usa una chiave più sicura

const app = express();
const PORT = 3000;

// Usa CORS per abilitare le richieste da altre origini
app.use(cors());

app.use(express.json());

// Registrazione
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Errore nel cifrare la password' });
        }

        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        connection.query(query, [name, email, hashedPassword], (err, results) => {
            if (err) {
                return res.status(400).json({ message: 'Errore nella registrazione' });
            }
            res.status(201).json({ message: 'Registrazione riuscita' });
        });
    });
});

// Modifica la route login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Errore nel login' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Utente non trovato' });
        }

        const user = results[0];
        
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Errore nel confronto della password' });
            }
            if (!match) {
                return res.status(400).json({ message: 'Password errata' });
            }
            
            // Genera il token JWT
            const token = jwt.sign(
                { userId: user.id, name: user.name, email: user.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );

            // Invia token e dati utente
            res.status(200).json({
                message: 'Login riuscito',
                token: token,
                user: {
                    name: user.name,
                    email: user.email
                }
            });
        });
    });
});

// Aggiungi una nuova route per verificare il token
app.get('/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token non fornito' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.status(401).json({ valid: false, message: 'Token non valido' });
    }
});


// Avvia il server
app.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});





