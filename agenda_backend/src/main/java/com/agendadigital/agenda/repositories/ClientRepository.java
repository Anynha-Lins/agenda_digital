package com.agendadigital.agenda.repositories;

import com.agendadigital.agenda.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    // Pesquisa por CPF
    List<Client> findByCpfContaining(String cpf);

    // Pesquisa por Nome
    List<Client> findByNameContaining(String name);

    // Pesquisa por CPF ou Nome
    List<Client> findByCpfContainingOrNameContaining(String cpf, String name);

    boolean existsByCpf(String cpf);
}

