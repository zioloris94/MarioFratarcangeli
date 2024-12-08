package com.example.MarioFratarcangeli.repository;

import com.example.MarioFratarcangeli.entity.ClientDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientDetailsRepository extends JpaRepository<ClientDetails, Long> { List<ClientDetails> findByClientId(Long clientId);}
