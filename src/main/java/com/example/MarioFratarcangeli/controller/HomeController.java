package com.example.MarioFratarcangeli.controller;
import com.example.MarioFratarcangeli.entity.ClientDetails;
import com.example.MarioFratarcangeli.service.ClientDetailsService;
import com.example.MarioFratarcangeli.service.ClientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        // Lista dei clienti per dropdown
        model.addAttribute("clientDetailsList", clientDetailsService.findAll());
        model.addAttribute("clientList", clientService.findAll());
        model.addAttribute("clientDetails", new ClientDetails());
        return "home";
    }

    @PostMapping("/save-client-details")
    public String saveClientDetails(@ModelAttribute("clientDetails") ClientDetails clientDetails, Model model) {
        clientDetailsService.save(clientDetails);
        model.addAttribute("success", true);
        return "redirect:/?success";
    }

    @GetMapping("/client-details/{clientId}")
    @ResponseBody
    public List<ClientDetails> getClientDetails(@PathVariable Long clientId) {
        List<ClientDetails> details = clientDetailsService.findByClientId(clientId);
        return details;
    }
}
