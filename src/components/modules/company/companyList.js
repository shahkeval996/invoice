import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import DeleteConfirmation from "../../shared/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { getDatabase, ref, get, remove } from "firebase/database";
import app from "../../../fireBaseConfig";

function CompanyList() {
  const [allCompanys, setAllCompanys] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const db = getDatabase(app);
      const dbRef = ref(db, "item/companys");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const myData = snapshot.val();
        const temporaryArray = Object.keys(myData).map( myCompanyId => {
            return {
                ...myData[myCompanyId],
                myCompanyId: myCompanyId
            }
        } )
        setAllCompanys(temporaryArray);
      }
    }
    fetchData()
  }, []);

  const openConfirmDeleteModalHandler = (id) => {
    setItemToDeleteId(id);
    setShowModal(true);
  };

  const hideDeleteModalHandler = () => {
    setShowModal(false);
    setItemToDeleteId(0);
  };

  const confirmDeleteHandler = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "item/companys/" + itemToDeleteId);
    await remove(dbRef);

    setAllCompanys((previousState) => {
      return previousState.filter((_) => _.myCompanyId !== itemToDeleteId);
    });
    setItemToDeleteId(0);
    setShowModal(false);
  };

  return (
    <>
      <DeleteConfirmation
        showModal={showModal}
        hideDeleteModalHandler={hideDeleteModalHandler}
        title="Delete Confirmation"
        body="Are you want to delete this item?"
        confirmDeleteHandler={confirmDeleteHandler}
      />
      <Row className="mt-2 mb-2">
        <Col md={{ span: 4 }}>
          <Button style={{ marginRight: "5px" }} variant="primary" onClick={() => navigate("/add-company")}>
            Add New Company
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/item")}
          >
            All Items
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allCompanys.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/item/${item.name}`)}
                >
                  Get All Items
                </Button>{" "}
                <Button
                  variant="primary"
                  onClick={() => navigate(`/update-company/${item.myCompanyId}`)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => openConfirmDeleteModalHandler(item.myCompanyId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default CompanyList;
