const mysql = require('mysql2');

// Crea la connessione al database MySQL
const connection = mysql.createConnection({
    host: 'localhost',  // O l'indirizzo del tuo database
    user: 'root',       // Il tuo nome utente MySQL
    password: 'Lorenzo2005%',       // La tua password MySQL
    database: 'user_db' // Sostituisci con il nome del tuo database
});

// Verifica se la connessione è riuscita
connection.connect((err) => {
    if (err) {
        console.error('Errore nella connessione al database: ', err);
        return;
    }
    console.log('Connessione al database avvenuta con successo!');
});

module.exports = connection;
