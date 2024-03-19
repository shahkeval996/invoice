import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Card } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const InvoiceItem = ({
  onRowDel,
  items,
  hideAction,
}) => {
  const rowDel = onRowDel;
  const itemTable = items.map(function (item) {
    return (
      <ItemRow
        hideAction={hideAction}
        item={item}
        onDelEvent={rowDel}
      />
    );
  });

  return (
    <div style={{ overflow: "auto" }}>
      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTY</th>
            <th>PRICE/RATE</th>
            {!hideAction && <th className="text-center">ACTION</th>}
          </tr>
        </thead>
        <tbody>{itemTable}</tbody>
      </Table>
    </div>
  );
};
const ItemRow = ({
  item,
  onDelEvent,
  hideAction,
}) => {
  return (
    <tr>
      <td style={{ minWidth: "130px" }}>
        <Card>
          <Card.Img
            variant="top"
            src={item.imageUrl}
            style={{ height: 150, width: "100%" }}
          />
          <Card.Body>
            <Card.Text>{item.name}</Card.Text>
          </Card.Body>
        </Card>
      </td>
      <td style={{ minWidth: "70px" }}>
        <Form.Control value={item.quantity} />
      </td>
      <td style={{ minWidth: "100px" }}>
        <Form.Control className="text-end" value={item.price} disabled />
      </td>
      {!hideAction && 
        <td className="text-center">
          <Button variant="danger" onClick={() => onDelEvent(item)}>
            <Trash />
          </Button>
        </td>
      }
    </tr>
  );
};

export default InvoiceItem;
