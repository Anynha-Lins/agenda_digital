package com.agendadigital.agenda.services;

import com.agendadigital.agenda.dtos.ClientDto;
import com.agendadigital.agenda.entities.Client;
import com.agendadigital.agenda.entities.Contact;
import com.agendadigital.agenda.repositories.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<ClientDto> findAll() {

        return clientRepository.findAll()
                .stream()
                .map(client -> new ClientDto(client.getId(), client.getName(), client.getCpf(), client.getBirthDate()))
                .collect(Collectors.toList());
    }

    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    public List<Client> searchByCpfOrName(String cpf, String name) {
        return clientRepository.findByCpfContainingOrNameContaining(cpf, name);
    }

    public void existsByCpf(String cpf) {
        if (clientRepository.existsByCpf(cpf)) {
            throw new IllegalArgumentException("CPF já cadastrado no sistema.");
        }
    }

    public Client save(Client client) {
        validateClient(client);
        return clientRepository.save(client);
    }

    public Client update(Long id, Client updateClient) {
        validateName(updateClient.getName());
        validateBirthday(updateClient.getBirthDate());

        return clientRepository.findById(id).map(client -> {
            client.setName(updateClient.getName());
            client.setBirthDate(updateClient.getBirthDate());
            return clientRepository.save(client);

        }).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    private void validateClient(Client client) {
        validateName(client.getName());
        validateBirthday(client.getBirthDate());
        existsByCpf(client.getCpf());
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode estar vazio.");
        }
    }

    private void validateBirthday(LocalDate birthday) {
        LocalDate today = LocalDate.now();
        if (birthday == null) {
            throw new IllegalArgumentException("Data de aniversário não pode ser nula.");
        }
        if (birthday.isAfter(today)) {
            throw new IllegalArgumentException("Data de aniversário não pode ser no futuro.");
        }
        if (Period.between(birthday, today).getYears() > 100) {
            throw new IllegalArgumentException("Data de aniversário não pode ter mais de 100 anos.");
        }
    }

    public void delete(Long id) {
            clientRepository.deleteById(id);
    }

    public List<Contact> getClientContacts(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));
        return client.getContacts();
    }
}
