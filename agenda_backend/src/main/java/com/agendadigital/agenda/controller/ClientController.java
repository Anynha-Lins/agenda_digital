package com.agendadigital.agenda.controller;

import com.agendadigital.agenda.dtos.ClientDto;
import com.agendadigital.agenda.entities.Client;
import com.agendadigital.agenda.entities.Contact;
import com.agendadigital.agenda.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/client")
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public List<ClientDto> findAll() {
        return clientService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Client> findById(@PathVariable Long id) {
        return clientService.findById(id);
    }

    @PostMapping
    public Client create(@RequestBody Client client) {
        return clientService.save(client);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client updateClient) {
        return clientService.update(id, updateClient);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String name) {

        // Se ambos cpf e name forem nulos, retorna uma resposta vazia ou pode lançar um erro
        if (cpf == null && name == null) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        // Chama o método do repositório para buscar por CPF ou Nome
        List<Client> clients = clientService.searchByCpfOrName(cpf, name);

        if (clients.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retorna 204 se não encontrar resultados
        }

        return ResponseEntity.ok(clients); // Retorna 200 com a lista de clientes encontrados
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }

    @GetMapping("/{id}/contacts")
    public List<Contact> getClientContacts(@PathVariable Long clientId) {
        return clientService.getClientContacts(clientId);
    }
}
