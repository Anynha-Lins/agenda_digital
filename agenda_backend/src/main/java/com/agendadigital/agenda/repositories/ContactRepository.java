package com.agendadigital.agenda.repositories;

import com.agendadigital.agenda.entities.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> { }
