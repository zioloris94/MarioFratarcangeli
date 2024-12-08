package com.example.MarioFratarcangeli.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "clientDetails")
@JsonIgnoreProperties("clientDetails")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Long id;

    @Column(name = "client_name", nullable = false, length = 255)
    private String name;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClientDetails> details;
}
