import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../fireBaseConfig";
import InvoiceItem from "./InvoiceItem";

const Bill = ({ billValue }) => {
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
    taxAmmount: "0.00",
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
      (billValue.taxRate / 100)
    ).toFixed(2);
    const discountAmmountValue = (
      parseFloat(subTotal) *
      (billValue.discountRate / 100)
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
  }, [billValue.discountRate, billValue.taxRate, config, items]);

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
  }, [items, billValue]);

  return (
    <div className="container p-4 p-xl-5 my-3 my-xl-4">
      <div className="d-flex flex-row align-items-start justify-content-between mb-3">
        <div className="d-flex flex-column">
          <div className="d-flex flex-column">
            <div className="mb-2">
              <span className="fw-bold">Current Date: </span>
              <span className="current-date">{config.currentDate}</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="row mb-5">
        <div className="col">
          <label className="fw-bold">Bill from:</label>
          <input
            className="form-control my-2"
            value={config.billFrom}
            type="text"
            disabled
          />
          <input
            className="form-control my-2"
            placeholder="Email address"
            value={config.billFromEmail}
            type="email"
            disabled
          />
          <input
            className="form-control my-2"
            placeholder="Billing address"
            value={config.fromMobile}
            type="text"
            disabled
          />
        </div>
        <div className="col">
          <label className="fw-bold">Bill to:</label>
          <input
            className="form-control my-2"
            placeholder="Who is this invoice to?"
            type="text"
            required
          />
          <input
            className="form-control my-2"
            placeholder="To mobile"
            type="text"
            required
          />
        </div>
      </div>
      <InvoiceItem hideAction={true} items={items} />
      <div className="row mt-4 justify-content-end">
        <div className="col-lg-6">
          <div className="d-flex flex-row align-items-start justify-content-between">
            <span className="fw-bold">Subtotal:</span>
            <span>Rs. {config.subTotal}</span>
          </div>
          <div className="d-flex flex-row align-items-start justify-content-between mt-2">
            <span className="fw-bold">Discount:</span>
            <span>
              <span className="small">(0%)</span> Rs. {config.discountAmmount}
            </span>
          </div>
          <div className="d-flex flex-row align-items-start justify-content-between mt-2">
            <span className="fw-bold">Tax:</span>
            <span>
              <span className="small">(0%)</span> Rs. {config.taxAmmount}
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
            <span className="fw-bold">Rs. {config.total}</span>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <label className="fw-bold">Notes:</label>
      <textarea className="form-control my-2" rows="1" disabled>
        Thank you for doing business with us!
      </textarea>
    </div>
  );
};

export default Bill;
