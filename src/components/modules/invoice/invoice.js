import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { getDatabase, ref, get, remove } from "firebase/database";
import app from "../../../fireBaseConfig";
import { useNavigate } from "react-router-dom";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    isOpen: false,
    currency: "₹",
    currentDate: "",
    invoiceNumber: 1,
    dateOfIssue: "",
    billTo: "",
    billToEmail: "",
    toMobile: "",
    billFrom: "Keval Shah",
    billFromEmail: "keval.shah@gmail.com",
    fromMobile: "+91-8140210375",
    total: "0.00",
    subTotal: "0.00",
    taxRate: "",
    taxAmmount: "0.00",
    discountRate: "",
    discountAmmount: "0.00",
  });

  const [items, setItems] = useState([]);

  const handleCalculateTotal = useCallback(() => {
    let subTotal = 0;

    items.forEach((item) => {
      subTotal = (
        parseFloat(subTotal) +
        parseFloat(item.price) * parseInt(item.quantity)
      ).toFixed(2);
    });

    const subTotalValue = parseFloat(subTotal).toFixed(2);
    const taxAmmountValue = (
      parseFloat(subTotal) *
      (config.taxRate / 100)
    ).toFixed(2);
    const discountAmmountValue = (
      parseFloat(subTotal) *
      (config.discountRate / 100)
    ).toFixed(2);
    const totalValue =
      parseFloat(subTotal) -
      parseFloat(discountAmmountValue) +
      parseFloat(taxAmmountValue);

    setConfig({
      ...config,
      subTotal: subTotalValue,
      taxAmmount: taxAmmountValue,
      discountAmmount: discountAmmountValue,
      total: totalValue.toFixed(2),
    });
  }, [config, items]);

  useEffect(() => {
    async function fetchData() {
      const db = getDatabase(app);
      const dbRef = ref(db, "item/cart");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const myData = snapshot.val();
        const temporaryArray = Object.keys(myData).map((myCompanyId) => {
          return {
            id: myCompanyId,
            name: myData[myCompanyId].name,
            price: myData[myCompanyId].price,
            imageUrl: myData[myCompanyId].imageUrl,
            quantity: 1,
          };
        });
        setItems(temporaryArray);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    handleCalculateTotal();
  }, [items, config.taxRate, config.discountRate]);

  async function handleRowDel(item) {
    const db = getDatabase(app);
    const dbRef = ref(db, "item/cart/" + item.id);
    await remove(dbRef);

    const updatedItems = items.filter(
      (existingItem) => existingItem.id !== item.id
    );
    setItems(updatedItems);
    handleCalculateTotal();
  }
  async function removeAllItems() {
    const db = getDatabase(app);
    const dbRef = ref(db, "item/cart");
    await remove(dbRef);

    setItems([]);
    handleCalculateTotal();
  }

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setConfig({ ...config, isOpen: true });
  };

  const closeModal = () =>
    setConfig({
      ...config,
      isOpen: false,
    });

  return (
    <>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  rows={3}
                  value="Keval Shah"
                  type="text"
                  name="billFrom"
                  className="my-2"
                  disabled
                />
                <Form.Control
                  placeholder={"Email address"}
                  value="keval.shah@gamail.com"
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  disabled
                />
                <Form.Control
                  placeholder={"Billing address"}
                  value="+91-8140210375"
                  type="text"
                  name="fromMobile"
                  className="my-2"
                  disabled
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice to?"}
                  rows={3}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(event) =>
                    setConfig({ ...config, billTo: event.target.value })
                  }
                  autoComplete="name"
                  required="required"
                />
                <Form.Control
                  placeholder={"To mobile"}
                  type="text"
                  name="toMobile"
                  className="my-2"
                  autoComplete="mobile"
                  onChange={(event) =>
                    setConfig({ ...config, toMobile: event.target.value })
                  }
                  required="required"
                />
              </Col>
            </Row>
            <InvoiceItem onRowDel={handleRowDel} items={items} />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {config.currency}
                    {config.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small ">
                      ({config.discountRate || 0}%)
                    </span>
                    {config.currency}
                    {config.discountAmmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small ">({config.taxRate || 0}%)</span>
                    {config.currency}
                    {config.taxAmmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{
                    fontSize: "1.125rem",
                  }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {config.currency}
                    {config.total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thank you for doing business with us!"
              name="notes"
              as="textarea"
              className="my-2"
              rows={1}
              disabled
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="primary"
              type="submit"
              className="mb-1 d-block w-100 btn-success"
              onClick={() => navigate("/item")}
            >
              Back To List
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="mb-1 d-block w-100 btn-success"
              onClick={() => removeAllItems()}
            >
              Clear All Items
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="d-block w-100 btn-secondary"
              onClick={openModal}
            >
              Review Invoice
            </Button>
            <InvoiceModal closeModal={closeModal} info={config} />
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  onChange={(event) => {
                    setConfig({ ...config, taxRate: event.target.value });
                  }}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  onChange={(event) => {
                    setConfig({ ...config, discountRate: event.target.value });
                  }}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InvoiceForm;
