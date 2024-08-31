import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const Model = ({ modalTitle, modalContent, show, onClose, onConfirm }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <>
      <Modal className="modal" show={show} onHide={handleClose}>
        <Modal.Header className="modalhead"  closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalbody" >{modalContent}</Modal.Body>
        <Modal.Footer className="modalbody">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <Button className="btn-primary" onClick={handleConfirm}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Model.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  modalContent: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Model;
