import React, { MouseEvent, ReactNode, useState } from "react";
import styles from "./createModel.module.css";
import ReactDOM from "react-dom";
import { Distributton } from "~~/components/core/smartLockButton/smartLockButton";
import { Address } from "~~/components/scaffold-eth";
import { isAddress } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

interface ModalProps {
  onClose: () => void;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, title }) => {
  const account = useAccount();
  const [distributionAccounts, setDistributionAccounts] = useState<string[]>([]);


  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "SmartLockFactory",
    functionName: "CreateNewVault",
    args: [account.address, BigInt(1), distributionAccounts],
    value: "0.01",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const createVault = () => {
    writeAsync();
  };
  const onCreate = () => {
    createVault();
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };
  const onConfirmAddress = (value:string):boolean => {
    if(!isAddress(value)){
      return false;
    }
    setDistributionAccounts(current => [...current,value])
    return true;
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
        <InputComponent name="notificationPeriod" type="number" title="Max Period to distribute" subtitle="DAYS" />
        <InputAddressComponent
          name="accounts"
          onConfirm={(val) => onConfirmAddress(val)}
          title="Accounts that will recieve the balance"
          subtitle="+"
          values={distributionAccounts}
        />
        <div className={styles.separator} />
        <Distributton
          isLoading={false}
          disabled={false}
          label={"Create"}
          action={() => onCreate()}
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

interface IInputAddressProps {
  title: string;
  name: string;
  subtitle: string;
  onConfirm: (value:string) => boolean;
  values: string[];
}

const InputAddressComponent = ({ title, name, onConfirm, values }: IInputAddressProps) => {
  const [value, setValue] = useState<string>("")
  const [hasError, setHasError] = useState<boolean>(false)
  return (
  <div className={`${styles.input} ${styles.inputAddress}`}>
    <label htmlFor={`${name}`}>{title}</label>

    <div className={`${styles.inputContainer} ${hasError?styles.error: ""}`}>
      <input name={`${name}`} type="text" value={value} onChange={(e) =>{
        setHasError(false)
        setValue(e.target.value)
      }}/>
      <span onClick={() => {
        const result = onConfirm(value)
        if(!result){
          setHasError(true)
        }
      }}>+</span>
    </div>
    <div className={styles.distributedAddressContainer}>
    {values.map((item,i) => (
      <div key={i} className={styles.distributedAddress}>
        <span>{i}</span>
        <Address address={item} format="long"></Address>
      </div>
     
    ))}
    </div>
   
  </div>
)};
