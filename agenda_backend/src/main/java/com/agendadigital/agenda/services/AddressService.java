package com.agendadigital.agenda.services;

import com.agendadigital.agenda.entities.Address;
import com.agendadigital.agenda.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    public Optional<Address> findById(Long id) {
        return addressRepository.findById(id);
    }

    public Address save(Address client) {
        return addressRepository.save(client);
    }

    public void delete(Long id) {
        addressRepository.deleteById(id);
    }
}
