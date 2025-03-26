import { useEffect, useState } from "react";

export default function Create() {
  const [id, setId] = useState()
  const [client, setClient] = useState({
    name: "",
    birthDate: "",
    cpf:"",
    id:"",
    address: {
      city: "",
      num: "",
      state: "",
      street: "",
      zipCode: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCepSearch = async () => {
    if (client.address.zipCode.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${client.address.zipCode}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setClient((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            city: data.localidade,
            state: data.uf,
            street: data.logradouro,
          },
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  async function handleSave(){
    try{
      if(client.name.length == 0 || client.birthDate.length == 0 || client.cpf.length == 0){
        alert('É necessário preencher todos os campos do cliente.')
        return
      }

      const actualDate = new Date();
      const inputDate = new Date(client.birthDate);

      if(inputDate > actualDate){
        alert('A data deve ser válida.')
        return
      }

      const response = await fetch(`http://localhost:8080/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name:client.name, birthDate:client.birthDate, cpf:client.cpf}),
      })
      const data = await response.json();
      console.log(data)
      setClient({
        name: data.name,
        birthDate: data.birthDate,
        cpf:data.cpf,
        id:data.id,
        address: {
            city: data.address?.city,
            num: data.address?.num,
            state: data.address?.state,
            street: data.address?.street,
            zipCode: data.address?.zipCode
          }
      })
      setId(data.id)
      alert('Cliente criado com sucesso!')
    }catch(error){
      alert('Houve algum erro, tente novamente mais tarde.')
      console.log(error)
    }
  };

  async function handleCreateAddress(){

    try{
      if(!id){
        alert("É necessário salvar primeiro o usuário.")
        return
      }
      const response = await fetch(`http://localhost:8080/address/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client.address)
      })
      const data = await response.json();
      alert('Endereço cadastrado com sucesso!')
    }catch(error){
      alert('Houve algum erro, tente novamente mais tarde.')
      console.log(error)
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-12 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Cadastrar Cliente</h2>
      <label className="block">Nome:</label>
      <input className="border p-2 w-full mb-2" name="name" value={client.name} onChange={handleChange} />
      
      <label className="block">Data de Nascimento:</label>
      <input type="date" className="border p-2 w-full mb-4" name="birthDate" value={client.birthDate} onChange={handleChange} />
      <label className="block">CPF:</label>
      <input className="border p-2 w-full mb-4" name="cpf" value={client.cpf} onChange={handleChange} />
      <button className="bg-green-500 hover:bg-green-600 text-white w-full py-2 mt-4 cursor-pointer" onClick={handleSave}>Salvar</button>
      
      <h3 className="text-lg font-semibold mt-4">Endereço</h3>
      <div className="flex items-center gap-2">
        <input className="border p-2 flex-1" name="zipCode" value={client?.address?.zipCode} onChange={handleAddressChange} placeholder="CEP" />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer" onClick={handleCepSearch}>Buscar CEP</button>
      </div>
      
      <label className="block">Rua:</label>
      <input className="border p-2 w-full" name="street" value={client?.address?.street} onChange={handleAddressChange} />
      
      <label className="block">Número:</label>
      <input className="border p-2 w-full" name="num" value={client?.address?.num} onChange={handleAddressChange} />
      
      <label className="block">Cidade:</label>
      <input className="border p-2 w-full" name="city" value={client?.address?.city} onChange={handleAddressChange} />
      
      <label className="block">Estado:</label>
      <input className="border p-2 w-full" name="state" value={client?.address?.state} onChange={handleAddressChange} />
      
      <button className="bg-green-500 text-white w-full py-2 mt-4 cursor-pointer hover:bg-green-600" onClick={handleCreateAddress}>Salvar</button>
    </div>
  );
}