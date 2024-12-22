package com.example.MarioFratarcangeli.controller;
import com.example.MarioFratarcangeli.entity.Client;
import com.example.MarioFratarcangeli.entity.ClientDetails;
import com.example.MarioFratarcangeli.service.ClientDetailsService;
import com.example.MarioFratarcangeli.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class HomeController {
    private final ClientService clientService;
    private final ClientDetailsService clientDetailsService;

    public HomeController(ClientService clientService, ClientDetailsService clientDetailsService) {
        this.clientService = clientService;
        this.clientDetailsService = clientDetailsService;
    }
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
    @GetMapping("/")
    public String showHomePage(Model model) {
        model.addAttribute("clientDetailsList", clientDetailsService.findAll());
        model.addAttribute("clientList", clientService.findAll());
        model.addAttribute("clientDetails", new ClientDetails());
        return "home";
    }

    @PostMapping("/save-client-details")
    public ResponseEntity<String> saveClientDetails(@RequestBody Map<String, Object> payload) {
        try {
            // Recupero del Client tramite clientId
            Long clientId = Long.valueOf(payload.get("clientId").toString());
            Client client = clientService.findById(clientId);

            // Parsing e impostazione dei campi comuni
            String dateString = payload.get("date").toString();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            Date date = formatter.parse(dateString);

            String description = payload.get("description").toString();
            int hours = Integer.valueOf(payload.get("hours").toString());
            BigDecimal ratePerHour = new BigDecimal(payload.get("ratePerHour").toString());
            BigDecimal travelCost = new BigDecimal(payload.get("travelCost").toString());
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            Integer numberOfPeople = Integer.valueOf(payload.get("number_people_work").toString());

            // Crea più righe per ogni persona
            for (int i = 0; i < numberOfPeople; i++) {
                ClientDetails clientDetails = new ClientDetails();
                clientDetails.setClient(client);
                clientDetails.setDate(date);
                clientDetails.setDescription(description);
                clientDetails.setHours(hours);
                clientDetails.setRatePerHour(ratePerHour);
                clientDetails.setTravelCost(travelCost);
                BigDecimal amountForSinglePeople = amount.divide(new BigDecimal(numberOfPeople), 2, BigDecimal.ROUND_HALF_UP);
                clientDetails.setAmount(amountForSinglePeople);
                BigDecimal latestResidueByDate = clientDetailsService.findLatestResidueByDate(clientId, date).orElse(BigDecimal.ZERO);
                clientDetails.setResidue(latestResidueByDate.add(amountForSinglePeople));
                clientDetails.setNumber_people_work(Integer.valueOf(1));
                clientDetailsService.save(clientDetails);
            }

            return ResponseEntity.ok("Lavoro salvato con successo!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore durante il salvataggio del lavoro.");
        }
    }

    @PutMapping("/update-client-details")
    public ResponseEntity<String> updateClientDetails(@RequestBody Map<String, Object> payload) {
        try {
            Long id = Long.parseLong(payload.get("id").toString());
            Optional<ClientDetails> optionalDetail = clientDetailsService.findById(id);
            if (!optionalDetail.isPresent()) {
                return ResponseEntity.badRequest().body("ClientDetails non trovato.");
            }
            ClientDetails detail = optionalDetail.get();
            String dateString = payload.get("date").toString();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            detail.setDate(formatter.parse(dateString));
            detail.setDescription(payload.get("description").toString());
            detail.setRatePerHour(new BigDecimal(payload.get("ratePerHour").toString()));
            detail.setTravelCost(new BigDecimal(payload.get("travelCost").toString()));
            detail.setNumber_people_work(Integer.parseInt(payload.get("number_people_work").toString()));
            detail.setHours(Integer.parseInt(payload.get("hours").toString()));
            detail.setAmount(new BigDecimal(payload.get("amount").toString()));
            detail.setResidue(new BigDecimal(payload.get("residue").toString()));
            clientDetailsService.save(detail);
            return ResponseEntity.ok("Dettagli aggiornati con successo!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore durante il salvataggio del lavoro.");
        }
    }

    @DeleteMapping("/client-details/{id}")
    public ResponseEntity<String> deleteClientDetails(@PathVariable Long id) {
        try {
            clientDetailsService.deleteById(id);
            return ResponseEntity.ok("Dettaglio cliente eliminato con successo!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante l'eliminazione del dettaglio cliente.");
        }
    }

    @GetMapping("/client-details/{clientId}")
    @ResponseBody
    public List<ClientDetails> getClientDetails(@PathVariable Long clientId) {
        return clientDetailsService.findByClientIdOrderByDateDesc(clientId);
    }

    @GetMapping("/client-list")
    @ResponseBody
    public List<Client> getClientList() {
        return clientService.findAll();
    }


    @PostMapping("/save-client")
    public ResponseEntity<String> saveClient(@RequestBody Map<String, String> payload) {
        try {
            // Estrai il nome del cliente dal payload
            String clientName = payload.get("name");
            if (clientName == null || clientName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Il nome del cliente è obbligatorio.");
            }

            // Crea e salva il nuovo cliente
            Client client = new Client();
            client.setName(clientName.trim());
            clientService.save(client);

            return ResponseEntity.status(HttpStatus.CREATED).body("Cliente aggiunto con successo!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante l'aggiunta del cliente.");
        }
    }

}
