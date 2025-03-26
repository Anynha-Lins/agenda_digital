package com.agendadigital.agenda.controller;

import com.agendadigital.agenda.entities.Client;
import com.agendadigital.agenda.entities.Contact;
import com.agendadigital.agenda.services.ClientService;
import com.agendadigital.agenda.services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ClientService clientService;

    @GetMapping
    public List<Contact> findAll() {
        return contactService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Contact> findById(@PathVariable Long id) {
        return contactService.findById(id);
    }

    @PostMapping("/{id}")
    public Contact create(@PathVariable Long id,@RequestBody Contact contact) {
        Client client = clientService.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        contact.setClient(client);

        return contactService.save(contact);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable Long id, @RequestBody Contact updateContact) {
        return contactService.findById(id).map(contact -> {
            contact.setType(updateContact.getType());
            contact.setValue(updateContact.getValue());
            contact.setObservation(updateContact.getObservation());
            return contactService.save(contact);
        }).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        contactService.delete(id);
    }
}
