import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import DeleteConfirmation from "../../shared/DeleteConfirmation";
import { getDatabase, ref, get, remove, push, set } from "firebase/database";
import app from "../../../fireBaseConfig";

function ItemList() {
  const [allItems, setAllItems] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const db = getDatabase(app);
      const dbRef = ref(db, "item/items");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const myData = snapshot.val();
        const temporaryArray = Object.keys(myData).map( myItemsId => {
            return {
                ...myData[myItemsId],
                myItemsId: myItemsId
            }
        } )
        if (id) {
          setAllItems(temporaryArray.filter((x) => x.companyId === id));
        } else {
          setAllItems(temporaryArray);
        }
      }
    }
    fetchData()
  }, [id]);

  const openConfirmDeleteModalHandler = (id) => {
    setShowModal(true);
    setItemToDeleteId(id);
  };

  const hideDeleteModalHandler = () => {
    setShowModal(false);
    setItemToDeleteId(0);
  };

  const confirmDeleteHandler = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "item/items/" + itemToDeleteId);
    await remove(dbRef);

    setAllItems((previousState) => {
      return previousState.filter((_) => _.myItemsId !== itemToDeleteId);
    });
    setItemToDeleteId(0);
    setShowModal(false);
  };

  const addToCart = (name, price, imageUrl) => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "item/cart"));
    set(newDocRef, {
      name,
      price,
      imageUrl,
    }).then(() => {
      // navigate("/");
    }).catch((error) => {
      console.error("error: ", error.message);
    })
  };

  return (
    <>
      <DeleteConfirmation
        showModal={showModal}
        hideDeleteModalHandler={hideDeleteModalHandler}
        title="Delete Confirmation"
        body="Are you want delete this itme?"
        confirmDeleteHandler={confirmDeleteHandler}
      ></DeleteConfirmation>
      <Row className="mt-2 mb-2">
        <Col md={{ span: 4 }}>
          <Button
            style={{ marginRight: "5px" }}
            variant="primary"
            onClick={() => navigate("/add-item")}
          >
            Add New Item
          </Button>
          <Button variant="primary" onClick={() => navigate("/")}>
            Company List
          </Button>
        </Col>
      </Row>
      <Row xs={1} md={3} className="g-2">
        {allItems.map((item) => (
          <Col key={item.myItemsId}>
            <Card>
              <Card.Img
                variant="top"
                src={item.imageUrl}
                style={{ height: 300 }}
              />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Price - {item.price}</Card.Text>
                <Button
                  style={{ marginRight: "5px" }}
                  variant="primary"
                  onClick={() => navigate(`/update-item/${item.myItemsId}`)}
                >
                  Edit
                </Button>
                <Button
                  style={{ marginRight: "5px" }}
                  className="mr-2"
                  variant="danger"
                  onClick={() => {
                    openConfirmDeleteModalHandler(item.myItemsId);
                  }}
                >
                  Delete
                </Button>
                <Button
                  style={{ marginRight: "5px" }}
                  variant="danger"
                  onClick={() => {
                    addToCart(item.name, item.price, item.imageUrl);
                  }}
                >
                  Add to cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
export default ItemList;
