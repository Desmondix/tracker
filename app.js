// Funzione per generare una stringa randomica
function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

// Funzione per impostare un cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Funzione per ottenere il valore di un cookie
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

// Funzione per inizializzare l'utente con un nuovo cookie
function initializeUser() {
    const userIdCookie = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!userIdCookie) {
        const playerName = askForName();
        if (!playerName) {
            return; // Interrompi se il nome non è valido
        }
        setCookie('userId', generateRandomString(16), 30); // Imposta la scadenza del cookie a 30 giorni
        setCookie('userName', playerName, 365); // Memorizza per un anno
    }

    // Popola addedEvents dai cookie
    const addedEventsCookie = document.cookie.replace(/(?:(?:^|.*;\s*)addedEvents\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (addedEventsCookie) {
        addedEvents.push(...addedEventsCookie.split(','));
    }

    // Chiamare updateEventButtons dopo aver popolato addedEvents
    updateEventButtons();
}

// Dichiarazione di addedEvents, totalPoints e tryCount al di fuori della funzione addPoints
const addedEvents = [];
let totalPoints = 0;
let tryCount = 1;

// Funzione per aggiungere punti e gestire il cookie
function addPoints(points, eventName) {
    if (!addedEvents.includes(eventName)) {
        totalPoints += points;
        addedEvents.push(eventName);
        updateCounter();
        updateEventButtons();
        updateCookie();
    } else {
        alert("Questo evento è già stato aggiunto!");
    }
}

function updateCookie() {
    setCookie('userPoints', totalPoints, 30); // Imposta la scadenza del cookie a 30 giorni
    setCookie('addedEvents', addedEvents.join(','), 30); // Aggiunge gli eventi riscattati nei cookie
}
// Funzione per chiedere il nome all'utente
function askForName() {
    const playerName = prompt("Inserisci il tuo nome:");
    if (playerName !== null && playerName.trim() !== "") {
        // Salva il nome utente nei cookie
        setCookie('userName', playerName, 365); // Memorizza per un anno
        return playerName;
    } else {
        alert("Inserisci un nome valido.");
        return null;
    }
}

// Funzione di aggiornamento del contatore
function updateCounter() {
    const counter = document.getElementById('points');
    counter.innerText = totalPoints;
    // Aggiorna lo stile del punteggio
    counter.style.fontSize = '24px';
    counter.style.fontWeight = 'bold';
    counter.style.color = totalPoints >= 0 ? '#2ecc71' : '#e74c3c';

    updateCookie();
}

// Funzione per aumentare o diminuire il punteggio
function adjustScore(points) {
    totalPoints += points;
    updateCounter();
}

// Funzione per ottenere l'utente corrente
function getCurrentUser() {
    const playerName = getCookie('userName');
    if (playerName) {
        return { name: playerName, tries: tryCount, points: totalPoints };
    } else {
        return null;
    }
}

// Funzione per resettare gli eventi e aumentare il contatore di tentativi
function newTry() {
    // Controlla se l'utente è già stato registrato nella sessione
    let playerName = getCookie('userName');
    if (!playerName) {
        playerName = askForName();
        if (!playerName) {
            return; // Interrompi se il nome non è valido
        }
    }

    const confirmNewTry = confirm("Sei sicuro di voler iniziare un nuovo tentativo? Gli eventi verranno resettati.");

    if (confirmNewTry) {
        addedEvents.length = 0;
        tryCount++;
        updateCounter();
        updateEventButtons();
        updateTryCount();
        // Aggiorna la classifica con il nuovo tentativo
    }
}

// Funzione per ottenere i punti associati a un determinato evento
function getPointsForEvent(eventName) {
    // Implementa la logica per associare punti a eventi specifici
    if (eventName === 'Uscita dal laboratorio') {
        return 10;
    } else if (eventName === 'Sconfitta Brock') {
        return 80;
    } else if (eventName === 'Monte Luna') {
        return 30;
    }
    // Aggiungi altri eventi qui se necessario
    return 0;
}

// Funzione per aggiornare il contatore dei tentativi
function updateTryCount() {
    document.getElementById('tryCount').innerText = tryCount;

    // Aggiorna il cookie con il contatore di tentativi
    setCookie('tryCount', tryCount, 30); // Imposta la scadenza del cookie a 30 giorni
}

// Funzione per aggiornare i pulsanti degli eventi
function updateEventButtons() {
    const eventContainer = document.getElementById('eventContainer');
    eventContainer.innerHTML = ''; // Rimuovi i pulsanti esistenti

    // Leggi il cookie con il punteggio
    const userPointsCookie = document.cookie.replace(/(?:(?:^|.*;\s*)userPoints\s*=\s*([^;]*).*$)|^.*$/, "$1");

    // Imposta il punteggio iniziale
    totalPoints = userPointsCookie ? parseInt(userPointsCookie) : 0;
    updateCounter();

    // Aggiungi pulsanti per ciascun evento non ancora aggiunto
    const allEvents = [
        { name: 'Uscire dal Lab', points: 20 },
        { name: 'Rivale Percorso pre-Lega', points: 10 },
        { name: 'Sconfiggi Brock', points: 80 },
        { name: 'Monte Luna', points: 5, punti_bonus: 30, specialEvent: true },
        { name: 'Rivale Città di Misty', points: 10 },
        { name: 'Sconfiggi Misty', points: 10 },
        { name: 'Rivale M/N Anna', points: 15 },
        { name: 'M/N Anna', points: 10, punti_bonus: 40, specialEvent: true },
        { name: 'Sconfiggi Surge', points: 15 },
        { name: 'Tunnel Roccioso', points: 15, punti_bonus: 35, specialEvent: true },
        { name: 'Rivale Torre Pokemon', points: 10 },
        { name: 'Torre di Lavandonia', points: 0, punti_bonus: 20, specialEvent: true },
        { name: 'Covo Rocket', points: 10, punti_bonus: 25, specialEvent: true },
        { name: 'Sconfiggi Erika', points: 10 },
        { name: 'Dojo Karate', points: 20},
        { name: 'Sconfiggi Koga', points: 55 },
        { name: 'Villa Pokemon', points: 10, punti_bonus: 15, specialEvent: true },
        { name: 'Sconfiggi Blaine', points: 50 },
        { name: 'Sconfiggi Sabrina', points: 50 },
        { name: 'Rivale Silph', points: 20 },
        { name: 'Silph Spa', points: 15, punti_bonus: 100, specialEvent: true },
        { name: 'Sconfiggi Giovanni', points: 90 },
        { name: 'Rivale Pre-Lega', points: 50 },
        { name: 'Via Vittoria', points: 5, punti_bonus: 70, specialEvent: true },
        { name: 'Sconfiggi Lorelei', points: 100 },
        { name: 'Sconfiggi Bruno', points: 120 },
        { name: 'Sconfiggi Agatha', points: 140 },
        { name: 'Sconfiggi Lance', points: 160 },
        { name: 'Sconfiggi Rivale', points: 500 },

        // Aggiungi altri eventi qui se necessario
    ];

    // Filtra gli eventi non ancora aggiunti
    const remainingEvents = allEvents.filter(event => !addedEvents.includes(event.name));

    // Mostra al massimo 4 eventi alla volta
    const eventsToShow = remainingEvents.slice(0, 4);

    eventsToShow.forEach(event => {
        const button = createEventButton(event);
        eventContainer.appendChild(button);
    });

    // Aggiungi una sezione per gli eventi riscattati
    const redeemedEventsContainer = document.createElement('div');
    redeemedEventsContainer.id = 'redeemedEventsContainer';
    redeemedEventsContainer.className = 'redeemed-events-container';

    // Mostra gli eventi riscattati
    addedEvents.forEach(eventName => {
        const event = allEvents.find(e => e.name === eventName);
        if (event) {
            const button = createEventButton(event, true);
            redeemedEventsContainer.appendChild(button);
        }
    });

    eventContainer.appendChild(redeemedEventsContainer);

    // Aggiungi il pulsante NUOVO TRY separato
    const newTryButton = document.createElement('button');
    newTryButton.id = 'newTryButton';
    newTryButton.textContent = 'NUOVO TRY';
    newTryButton.onclick = function () {
        showNewTryPrompt();
    };
    eventContainer.appendChild(newTryButton);
}

// Funzione per creare un pulsante evento
function createEventButton(event, redeemed = false) {
    const button = document.createElement('button');

    if (redeemed) {
        button.classList.add('redeemed-event');
    }

    if (event.specialEvent) {
        button.textContent = `${event.name} +${event.points}`;
        button.onclick = function () {
            showSpecialEvent(event.punti_bonus, event.name,event.points);
        };
    } else {
        button.textContent = `${event.name} +${event.points}`;
        button.onclick = function () {
            addPoints(event.points, event.name);
        };
    }

    return button;
}

// Funzione per mostrare un prompt di conferma personalizzato
function showConfirmationPrompt(message, confirmCallback) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'confirmationModal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Sì';
    yesButton.onclick = function () {
        confirmCallback(true);
        closeModal();
    };

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.onclick = function () {
        confirmCallback(false);
        closeModal();
    };

    buttonsContainer.appendChild(yesButton);
    buttonsContainer.appendChild(noButton);

    modalContent.appendChild(messageElement);
    modalContent.appendChild(buttonsContainer);
    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);
}

