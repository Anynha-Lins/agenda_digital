package com.agendadigital.agenda.services;

import com.agendadigital.agenda.entities.Client;
import com.agendadigital.agenda.entities.Contact;
import com.agendadigital.agenda.repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    List<String> validTypes = List.of("email", "telefone");

    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    public Optional<Contact> findById(Long id) {
        return contactRepository.findById(id);
    }

    public Contact save(Contact contact) {
        validateValue(contact.getValue());
        validateType(contact.getType());
        return contactRepository.save(contact);
    }

    private void validateType(String type) {
        if (!validTypes.contains(type.toLowerCase())) {
            throw new IllegalArgumentException("Tipo inválido.");
        }
    }

    private void validateValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("O valor não pode estar vazio.");
        }
    }

    public void delete(Long id) {
        contactRepository.deleteById(id);
    }
}

