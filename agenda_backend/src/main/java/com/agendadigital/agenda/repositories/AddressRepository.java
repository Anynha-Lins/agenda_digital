package com.agendadigital.agenda.repositories;

import com.agendadigital.agenda.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> { }
