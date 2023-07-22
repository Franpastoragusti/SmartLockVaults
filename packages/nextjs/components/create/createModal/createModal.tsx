import React, { MouseEvent, ReactNode } from "react";
import styles from "./createModel.module.css";
import ReactDOM from "react-dom";
import { Distributton } from "~~/components/core/distributton/distributton";

interface ModalProps {
  onClose: () => void;
  children?: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  const handleCloseClick = () => {
    onClose();
  };

  const modalContent = (
    <div className={styles.modalContainer} onClick={handleCloseClick}>
      <div
        className={styles.modalCard}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h3 className={styles.title}>{title}</h3>
        <InputComponent name="amount" type="number" title="Amount that will be send to the contract" subtitle="ETH" />
        <InputComponent name="accounts" type="text" title="Accounts that will recieve the balance" subtitle="+" />
        <InputComponent name="notificationPeriod" type="number" title="Max Period to distribute" subtitle="DAYS" />
        <div className={styles.separator} />
        <Distributton
          isLoading={false}
          disabled={false}
          label={"Create"}
          action={() => handleCloseClick()}
        ></Distributton>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default Modal;

interface IInputProps {
  title: string;
  name: string;
  subtitle: string;
  type: "number" | "text";
}

const InputComponent = ({ title, name, subtitle, type }: IInputProps) => (
  <div className={styles.input}>
    <label htmlFor={`${name}`}>{title}</label>

    <div className={styles.inputContainer}>
      <input name={`${name}`} type={type} />
      <span>{subtitle}</span>
    </div>
  </div>
);
