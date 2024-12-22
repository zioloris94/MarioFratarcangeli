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
                    searching: false,
                    ordering: false,
                    order: [[0, 'desc']],
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

// Funzione per formattare la data in formato gg-MM-aaaa
function formatDate(date) {
    const rawDate = new Date(date);
    const day = String(rawDate.getDate()).padStart(2, '0'); // Aggiungi zero iniziale se necessario
    const month = String(rawDate.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0
    const year = rawDate.getFullYear();
    return `${day}-${month}-${year}`; // Restituisce il formato gg-MM-aaaa
}

function editRow(button) {
    const row = button.closest("tr");
    const outputs = row.querySelectorAll(".output");

    // Trasforma ogni elemento <span> in <input>
    outputs.forEach(output => {
        const field = output.getAttribute("data-field");
        let value = output.textContent.trim(); // Ottieni il valore corrente del campo

        const input = document.createElement("input");
        if (field === "date") {
            // Converte la data in formato YYYY-MM-DD per il campo input type="date"
            const [day, month, year] = value.split("-");
            if (day && month && year) {
                value = `${year}-${month}-${day}`; // Converte in formato YYYY-MM-DD
            } else {
                console.error(`Formato data non valido: ${value}`);
            }

            input.type = "date";
        } else {
            input.type = "text";
        }

        input.value = value; // Imposta il valore corrente nel campo input
        input.className = "form-control editable";
        input.setAttribute("data-field", field);

        // Conserva il valore originale per l'annullamento
        input.setAttribute("data-original-value", output.textContent.trim());

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
        let value = input.value;

        if (field === "date") {
            // Usa direttamente il valore del campo di input type="date" (già in formato YYYY-MM-DD)
            const rawDate = new Date(value);
            if (!isNaN(rawDate)) {
                value = rawDate.toISOString().split("T")[0]; // Assicurati del formato YYYY-MM-DD
            } else {
                console.error(`Data non valida per il campo "${field}":`, value);
            }
        }

        rowData[field] = value;
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

                // Ricarica i dettagli del cliente per garantire l'ordine
                const clientId = document.getElementById("clientSelect").value;
                if (clientId) {
                    fetchClientDetails(); // Ricarica l'intera tabella
                }
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
        const originalValue = input.getAttribute("data-original-value"); // Recupera il valore originale
        const span = document.createElement("span");

        if (field === "date" && originalValue) {
            // Riconverte la data in formato leggibile (gg-MM-aaaa)
            const [year, month, day] = originalValue.split("-");
            span.textContent = `${day}-${month}-${year}`;
        } else {
            span.textContent = originalValue;
        }

        span.className = "output";
        span.setAttribute("data-field", field);

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

document.getElementById("saveNewClientButton").addEventListener("click", function () {
    const clientName = document.getElementById("clientName").value;

    if (!clientName) {
        alert("Il nome del cliente è obbligatorio!");
        return;
    }

    fetch("/save-client", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: clientName }),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            document.getElementById("newClientForm").reset();
            updateClientDropdown(); // Aggiorna i dropdown con i nuovi clienti
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Errore nell'inserimento del cliente: " + error.message);
        });
});

// Includi jsPDF nel tuo progetto (tramite CDN o pacchetto npm)
document.getElementById("generatePdfButton").addEventListener("click", function () {
    const clientId = document.getElementById("clientReportSelect").value;
    const clientSelect = document.getElementById("clientReportSelect");
    const clientName = clientSelect.options[clientSelect.selectedIndex].textContent.trim();
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);

    if (!clientId || isNaN(startDate) || isNaN(endDate)) {
        alert("Compila tutti i campi!");
        return;
    }

    fetch(`/client-details/${clientId}`)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(row => {
                const rowDate = new Date(row.date);
                return rowDate >= startDate && rowDate <= endDate;
            });

            if (filteredData.length === 0) {
                alert("Nessun dato trovato per il range selezionato.");
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const headers = ["N°", "DATA", "DESCRIZIONE", "ORE", "IMPORTO (€)", "RESIDUO (€)"];
            const rows = [];

            filteredData.forEach((row, index) => {
                rows.push([
                    index + 1,
                    new Date(row.date).toLocaleDateString("it-IT"),
                    row.description || "",
                    row.hours || "",
                    row.amount ? row.amount.toFixed(2) : "0.00",
                    row.residue ? row.residue.toFixed(2) : "0.00",
                ]);
            });

            doc.autoTable({
                head: [headers],
                body: rows,
                startY: 30,
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [220, 53, 69] },
            });

            const fileName = `${clientName.replace(/\s+/g, '_')}_al_${endDate.toLocaleDateString("it-IT").replace(/\//g, '-')}.pdf`;

            doc.save(fileName);
        })
        .catch(error => {
            console.error("Errore durante il fetch dei dati:", error);
            alert("Errore durante la generazione del PDF.");
        });
});

function updateClientDropdown() {
    fetch("/client-list")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante il recupero della lista clienti");
            }
            return response.json();
        })
        .then(data => {
            const clientSelect = document.getElementById("clientSelect");
            const clientId = document.getElementById("clientId");

            // Svuota i dropdown
            clientSelect.innerHTML = '<option value="" disabled selected>Seleziona un cliente</option>';
            clientId.innerHTML = '<option value="" disabled selected>Seleziona un cliente</option>';

            // Popola i dropdown con i nuovi clienti
            data.forEach(client => {
                const option1 = document.createElement("option");
                option1.value = client.id;
                option1.textContent = client.name;

                const option2 = option1.cloneNode(true);

                clientSelect.appendChild(option1);
                clientId.appendChild(option2);
            });
        })
        .catch(error => console.error("Errore durante l'aggiornamento dei dropdown:", error));
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
