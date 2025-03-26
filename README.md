# Documentação Agenda Comércio SA

### **Introdução**

- Este projeto tem como objetivo a digitalização de contatos da Empresa Comércio SA, substituindo a agenda física pelo sistema online. A aplicação permite cadastrar, editar, excluir e consultar clientes e seus contatos.

### **Tecnologias Utilizadas**

| Camada | Tecnologia |
| --- | --- |
| **Frontend** | React, Fetch API, Tailwind CSS |
| **Backend** | Java, Spring Boot |
| **Banco de Dados** | MySQL |
| **Comunicação** | API REST (JSON) |

### **Requisitos Funcionais e Implementação**

### **RF01: Cadastro de clientes (Nome, CPF, Data de Nascimento e Endereço)**

- Implementado no método `save(Client client)`, que:
    1. **Valida os dados** do cliente (`validateClient()`).
    2. **Verifica se o CPF já está cadastrado** (`existsByCpf()`).
    3. **Salva o cliente** no banco de dados com `clientRepository.save(client)`.
    
    ```java
    public Client save(Client client) {
        validateClient(client);
        return clientRepository.save(client);
    }
    
    ```
    

---

### **RF02: Edição dos dados de um cliente**

- Implementado no método `update(Long id, Client updateClient)`, que:
    1. **Verifica se o cliente existe** pelo `id`.
    2. **Valida o nome e a data de nascimento** antes da atualização.
    3. **Atualiza os dados** e salva no banco.
    
    ```java
    public Client update(Long id, Client updateClient) {
        validateName(updateClient.getName());
        validateBirthday(updateClient.getBirthDate());
    
        return clientRepository.findById(id).map(client -> {
            client.setName(updateClient.getName());
            client.setBirthDate(updateClient.getBirthDate());
            return clientRepository.save(client);
        }).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }
    
    ```
    

---

### **RF03: Exclusão de um cliente**

- Implementado no método `delete(Long id)`, que:
    1. **Chama `deleteById(id)` do `clientRepository`** para remover o cliente do banco.
    
    ```java
    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
    
    ```
    

---

### **RF04: Listagem de todos os clientes cadastrados**

- Implementado no método `findAll()`, que:
    1. **Recupera todos os clientes do banco** (`clientRepository.findAll()`).
    2. **Converte para DTO (`ClientDto`)** para evitar expor a entidade completa.
    
    ```java
    public List<ClientDto> findAll() {
        return clientRepository.findAll()
                .stream()
                .map(client -> new ClientDto(client.getId(), client.getName(), client.getCpf(), client.getBirthDate()))
                .collect(Collectors.toList());
    }
    
    ```
    

---

### **RF05: Busca de um cliente pelo Nome ou CPF**

- Implementado no método `searchByCpfOrName(String cpf, String name)`, que:
    1. **Chama o método `findByCpfOrName` do `clientRepository`** para buscar clientes pelo CPF ou Nome.
    
    ```java
    public List<Client> searchByCpfOrName(String cpf, String name) {
        return clientRepository.findByCpfOrName(cpf, name);
    }
    
    ```
    

---

### **RF06: Cadastro de contatos para um cliente**

- Implementado no método `getClientContacts(Long clientId)`, que:
    1. **Busca o cliente pelo `id`** no `clientRepository`.
    2. **Retorna a lista de contatos associados** ao cliente.
    
    ```java
    public List<Contact> getClientContacts(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));
        return client.getContacts();
    }
    
    ```
    

---

### **RF07: Edição dos contatos de um cliente**

- Implementado no método **`update(Long id, Contact updatedContact)`** *(ainda não presente, mas pode ser adicionado)*, seguindo esta lógica:
    1. **Verifica se o contato existe** (`findById(id)`).
    2. **Valida o tipo e o valor** antes da atualização.
    3. **Atualiza os dados e salva no banco**.

📌 **Implementação sugerida para atender ao RF07:**

