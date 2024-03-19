import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getDatabase, ref, get, set } from "firebase/database";
import app from "../../../fireBaseConfig";

function UpdateItem() {
  const itemName = useRef("");
  const price = useRef("");
  const imageUrl = useRef("");
  const companyId = useRef("");

  const [companyList, setCompanyList] = useState([]);
  const [file, setFile] = useState();

  function handleChange(e) {
    const file = imageUrl.current.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result;
        setFile(base64String);
      };

      reader.readAsDataURL(file);
    }
  }
  
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "item/items/" + id);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const targetObject = snapshot.val();
        itemName.current.value = targetObject.name;
        price.current.value = targetObject.price;
        companyId.current.value = targetObject.companyId;
        setFile(targetObject.imageUrl)
      }
    }
    fetchData()
  }, [id]);

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

  const updateItemHandler = () => {
    const db = getDatabase(app);
    const newDocRef = ref(db, "item/items/" + id);
    set(newDocRef, {
      name: itemName.current.value,
      price: price.current.value ? Number(price.current.value) : 0,
      imageUrl: file,
      companyId: companyId.current.value,
    }).then(() => {
      navigate("/item");
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
            ref={imageUrl}
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
        <Button variant="primary" type="button" onClick={updateItemHandler}>
          Update
        </Button>
      </Form>
    </>
  );
}
export default UpdateItem;