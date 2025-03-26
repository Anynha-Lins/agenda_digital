import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Contact() {
  const { id } = useParams();
  const [client, setClient] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ type: "", value: "", observation: "" });

  useEffect(() => {
    fetchClient();
  }, [id]);

  async function fetchClient(){
    try {
      const res = await fetch(`http://localhost:8080/client/${id}`);
      const data = await res.json();
      setClient(data);
    } catch (err) {
        alert("Houve algum erro, tente mais tarde.")
      console.error("Erro ao buscar cliente");
    }
  }

  async function handleSaveContact(){
    try {
        if(newContact.type.length == 0 || newContact.value.length == 0 || newContact.value.length == 0){
            alert('É necessário preencher todas as informações.')
            return
        }
        const response = await fetch(`http://localhost:8080/contact/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newContact),
          })
        const data = await response.json();
        alert('Contato criado com sucesso!')
        setIsModalOpen(false)
        fetchClient()
      } catch (error) {
        alert("Houve algum erro, tente mais tarde.")
        console.error("Erro ao buscar cliente", error);
      }
  }

  async function handleDelete(id){
    if (window.confirm("Tem certeza que deseja excluir este contato?")) {
        try{
            const response = await fetch(`http://localhost:8080/contact/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })
            alert("Contato excluído com sucesso!")
            fetchClient()
        }catch(error){
            alert("Houve algum erro, tente mais tarde.")
            console.error(error);
        }
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold">{client?.name}</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-green-600">
            Adicionar
        </button>
        </div>
        <ul>
        {client?.contacts?.length > 0 ? client.contacts.map((contact) => (
            <li
            key={contact.id}
            className="flex justify-between items-center border-b py-2"
            >
            <div>
                <p className="text-sm font-medium">{contact.type}: {contact.value}</p>
                <p className="text-xs text-gray-500">{contact.observation}</p>
            </div>
            <button
                onClick={() => handleDelete(contact.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
            >
                Excluir
            </button>
            </li>
        )): <p>Nenhum contato registrado.</p>}
        </ul>

        {isModalOpen && (
            <div className=" fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-lg font-semibold">Adicionar Contato</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 cursor-pointer hover:text-gray-700">
                    X
                </button>
                </div>
                <div className="mb-2">
                <label className="block text-sm font-medium">Tipo</label>
                <select 
                    value={newContact.type}
                    onChange={(e) => setNewContact({ ...newContact, type: e.target.value })} 
                    className="w-full border rounded p-1"
                >
                    <option value="">Selecione um tipo</option>
                    <option value="email">Email</option>
                    <option value="telefone">Telefone</option>
                </select>
                </div>
                <div className="mb-2">
                <label className="block text-sm font-medium">Valor</label>
                <input 
                    type="text" 
                    value={newContact.value} 
                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })} 
                    className="w-full border rounded p-1"
                />
                </div>
                <div className="mb-2">
                <label className="block text-sm font-medium">Observação</label>
                <input 
                    type="text" 
                    value={newContact.observation} 
                    onChange={(e) => setNewContact({ ...newContact, observation: e.target.value })} 
                    className="w-full border rounded p-1"
                />
                </div>
                <button 
                onClick={handleSaveContact} 
                className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                Salvar
                </button>
            </div>
            </div>
        )}
    </div>
  );
}