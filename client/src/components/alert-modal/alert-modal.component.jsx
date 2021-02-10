import React from "react";
import {Modal, Button} from 'react-bootstrap';

const AlertModal = (props) => (  
      <>
        <Modal
          show={props.show}
          onHide={props.handleClose}
          keyboard={false}
          centered
        >
          <Modal.Header className={props.alertColor}>
            <Modal.Title><i className={props.alertIcon}></i>{props.alertTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {props.alertText}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );

export default AlertModal;