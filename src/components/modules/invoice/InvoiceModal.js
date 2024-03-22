import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Bill from "./bill";
import { Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoiceModal = ({ closeModal, info }) => {
  const billRef = useRef(null);
  const shareOnWhatsApp = async () => {
    try {
      const element = billRef.current;
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF("portrait", "px", [380, 380]);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfUrl = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfUrl);
      return blobUrl;
      // const phoneNumber = "2299119900";
      // const whatsappLink = `https://wa.me/+918140210375?document=${encodeURIComponent(
      //   blobUrl
      // )}`;
      // console.log(whatsappLink, pdfUrl, blobUrl);
      // window.open(whatsappLink, "_blank");

      // console.log("PDF shared successfully on WhatsApp!");
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const blobUrl = await shareOnWhatsApp();
      if (!blobUrl) {
        console.error("PDF Blob URL is null.");
        return;
      }

      const shareUrl = `whatsapp://send?phone=+918140210375&file=https://picsum.photos/id/1/200/300`;
      window.open(shareUrl, "_blank");

      console.log("PDF shared successfully on WhatsApp!");
    } catch (error) {
      console.error("Error sharing PDF on WhatsApp:", error);
    }
  };
  return (
    <div>
      <Modal show={info.isOpen} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{ width: "725px" }}
            className="m-3"
            id="invoiceCapture"
            ref={billRef}
          >
            <Bill
              billValue={{
                taxRate: info.taxRate,
                discountRate: info.discountRate,
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShareWhatsApp}>
            Share on WhatsApp
          </Button>
        </Modal.Footer>
      </Modal>
      <hr className="mt-4 mb-3" />
    </div>
  );
};

export default InvoiceModal;
