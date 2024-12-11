let dataTable; // Variabile globale per DataTables

function fetchClientDetails() {
    const clientId = document.getElementById("clientSelect").value;
    console.log("Cliente selezionato:", clientId);

    if (clientId) {
        fetch(`/client-details/${clientId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Dati ricevuti dal server:", data);

                // Distruggi l'istanza esistente di DataTables, se presente
                if (dataTable) {
                    dataTable.destroy();
                }

                // Ripopola la tabella
                const tableBody = document.getElementById("clientDetailsTable").querySelector("tbody");
                tableBody.innerHTML = ""; // Svuota la tabella

                data.forEach(detail => {
                    const row = `
                        <tr>
                            <input type="hidden" value="${detail.id}" class="row-id">
                            <td><span class="output" data-field="date">${formatDate(detail.date)}</span></td>
                            <td><span class="output" data-field="description">${detail.description || ""}</span></td>
                            <td><span class="output" data-field="ratePerHour">${detail.ratePerHour || ""}</span></td>
                            <td><span class="output" data-field="travelCost">${detail.travelCost || "0"}</span></td>
                            <td><span class="output" data-field="number_people_work">${detail.number_people_work || ""}</span></td>
                            <td><span class="output" data-field="hours">${detail.hours || ""}</span></td>
                            <td><span class="output" data-field="amount">${detail.amount || "0"}</span></td>
                            <td><span class="output" data-field="advancePayment">${detail.advancePayment || "0"}</span></td>
                            <td><span class="output" data-field="residue">${detail.residue || "0"}</span></td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editRow(this)">Modifica</button>
                                <button class="btn btn-success btn-sm d-none" onclick="saveRow(this)">Salva</button>
                                <button class="btn btn-secondary btn-sm d-none" onclick="cancelEdit(this)">Annulla</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteRow(${detail.id}, this)">Elimina</button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });

                // Inizializza nuovamente DataTables
                dataTable = $('#clientDetailsTable').DataTable({
                    paging: true,
                    pageLength: 5,
                    searching: true,
                    ordering: true,
                    language: {
                        paginate: {
                            next: "Successivo",
                            previous: "Precedente"
                        },
                        lengthMenu: "Mostra _MENU_ righe",
                        search: "Cerca:",
                        info: "Mostra da _START_ a _END_ di _TOTAL_ righe"
                    }
                });
            })
            .catch(error => console.error("Errore durante il recupero dei dettagli del cliente:", error));
    }
}

// Funzione per formattare la data in formato YYYY-MM-DD
function formatDate(date) {
    const rawDate = new Date(date);
    rawDate.setDate(rawDate.getDate() + 1); // Correzione della data
    return rawDate.toISOString().split('T')[0];
}

function editRow(button) {
    const row = button.closest("tr");
    const outputs = row.querySelectorAll(".output");

    // Trasforma ogni elemento <span> in <input>
    outputs.forEach(output => {
        const field = output.getAttribute("data-field");
        const value = output.textContent.trim();
        const input = document.createElement("input");

        input.type = field === "date" ? "date" : "text";
        input.value = value;
        input.className = "form-control editable";
        input.setAttribute("data-field", field);

        output.replaceWith(input);
    });

    // Mostra i pulsanti Salva e Annulla, nascondi il pulsante Modifica
    button.classList.add("d-none");
    row.querySelector(".btn-success").classList.remove("d-none");
    row.querySelector(".btn-secondary").classList.remove("d-none");
}


function saveRow(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll(".editable");
    const id = row.querySelector(".row-id").value;

    const rowData = { id }; // Include l'ID
    inputs.forEach(input => {
        const field = input.getAttribute("data-field");
        rowData[field] = input.value;
    });

    console.log("Dati inviati:", rowData);

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

                // Trasforma ogni <input> in <span>
                inputs.forEach(input => {
                    const field = input.getAttribute("data-field");
                    const value = input.value;
                    const span = document.createElement("span");

                    span.className = "output";
                    span.setAttribute("data-field", field);
                    span.textContent = value;

                    input.replaceWith(span);
                });

                // Mostra il pulsante Modifica e nascondi Salva e Annulla
                button.classList.add("d-none");
                row.querySelector(".btn-warning").classList.remove("d-none");
                row.querySelector(".btn-secondary").classList.add("d-none");
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
    const inputs = row.querySelectorAll(".editable");

    // Trasforma ogni elemento <input> in <span>
    inputs.forEach(input => {
        const field = input.getAttribute("data-field");
        const value = input.getAttribute("data-original-value") || input.value;
        const span = document.createElement("span");

        span.className = "output";
        span.setAttribute("data-field", field);
        span.textContent = value;

        input.replaceWith(span);
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

                    // Rimuove la riga dalla tabella usando DataTables
                    const row = button.closest("tr");
                    const dataTableRow = dataTable.row(row); // Identifica la riga nel contesto di DataTables
                    dataTableRow.remove().draw(); // Rimuove la riga e aggiorna la tabella
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
