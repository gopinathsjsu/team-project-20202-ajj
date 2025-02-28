import React from 'react';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

Modal.setAppElement('#root');

function SignInModal({ isOpen, onRequestClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Sign In"
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onRequestClose} className="close-button">×</button>
      <h2>Enter your phone number</h2>
      <p>You will receive a text message to verify your account.</p>
      <PhoneInput
        country={'us'}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: true
        }}
      />
      <button className="continue-button">Continue</button>
      <a href="#" className="email-link">Use email instead</a>
    </Modal>
  );
}

export default SignInModal;