```java
public Contact update(Long id, Contact updatedContact) {
    return contactRepository.findById(id).map(contact -> {
        validateType(updatedContact.getType());
        validateValue(updatedContact.getValue());

        contact.setType(updatedContact.getType());
        contact.setValue(updatedContact.getValue());
        contact.setObservation(updatedContact.getObservation());

        return contactRepository.save(contact);
    }).orElseThrow(() -> new RuntimeException("Contato não encontrado"));
}

```

---

### **RF08: Exclusão de um contato de um cliente**

- Implementado no método **`delete(Long id)`**, que:
    1. **Chama `deleteById(id)` no `contactRepository`** para remover o contato do banco.

📌 **Código existente atende ao RF08:**

```java
public void delete(Long id) {
    contactRepository.deleteById(id);
}

```

---

### **RF09: Listagem de todos os contatos de um cliente**

- O método `getClientContacts(Long clientId)` retorna a lista de contatos vinculados ao cliente, atendendo a esse requisito.

---

### **Resumo Atualizado**

| **RF** | **Método Implementado** | **Descrição** |
| --- | --- | --- |
| **RF01** | `save(Client client)` | Valida e cadastra clientes no banco |
| **RF02** | `update(Long id, Client updateClient)` | Atualiza nome e data de nascimento do cliente |
| **RF03** | `delete(Long id)` | Remove um cliente do banco |
| **RF04** | `findAll()` | Retorna uma lista de clientes cadastrados como `ClientDto` |
| **RF05** | `searchByCpfOrName(String cpf, String name)` | Busca clientes pelo CPF ou Nome |
| **RF06** | `getClientContacts(Long clientId)` | Retorna os contatos de um cliente |
| **RF07** | `update(Long id, Contact updatedContact)` | Valida e edita um contato de um cliente |
| **RF08** | `delete(Long id)` | Exclui um contato do banco de dados |
| **RF09** | `getClientContacts(Long clientId)` | Retorna a lista de contatos vinculados ao cliente |

### **Regras de Negócio**

### **RN01: Os campos Nome e CPF são obrigatórios no cadastro do cliente**

```java
private void validateClient(Client client) {
    validateName(client.getName());
    existsByCpf(client.getCpf());
}

```

- O CPF também é obrigatório devido à anotação `@Column(unique = true)` na entidade `Client`:
    
    ```java
    @Column(unique = true)
    private String cpf;
    
    ```
    

---

### **RN02: Os campos Tipo do Contato e Valor do Contato são obrigatórios no cadastro do contato**

```java
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

```

- Assim, se o tipo ou valor do contato forem inválidos ou vazios, uma exceção será lançada.

---

### **RN03: O CPF informado deve ser único no sistema**

- O campo CPF possui a restrição `unique = true` no banco de dados:
    
    ```java
    @Column(unique = true)
    private String cpf;
    
    ```
    
- Além disso, o método `existsByCpf(String cpf)` no `ClientService` impede cadastros duplicados:
    
    ```java
    public void existsByCpf(String cpf) {
        if (clientRepository.existsByCpf(cpf)) {
            throw new IllegalArgumentException("CPF já cadastrado no sistema.");
        }
    }
    
    ```
    

---

### **RN04: O Nome do cliente não pode estar vazio**

- O método `validateName(String name)` no `ClientService` impede que um nome vazio seja salvo:
    
    ```java
    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode estar vazio.");
        }
    }
    
    ```
    

---

### **RN05: A Data de Nascimento deve ser válida**

- Implementado no método `validateBirthday(LocalDate birthday)`, que:
    1. Verifica se a data não é nula.
    2. Impede datas futuras.
    3. Restringe idades acima de 100 anos.

```java
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

```

---

### **RN06: Um cliente pode ter mais de um contato cadastrado**

- O relacionamento **1 para N** entre `Client` e `Contact` garante isso.
- No `ContactService`, o método `save(Contact contact)` permite o cadastro de novos contatos para um cliente.
- Exemplo de obtenção dos contatos de um cliente:
    
    ```java
    public List<Contact> getClientContacts(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));
        return client.getContacts();
    }
    
    ```
    
