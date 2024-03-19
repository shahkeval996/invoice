import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getDatabase, ref, get, set } from "firebase/database";
import app from "../../../fireBaseConfig";

function UpdateCompany() {
  const companyName = useRef("");

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "item/companys/" + id);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const targetObject = snapshot.val();
        companyName.current.value = targetObject.name;
      }
    }
    fetchData();
  }, [id]);

  const updateCompanyHandler = () => {
    const db = getDatabase(app);
    const newDocRef = ref(db, "item/companys/" + id);
    set(newDocRef, {
      name: companyName.current.value
    }).then(() => {
      navigate("/");
    }).catch((error) => {
      console.error("error: ", error.message);
    })
  };

  return (
    <>
      <legend>Update</legend>
      <Form>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" ref={companyName} />
        </Form.Group>
        <Button variant="primary" type="button" onClick={updateCompanyHandler}>
          Update
        </Button>
      </Form>
    </>
  );
}
export default UpdateCompany;