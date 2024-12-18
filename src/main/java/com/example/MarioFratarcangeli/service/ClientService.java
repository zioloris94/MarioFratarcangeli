package com.example.MarioFratarcangeli.service;

import com.example.MarioFratarcangeli.entity.Client;
import com.example.MarioFratarcangeli.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> findAll() {
        return clientRepository.findAll();
    }
    public void save(Client client) {
        clientRepository.save(client);
    }
    public Client findById(Long id) {return clientRepository.findById(id).orElse(null);}
}
