import { Link } from "react-router";
import logo from "../../assets/images/logo.jpeg"

function Navbar() {
    return (
      <div className="flex w-full">
          <img src={logo} alt="Logo da empresa" width={100}/>
          <nav className="flex w-full justify-center items-center gap-6 bg-gray-800 p-4 text-white">
            <Link to="/" className="hover:text-gray-400 hover:bg-blue-500 bg-blue-800 p-3 w-[100px] text-center rounded-lg">Listar</Link>
            <Link to="/create" className="hover:text-gray-400 hover:bg-blue-500 bg-blue-800 p-3  w-[100px] text-center rounded-lg">Criar novo</Link>
          </nav>
      </div>
    );
}

export default Navbar;