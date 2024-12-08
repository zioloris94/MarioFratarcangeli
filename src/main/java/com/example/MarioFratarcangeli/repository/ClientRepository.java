package com.example.MarioFratarcangeli.repository;

import com.example.MarioFratarcangeli.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}
