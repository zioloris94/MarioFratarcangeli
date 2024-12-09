package com.example.MarioFratarcangeli.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "client_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "client")
@JsonIgnoreProperties("client")
public class ClientDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "date")
    private Date date;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "hours")
    private Integer hours;

    @Column(name = "rate_per_hour")
    private BigDecimal ratePerHour;

    @Column(name = "travel_cost")
    private BigDecimal travelCost = new BigDecimal(0);

    @Column(name = "amount")
    private BigDecimal amount = new BigDecimal(0);

    @Column(name = "advance_payment")
    private BigDecimal advancePayment = new BigDecimal(0);
    @Column(name = "number_people_work")
    private Integer number_people_work;

    @Column(name = "residue")
    private BigDecimal residue = new BigDecimal(0);
}
