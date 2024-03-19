import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../../../fireBaseConfig";

function AddCompany() {
  const companyName = useRef("");

  const navigate = useNavigate();

  const addCompanyHandler = () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "item/companys"));
    set(newDocRef, {
      name: companyName.current.value,
    }).then(() => {
      navigate("/");
    }).catch((error) => {
      console.error("error: ", error.message);
    })
  }
  return (
    <>
      <legend>Create</legend>
      <Form>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" ref={companyName} />
        </Form.Group>
        <Button variant="primary" type="button" onClick={addCompanyHandler}>
          Add
        </Button>
      </Form>
    </>
  );
}

export default AddCompany;