package com.example.MarioFratarcangeli.service;

import com.example.MarioFratarcangeli.entity.ClientDetails;
import com.example.MarioFratarcangeli.repository.ClientDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientDetailsService {
    private final ClientDetailsRepository clientDetailsRepository;

    public ClientDetailsService(ClientDetailsRepository clientDetailsRepository) {
        this.clientDetailsRepository = clientDetailsRepository;
    }

    public List<ClientDetails> findAll() {
        return clientDetailsRepository.findAll();
    }
    public List<ClientDetails> findByClientId(Long clientId) {
        return clientDetailsRepository.findByClientId(clientId);
    }
    public ClientDetails save(ClientDetails clientDetails) {
        return clientDetailsRepository.save(clientDetails);
    }
}
