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
                    row.innerHTML = `
                        <td>${detail.date}</td>
                        <td>${detail.description}</td>
                        <td>${detail.hours}</td>
                        <td>${detail.amount}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Errore durante il recupero dei dettagli del cliente:", error));
    }
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
        .then(alert)
        .catch(error => {
            console.error("Errore:", error);
            alert("Errore durante il salvataggio");
        });
});

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
