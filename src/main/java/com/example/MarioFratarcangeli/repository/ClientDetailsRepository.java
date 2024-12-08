package com.example.MarioFratarcangeli.repository;

import com.example.MarioFratarcangeli.entity.ClientDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientDetailsRepository extends JpaRepository<ClientDetails, Long> {
    @Query("SELECT c.residue FROM ClientDetails c WHERE c.client.id = :clientId ORDER BY c.id DESC")
    Optional<BigDecimal> findLatestResidue(@Param("clientId") Long clientId);
    List<ClientDetails> findByClientId(Long clientId);
    @Query("SELECT cd FROM ClientDetails cd WHERE cd.client.id = :clientId ORDER BY cd.date ASC")
    List<ClientDetails> findByClientIdOrderByDateAsc(@Param("clientId") Long clientId);
    @Query("SELECT cd FROM ClientDetails cd WHERE cd.client.id = :clientId ORDER BY cd.date DESC")
    List<ClientDetails> findByClientIdOrderByDateDesc(@Param("clientId") Long clientId);
}
