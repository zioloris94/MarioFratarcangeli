function fetchClientDetails() {
    const clientId = document.getElementById("clientSelect").value;
    console.log("Cliente selezionato:", clientId);
    if (clientId) {
        fetch(`/client-details/${clientId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Dati ricevuti dal server:", data);
                const tableBody = document.getElementById("clientDetailsTable");
                tableBody.innerHTML = ""; // Svuota la tabella
                data.forEach(detail => {
                    const row = document.createElement("tr");
                    // Formatta la data
                    const rawDate = new Date(detail.date);
                    rawDate.setDate(rawDate.getDate() + 1);
                    const formattedDate = rawDate.toISOString().split('T')[0];
                    row.innerHTML = `
                        <input type="hidden" value="${detail.id}" class="row-id">
                        <td><input type="date" value="${formattedDate}" class="form-control" disabled></td>
                        <td><input type="text" value="${detail.description || ""}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.ratePerHour || ""}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.travelCost || "0"}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.number_people_work || ""}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.hours || ""}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.amount || "0"}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.advancePayment || "0"}" class="form-control" disabled></td>
                        <td><input type="number" value="${detail.residue || "0"}" class="form-control" disabled></td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editRow(this)">Modifica</button>
                            <button class="btn btn-success btn-sm d-none" onclick="saveRow(this)">Salva</button>
                            <button class="btn btn-secondary btn-sm d-none" onclick="cancelEdit(this)">Annulla</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteRow(${detail.id}, this)">Elimina</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Errore durante il recupero dei dettagli del cliente:", error));
    }
}

function editRow(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll("input");

    // Memorizza i valori originali come attributi data-* sugli input
    inputs.forEach(input => {
        input.setAttribute("data-original-value", input.value);
        input.removeAttribute("disabled");
    });

    // Mostra i pulsanti Salva e Annulla, nascondi il pulsante Modifica
    button.classList.add("d-none");
    row.querySelector(".btn-success").classList.remove("d-none");
    row.querySelector(".btn-secondary").classList.remove("d-none");
}


function saveRow(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll("input");
    const id = row.querySelector(".row-id").value;

    // Raccogli i dati della riga
    const rowData = { id }; // Include l'ID
    inputs.forEach((input, index) => {
        const fieldName = [
            "id","date", "description", "ratePerHour", "travelCost",
            "number_people_work", "hours", "amount", "advancePayment", "residue"
        ][index];
        rowData[fieldName] = input.value;
    });

    console.log("Dati inviati:", rowData);

    // Disabilita tutti gli input della riga
    inputs.forEach(input => input.setAttribute("disabled", "disabled"));

    // Mostra il pulsante Modifica e nascondi Salva e Annulla
    button.classList.add("d-none");
    row.querySelector(".btn-warning").classList.remove("d-none");
    row.querySelector(".btn-secondary").classList.add("d-none");

    // Invia i dati al backend
    fetch(`/update-client-details`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rowData)
    })
        .then(response => {
            if (response.ok) {
                console.log("Riga aggiornata con successo");
            } else {
                throw new Error("Errore durante l'aggiornamento");
            }
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Errore durante l'aggiornamento della riga");
        });
}


function cancelEdit(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll("input");

    // Ripristina i valori originali dagli attributi data-original-value
    inputs.forEach(input => {
        input.value = input.getAttribute("data-original-value");
        input.setAttribute("disabled", "disabled");
    });

    // Mostra il pulsante Modifica e nascondi Salva e Annulla
    button.classList.add("d-none");
    row.querySelector(".btn-warning").classList.remove("d-none");
    row.querySelector(".btn-success").classList.add("d-none");
}



document.getElementById("saveButton").addEventListener("click", function () {
    const form = document.getElementById("clientDetailsForm");
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log("Dati inviati al server:", data);

    fetch('/save-client-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                console.log("Lavoro salvato con successo");
                return response.text();
            } else {
                throw new Error("Errore durante il salvataggio");
            }
        })
        .then(message => {
            alert(message); // Mostra il messaggio di successo
            // Aggiorna la tabella dei dettagli del cliente
            const clientSelect = document.getElementById("clientSelect");
            if (clientSelect && clientSelect.value) {
                fetchClientDetails(); // Aggiorna i dettagli del cliente
            }
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Errore durante il salvataggio");
        });
});

// Sincronizza le due select
document.getElementById("clientId").addEventListener("change", function () {
    const selectedValue = this.value; // Ottieni il valore selezionato
    const clientSelect = document.getElementById("clientSelect"); // Trova l'altra select

    if (clientSelect) {
        clientSelect.value = selectedValue; // Imposta il valore sulla seconda select

        // Se vuoi che cambi il comportamento, come ricaricare i dettagli cliente:
        if (selectedValue) {
            fetchClientDetails(); // Richiama la funzione per aggiornare i dettagli
        }
    }
});

function deleteRow(detailId, button) {
    if (confirm("Sei sicuro di voler eliminare questo dettaglio cliente?")) {
        fetch(`/client-details/${detailId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Riga eliminata con successo");
                    // Rimuove la riga dalla tabella
                    const row = button.closest("tr");
                    row.remove();
                } else {
                    throw new Error("Errore durante l'eliminazione della riga");
                }
            })
            .catch(error => {
                console.error("Errore:", error);
                alert("Errore durante l'eliminazione della riga");
            });
    }
}



function calculateAmount() {
    const hours = parseFloat(document.getElementById('hours').value) || 0;
    const ratePerHour = parseFloat(document.getElementById('ratePerHour').value) || 0;
    const travelCost = parseFloat(document.getElementById('travelCost').value) || 0;
    const numberPeopleWork = parseFloat(document.getElementById('numberPeopleWork').value) || 0;

    const totalAmount = (ratePerHour * numberPeopleWork * hours) + travelCost;

    document.getElementById('amountLabel').textContent = totalAmount.toFixed(2);
    document.getElementById('amount').value = totalAmount.toFixed(2);
}

// Event listeners per il calcolo del totale
document.getElementById('hours').addEventListener('input', calculateAmount);
document.getElementById('ratePerHour').addEventListener('input', calculateAmount);
document.getElementById('travelCost').addEventListener('input', calculateAmount);
document.getElementById('numberPeopleWork').addEventListener('input', calculateAmount);