// Funzione per mostrare un prompt specifico per Monte Luna
function showSpecialEvent(punti_bonus, nome, puntibase) {
    const message = `Hai fatto full clear di ${nome}?`;
    showConfirmationPrompt(message, function (isFullClear) {
        if (isFullClear) {
            addPoints(punti_bonus + puntibase, `${nome}`);
        } else {
            addPoints(puntibase, `${nome}`);
        }
    });
}

// Funzione per mostrare il prompt NUOVO TRY
function showNewTryPrompt() {
    const message = 'Sei sicuro di voler iniziare un nuovo tentativo? Gli eventi verranno resettati.';
    showConfirmationPrompt(message, function () {
        addedEvents.length = 0; // Resetta gli eventi
        tryCount++; // Aumenta il contatore di tentativi
        updateCounter();
        updateEventButtons();
        updateTryCount();
    });
}

// Funzione per chiudere il prompt personalizzato
function closeModal() {
    const modalContainer = document.getElementById('confirmationModal');
    if (modalContainer) {
        modalContainer.remove();
    }
}

// Chiamare initializeUser() e initializeTryCount()
// Chiamare initializeUser() e initializeTryCount() quando un utente accede al sito
initializeTryCount();
initializeUser();

// Inizializza i pulsanti degli eventi all'avvio
updateEventButtons();
// Funzione per mostrare il prompt di reset con conferma
function showResetConfirmation() {
    const message = 'Sei sicuro di voler resettare punti e tentativi?';
    showConfirmationPrompt(message, function () {
        resetPointsAndTries();
    });
}

// Funzione per resettare punti e tentativi
function resetPointsAndTries() {
    totalPoints = 0;
    tryCount = 1;
    addedEvents.length = 0;
    updateCounter();
    updateEventButtons();
    updateTryCount();
}

// Aggiungi un nuovo pulsante per il reset nella sezione HTML
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Punti e Tentativi';
resetButton.onclick = function () {
    showResetConfirmation();
};
document.getElementById('scoreContainer').appendChild(resetButton);

function initializeTryCount() {
    const tryCountCookie = document.cookie.replace(/(?:(?:^|.*;\s*)tryCount\s*=\s*([^;]*).*$)|^.*$/, "$1");
    tryCount = tryCountCookie ? parseInt(tryCountCookie) : 1;
    updateTryCount();
}