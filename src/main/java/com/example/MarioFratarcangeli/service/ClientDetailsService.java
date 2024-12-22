package com.example.MarioFratarcangeli.service;

import com.example.MarioFratarcangeli.entity.ClientDetails;
import com.example.MarioFratarcangeli.repository.ClientDetailsRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
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
    public Optional<BigDecimal> findLatestResidueByDate(Long clientId, Date date) {
        return clientDetailsRepository.findLatestResidueByDate(clientId, date);
    }
    public List<ClientDetails> findByClientIdOrderByDateDesc(Long clientId) {
        return clientDetailsRepository.findByClientIdOrderByDateDesc(clientId);
    }
    public void deleteById(Long id) {
        clientDetailsRepository.deleteById(id);
    }
    public ClientDetails save(ClientDetails clientDetails) {
        return clientDetailsRepository.save(clientDetails);
    }
}
