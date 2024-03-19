import { Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import AllCompanys from "./pages/AllCompany";
import AddCompany from "./components/modules/company/addCompany";
import UpdateCompany from "./components/modules/company/updateCompany";
import AllItems from "./pages/AllItems";
import AddItem from "./components/modules/item/addItem";
import UpdateItem from "./components/modules/item/updateItem";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Invoice from "./pages/Invoice";


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AllCompanys />}></Route>
        <Route path="/add-company" element={<AddCompany />}></Route>
        <Route path="/update-company/:id" element={<UpdateCompany />}></Route>
        <Route path="/item" element={<AllItems />}></Route>
        <Route path="/item/:id" element={<AllItems />}></Route>
        <Route path="/add-item" element={<AddItem />}></Route>
        <Route path="/update-item/:id" element={<UpdateItem />}></Route>
        <Route path="/cart" element={<Invoice />}></Route>
      </Routes>
    </Layout>
  );
}

export default App;