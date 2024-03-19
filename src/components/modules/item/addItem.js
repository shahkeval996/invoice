import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, set, push } from "firebase/database";
import app from "../../../fireBaseConfig";

function AddItem() {
  const itemName = useRef("");
  const price = useRef("");
  const imageInput = useRef(null);
  const companyId = useRef("");
  const [companyList, setCompanyList] = useState([]);
  const navigate = useNavigate();
  const [file, setFile] = useState();

  function handleChange(e) {
    const file = imageInput.current.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result;
        setFile(base64String);
      };

      reader.readAsDataURL(file);
    }
  }

  const addItemHandler = () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "item/items"));
    set(newDocRef, {
      name: itemName.current.value,
      price: price.current.value ? Number(price.current.value) : 0,
      companyId: companyId.current.value,
      imageUrl: file,
    }).then(() => {
      navigate("/item");
    }).catch((error) => {
      console.error("error: ", error.message);
    })
  };

  useEffect(() => {
    async function fetchData() {
      const db = getDatabase(app);
      const dbRef = ref(db, "item/companys");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setCompanyList(Object.values(snapshot.val()));
      }
    }
    fetchData()
  }, []);
  return (
    <>
      <legend>Create</legend>
      <Form>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" ref={itemName} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" ref={price} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            ref={imageInput}
            accept="image/*"
            onChange={handleChange}
          />
        </Form.Group>
        {file && <img height={200} width={300} src={file} alt="imgName" />}
        <Form.Group className="mb-3" controlId="formCompanyId">
          <Form.Label>Company</Form.Label>
          <Form.Control as="select" ref={companyId}>
            {companyList.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="button" onClick={addItemHandler}>
          Add
        </Button>
      </Form>
    </>
  );
}

export default AddItem;
