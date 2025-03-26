package com.agendadigital.agenda.controller;

import com.agendadigital.agenda.entities.Address;
import com.agendadigital.agenda.entities.Client;
import com.agendadigital.agenda.repositories.ClientRepository;
import com.agendadigital.agenda.services.AddressService;
import com.agendadigital.agenda.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/address")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public List<Address> findAll() {
        return addressService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Address> findById(@PathVariable Long id) {
        return addressService.findById(id);
    }

    @PostMapping("/{id}")
    public Address create(@PathVariable Long id,@RequestBody Address address) {
        Client client = clientService.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Address savedAddress = addressService.save(address);
        client.setAddress(savedAddress);
        clientRepository.save(client);
        return savedAddress;
    }

    @PutMapping("/{id}")
    public Address update(@PathVariable Long id, @RequestBody Address updateAddress) {
        return addressService.findById(id).map(address -> {
            address.setStreet(updateAddress.getStreet());
            address.setNum(updateAddress.getNum());
            address.setCity(updateAddress.getCity());
            address.setState(updateAddress.getState());
            address.setZipCode(updateAddress.getZipCode());
            return addressService.save(address);
        }).orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        addressService.delete(id);
    }
}
