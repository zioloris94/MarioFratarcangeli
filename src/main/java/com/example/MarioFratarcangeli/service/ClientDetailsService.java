package com.example.MarioFratarcangeli.service;

import com.example.MarioFratarcangeli.entity.ClientDetails;
import com.example.MarioFratarcangeli.repository.ClientDetailsRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ClientDetailsService {
    private final ClientDetailsRepository clientDetailsRepository;

    public ClientDetailsService(ClientDetailsRepository clientDetailsRepository) {
        this.clientDetailsRepository = clientDetailsRepository;
    }

    public List<ClientDetails> findAll() {
        return clientDetailsRepository.findAll();
    }

    public Optional<ClientDetails> findById(Long id) {
        return clientDetailsRepository.findById(id);
    }

    public List<ClientDetails> findByClientId(Long clientId) {
        return clientDetailsRepository.findByClientId(clientId);
    }
    public Optional<BigDecimal> findLatestResidue(Long clientId) {
        return clientDetailsRepository.findLatestResidue(clientId);
    }

    public Optional<BigDecimal> findHighestResidue(Long clientId) {
        return clientDetailsRepository.findHighestResidue(clientId);
    }
    public List<ClientDetails> findByClientIdOrderByDateAsc(Long clientId) {
        return clientDetailsRepository.findByClientIdOrderByDateAsc(clientId);
    }
    public List<ClientDetails> findByClientIdOrderByDateDesc(Long clientId) {
        return clientDetailsRepository.findByClientIdOrderByDateDesc(clientId);
    }
    public ClientDetails save(ClientDetails clientDetails) {
        return clientDetailsRepository.save(clientDetails);
    }
}
