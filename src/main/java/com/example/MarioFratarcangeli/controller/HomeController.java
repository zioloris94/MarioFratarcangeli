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
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class HomeController {
    private final ClientService clientService;
    private final ClientDetailsService clientDetailsService;

    public HomeController(ClientService clientService, ClientDetailsService clientDetailsService) {
        this.clientService = clientService;
        this.clientDetailsService = clientDetailsService;
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

            // Creazione e popolamento di ClientDetails
            ClientDetails clientDetails = new ClientDetails();
            clientDetails.setClient(client);

            // Parsing e impostazione della data
            String dateString = payload.get("date").toString();
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
            clientDetails.setDate(formatter.parse(dateString));

            // Impostazione degli altri campi
            clientDetails.setDescription(payload.get("description").toString());
            clientDetails.setHours(Integer.valueOf(payload.get("hours").toString()));
            clientDetails.setRatePerHour(new BigDecimal(payload.get("ratePerHour").toString()));
            clientDetails.setTravelCost(new BigDecimal(payload.get("travelCost").toString()));
            clientDetails.setAmount(new BigDecimal(payload.get("amount").toString()));
            clientDetails.setNumber_people_work(Integer.valueOf(payload.get("number_people_work").toString()));

            // Salvataggio dei dati
            clientDetailsService.save(clientDetails);

            return ResponseEntity.ok("Lavoro salvato con successo!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore durante il salvataggio del lavoro.");
        }
    }



    @GetMapping("/client-details/{clientId}")
    @ResponseBody
    public List<ClientDetails> getClientDetails(@PathVariable Long clientId) {
        return clientDetailsService.findByClientId(clientId);
    }
}
