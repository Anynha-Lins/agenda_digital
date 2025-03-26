import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';

function Home() {
    const navigate = useNavigate();
    const [clients, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      fetchContacts();
    }, []);

    async function fetchContacts(){
      try {
        const response = await fetch("http://localhost:8080/client");
        if (!response.ok) throw new Error("Erro ao buscar contatos");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }


    async function search(){
      if(searchTerm.length == 0){
        await fetchContacts()
        return
      }
      try {
        const response = await fetch(`http://localhost:8080/client/search?name=${searchTerm}&cpf=${searchTerm}`);

        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error(error.message);
        alert('Nenhum cliente encontrado.')
      } finally {
        setLoading(false);
      }
    }


    async function handleDelete(id){
      if (window.confirm("Tem certeza que deseja excluir este contato?")) {
        try {
          const response = await fetch(`http://localhost:8080/client/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
          }});
  
          alert('Cliente excluído com sucesso')
        } catch (error) {
          console.error(error.message);
          alert('Não foi possível excluir, tente novamente mais tarde.')
        } finally {
          await fetchContacts()
        }
      }
    };

    if (loading) return <p className="text-center text-gray-500 mt-4">Carregando contatos...</p>;

    return (
      <div className="max-w-2xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Lista de Clientes</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={() => search()} // Chama a função de buscar quando clicado
            className="cursor-pointer p-2 bg-blue-500 text-white rounded-r-md flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 16a6 6 0 100-12 6 6 0 000 12zm6.293-2.293l4 4a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 1.414z"
              />
            </svg>
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {clients.map((client) => (
            <li key={client.id} className="flex justify-between items-center p-3 hover:bg-gray-100">
              <div>
                <p className="text-lg font-medium">{client.name}</p>
                <p className="text-sm text-gray-500"><strong className="text-gray-600">CPF - </strong> {client.cpf}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit/${client.id}`)}
                  className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Excluir
                </button>
                  <button
                    onClick={() => navigate(`/contact/${client.id}`)}
                    className="cursor-pointer px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                  Contato
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
export default Home