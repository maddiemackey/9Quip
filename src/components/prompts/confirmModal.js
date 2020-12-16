import React from "react";
import { Button, Modal, ModalHeader, ModalFooter } from "reactstrap";

const ConfirmModal = (props) => {
  const { onConfirm, text, modalVisible, close, type } = props;

  return (
    <div>
      <Modal centered isOpen={modalVisible} toggle={close}>
        <ModalHeader>{text}</ModalHeader>
        <ModalFooter>
          <Button color="secondary" onClick={close}>
            Cancel
          </Button>
          <Button color={type} onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
