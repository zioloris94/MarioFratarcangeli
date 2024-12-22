package com.example.MarioFratarcangeli.repository;

import com.example.MarioFratarcangeli.entity.ClientDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientDetailsRepository extends JpaRepository<ClientDetails, Long> {

    @Query(value = "SELECT c.residue FROM client_details c " +
            "WHERE c.client_id = :clientId AND c.date <= :date " +
            "ORDER BY c.date DESC, c.residue DESC LIMIT 1", nativeQuery = true)
    Optional<BigDecimal> findLatestResidueByDate(@Param("clientId") Long clientId, @Param("date") Date date);


    @Query("SELECT c FROM ClientDetails c WHERE c.id = :id")
    Optional<ClientDetails> findById(Long id);

    @Query("SELECT cd FROM ClientDetails cd " +
            "WHERE cd.client.id = :clientId " +
            "ORDER BY cd.date DESC, cd.id DESC")
    List<ClientDetails> findByClientIdOrderByDateDesc(@Param("clientId") Long clientId);
}