- No frontend, os contatos do cliente são listados em uma página específica.

---

### **RN07: Ao excluir um cliente, todos os seus contatos devem ser removidos do sistema**

- No código atual do `ClientService`, o método `delete(Long id)` remove o cliente, mas não há confirmação de que os contatos associados são excluídos automaticamente.
- Para garantir isso, a entidade `Client` deve possuir a anotação `@OneToMany(cascade = CascadeType.ALL)`:
    
    ```java
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts;
    
    ```
    
- Se essa configuração estiver aplicada, a exclusão do cliente removerá todos os seus contatos automaticamente.

---

### **RN08: O sistema deve validar os dados informados antes de permitir o cadastro ou edição**

- Implementado em várias partes do código:
    - `validateClient(Client client)`: valida CPF e nome.
    - `validateName(String name)`: impede nome vazio.
    - `validateBirthday(LocalDate birthday)`: valida a data de nascimento.
    - `validateType(String type)`: impede tipos inválidos de contato.
    - `validateValue(String value)`: impede valores vazios em contatos.

```java
public Client save(Client client) {
    validateClient(client);
    return clientRepository.save(client);
}

```

```java
public Contact update(Long id, Contact updatedContact) {
    return contactRepository.findById(id).map(contact -> {
        validateType(updatedContact.getType());
        validateValue(updatedContact.getValue());

        contact.setType(updatedContact.getType());
        contact.setValue(updatedContact.getValue());
        contact.setObservation(updatedContact.getObservation());

        return contactRepository.save(contact);
    }).orElseThrow(() -> new RuntimeException("Contato não encontrado"));
}

```

---

### 5. **Diagrama de Entidade e Relacionamento (ER)**

```
+----------------+        +----------------+        +----------------+
|    client      |        |     address    |        |    contact     |
+----------------+        +----------------+        +----------------+
| id             |<-------| id             |        | id             |
| name           |        | street         |        | type           |
| cpf            |        | num            |        | value          |
| birth_date     |        | city           |        | observation    |
| address_id     |--------| state          |        | client_id      |
+----------------+        | zip_code       |        +----------------+
                         +----------------+

```

### **Arquitetura do Sistema**

O sistema foi dividido em três camadas principais:

1. **Frontend**:
    - Desenvolvido em **React**, responsável pela interface do usuário e pela interação com o backend.
2. **Backend**:
    - Construído com **Spring Boot**, que oferece uma API REST para comunicação com o frontend.
    - **Spring Data JPA** é utilizado para a persistência no banco de dados.
3. **Banco de Dados**:
    - **MySQL** armazena os dados de clientes e contatos.

---

### **Instruções de Uso**

### **Instruções de Uso**

### **1. Requisitos do Sistema**

- **Java**: A aplicação foi desenvolvida utilizando a **versão 17** do Java.
- **Banco de Dados**: MySQL ou banco de dados compatível com JDBC.
- **Ferramentas de Desenvolvimento**:
    - **IDE** (como IntelliJ IDEA, Eclipse ou VS Code).
    - **Node.js** (para o frontend, caso esteja usando React ou outras tecnologias).
    - **Maven**  (para o gerenciamento de dependências no backend).

### **2. Configuração do Banco de Dados**

1. **Criação do Banco de Dados**:
    - Certifique-se de que o banco de dados **agenda_digital** esteja criado no MySQL.
2. **Configuração do `application.properties`**(para conexão com o banco de dados):
    - Abra o arquivo `src/main/resources/application.properties`_digital e configure a conexão com o banco de dados:
    
    ```
    spring.datasource.url=jdbc:mysql://localhost:3306/agenda_digital
    spring.datasource.username=root
    spring.datasource.password=senha
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
    
    ```
    
3. **Rodando o Backend**:
    - Abra sua IDE e execute a classe principal do projeto `@AgendaApplication`
    - Isso iniciará o servidor localmente no **localhost:8080** (caso não abra, verificar se a porta foi configurada para outro número).
4. **Spring Boot Initializer**:
    - Para criar ou configurar projetos com **Java 17**, você pode usar o **Spring Boot Initializer** ([https://start.spring.io/](https://start.spring.io/)), selecionando a versão **Java 17** no campo **Project Metadata**.
    - Além disso, o Spring Boot Initializer permite gerar projetos com as dependências necessárias já configuradas.

### **4. Configuração do Frontend**

1. **Instalar Dependências do Frontend**:
    - Para usar o React, vá para a pasta do frontend (onde o código do React está localizado) e execute o seguinte comando para instalar as dependências ou no cmd local:
        
        ```bash
        npm install
        
        ```
        
2. **Rodando o Frontend**:
    - Após a instalação das dependências, execute o seguinte comando para iniciar o servidor de desenvolvimento:
        
        ```bash
        npm run dev
        
        ```
        
    - O servidor estará disponível no **localhost: 5173**

### **5. Acessando a Aplicação (Certifique-se de que as portas estão livres)**

- **Backend**: A API estará disponível em [**http://localhost:8080**](http://localhost:8080/).
- **Frontend**: A interface estará disponível em [http://localhost:5173/](http://localhost:5173/)

### **Dependências**

### **Backend (Spring Boot)**

Para o backend, usar as dependências instaladas com o **Maven**. São elas:

1. **Spring Boot Starter Web**: Para criar aplicações web com Spring Boot, que inclui RESTful APIs.
    
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    ```
    
2. **Spring Boot Starter Data JPA**: Para integração com bancos de dados relacionais usando JPA e Hibernate.
    
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    ```
    
3. **Lombok**: Para reduzir o código (getters, setters, construtores) com anotações do Lombok.
    
    ```xml
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
    
    ```
    
4. **MySQL Driver**: Para comunicação com o banco de dados MySQL.
    
    ```xml
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    
    ```
    
5. **Spring Boot Starter Validation**: Para validações de entrada de dados.
    
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    ```
    

### **Instalando as Dependências (Maven)**

Para instalar as dependências no backend com Maven, basta executar o comando:

```bash
mvn clean install

```

---

### **Frontend (React)**

Para o frontend, a biblioteca principal foi **React**, as dependências utilizadas em conjunto são:

1. **React**: A biblioteca principal para a construção da interface.
    
    ```bash
    npm create vite@latest agenda_virtual --template react
    
    ```
    
2. **React Router DOM**: Para gerenciamento de navegação entre páginas no frontend.
    
    ```bash
    npm install react-router-dom
    
    ```
    
3. **Tailwind CSS**: Para o estilo da aplicação utilizando classes utilitárias.
    
    ```bash
    npm install tailwindcss
    
    ```
    
4. **Vite**: Ferramenta de build e boiler plate para diversas bibliotecas.
    
    ```bash
    npm install vite
    
    ```
    
5. **Fetch API**: Para realizar requisições HTTP. O **Fetch API** é uma interface nativa do JavaScript que permite fazer requisições assíncronas diretamente, substituindo o **Axios**.
    
    Para usar o `fetch`, você pode usar diretamente em seu código React:
    
    ```jsx
    fetch('url-do-endpoint', {
        method: 'GET', // ou 'POST', 'PUT', etc.
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Erro:', error));
    
    ```
    

### **Instalando as Dependências (React)**

Para instalar as dependências no frontend com npm, basta executar o comando:

```bash
npm install

```

---

Essas dependências são necessárias para a construção do seu projeto tanto no **backend** quanto no **frontend**, e você pode configurar o projeto para rodar corretamente em sua máquina local.

### **Script de Banco de Dados**

```sql
DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `street` varchar(255) DEFAULT NULL,
  `num` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `address_id` (`address_id`),
  UNIQUE KEY `unique_cpf` (`cpf`),
  CONSTRAINT `FK_client_address` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `client_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_contact_client` (`client_id`),
  CONSTRAINT `FK_contact_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

```

###
