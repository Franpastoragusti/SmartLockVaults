import React, { MouseEvent, ReactNode, useEffect, useState } from "react";
import styles from "./createModel.module.css";
import ReactDOM from "react-dom";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { SmartLockButton } from "~~/components/smartLockVault/smartLockButton/smartLockButton";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface ModalProps {
  onClose: () => void;
  onCreateCallback: () => void;
  title?: string;
}
enum TimesEnum {
  SECONDS = "SECONDS",
  DAYS = "DAYS",
  MONTHS = "MONTHS",
  YEARS = "YEARS",
}
enum FoundsEnum {
  ONCE = 0,
  PERCENTAJE = 1,
  FIXED = 2
}
const Modal: React.FC<ModalProps> = ({ onClose, onCreateCallback, title }) => {
  const [distributionAccounts, setDistributionAccounts] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [secondsFrec, setSecondsFrec] = useState<number | null>(null);
  const [secondsFrecInput, setSecondsFrecInput] = useState<number | null>(null);
  const [timeFrecSelection, setTimeFrecSelection] = useState<TimesEnum>(TimesEnum.MONTHS);
  const [secondsDistFrec, setSecondsDistFrec] = useState<number | null>(null);
  const [secondsDistFrecInput, setsecondsDistFrecInput] = useState<number | null>(null);
  const [timeDistFrecSelection, settimeDistFrecSelection] = useState<TimesEnum>(TimesEnum.YEARS);
  const [founds, setFounds] = useState<number | null>(null);
  const [foundsSlection, setFoundsSelection] = useState<FoundsEnum>(FoundsEnum.ONCE);
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "SmartLockFactory",
    functionName: "CreateNewVault",
    args: [BigInt(300),BigInt(300), distributionAccounts, name, BigInt(0) , BigInt(0)],
    value: "0.01",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const getSecondsInTime = (val: number, selectedTime: TimesEnum, callback: (v: number) => void) => {
    switch (selectedTime) {
      case TimesEnum.DAYS:
        val = val * 24 * 60 * 60;
        break;
      case TimesEnum.MONTHS:
        val = val * 24 * 60 * 60 * 30;
        break;
      case TimesEnum.YEARS:
        val = val * 24 * 60 * 60 * 365;
        break;
      default:
        break;
    }
    callback(val);
  };

  const onCreate = async () => {
    const states = [secondsFrec, secondsDistFrec];
    if (!secondsFrec || secondsFrec < 50 || distributionAccounts.length === 0) {
      return;
    }
    
    await  writeAsync({args:[BigInt(secondsFrec!),BigInt(secondsDistFrec ?? 0), distributionAccounts, name, BigInt(foundsSlection), BigInt(founds ?? 0)]});
    onCreateCallback();
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };
  const onConfirmAddress = (value: string): boolean => {
    if (!isAddress(value)) {
      return false;
    }
    setDistributionAccounts(current => [...current, value]);
    return true;
  };

  const onTimeChange = (callback: React.Dispatch<React.SetStateAction<TimesEnum>>, value: TimesEnum) => {
    let next = TimesEnum.SECONDS;
    if (value === TimesEnum.SECONDS) {
      next = TimesEnum.DAYS;
    }
    if (value === TimesEnum.DAYS) {
      next = TimesEnum.MONTHS;
    }
    if (value === TimesEnum.MONTHS) {
      next = TimesEnum.YEARS;
    }

    callback(next);
    return next;
  };
  const getNextFoundSelection = () => {
    let next = FoundsEnum.ONCE;
    if (foundsSlection === FoundsEnum.ONCE) {
      next = FoundsEnum.FIXED;
    }
    if (foundsSlection === FoundsEnum.FIXED) {
      next = FoundsEnum.PERCENTAJE;
    }

    setFoundsSelection(next);
  };

  const getTanslatedDistributionType = (type:FoundsEnum) => {
    if(FoundsEnum.ONCE == type){ 
      return "ONCE"
    }
    if(FoundsEnum.PERCENTAJE == type){ 
      return "PERCENTAJE"
    }
    return "FIXED"
  }

  const modalContent = (
    <div className={styles.modalContainer} onClick={handleCloseClick}>
      <div
        className={`${styles.modalCard} bg-base-300`}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h3 className={styles.title}>{title}</h3>
        <h6 >{"Founds foreach Distribution"}</h6>
        <InputComponent
          name="name"
          value={name}
          onChange={e => {
            setName(e as string);
          }}
          type="text"
          title="Name of your Vault"
        />
        <InputComponent
          name="founds"
          value={founds}
          onChange={e => {
            setFounds(e as number);
          }}
          type="number"
          title="Founds per each distribution"
          subtitle={getTanslatedDistributionType(foundsSlection)}
          onSubtitleChange={() => getNextFoundSelection()}
        />
         <InputComponent
          name="secondsDistFrec"
          value={secondsDistFrecInput}
          onChange={e => {
            getSecondsInTime(e as number, timeDistFrecSelection, setSecondsDistFrec);
            setsecondsDistFrecInput(e as number);
          }}
          type="number"
          title="Period for each distribution"
          subtitle={timeDistFrecSelection}
          onSubtitleChange={() => {
            const next = onTimeChange(settimeDistFrecSelection, timeDistFrecSelection);
            if (secondsDistFrecInput) {
              getSecondsInTime(secondsDistFrecInput, next, setSecondsDistFrec);
            }
          }}
        />
        <InputComponent
          name="secondsFrec"
          value={secondsFrecInput}
          onChange={e => {
            getSecondsInTime(e as number, timeFrecSelection, setSecondsFrec);
            setSecondsFrecInput(e as number);
          }}
          type="number"
          title="Max Period to notify"
          subtitle={timeFrecSelection}
          onSubtitleChange={() => {
            const next = onTimeChange(setTimeFrecSelection, timeFrecSelection);
            if (secondsFrecInput) {
              getSecondsInTime(secondsFrecInput, next, setSecondsFrec);
            }
          }}
        />
        <InputAddressComponent
          name="accounts"
          onConfirm={val => onConfirmAddress(val)}
          title="Accounts that will recieve the balance"
          subtitle="+"
          values={distributionAccounts}
        />
        <div className={styles.separator} />
        <SmartLockButton
          isLoading={false}
          disabled={false}
          label={"Create"}
          action={() => onCreate()}
        ></SmartLockButton>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default Modal;

interface IInputProps {
  title: string;
  name: string;
  subtitle?: string;
  type: "number" | "text";
  value: string | number | null;
  onChange: (val: string | number | null) => void;
  onSubtitleChange?: () => void;
}

const InputComponent = ({ title, name, subtitle, type, onChange, value, onSubtitleChange }: IInputProps) => (
  <div className={styles.input}>
    <label htmlFor={`${name}`}>{title}</label>

    <div className={styles.inputContainer}>
      <input name={`${name}`} type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} />
     {!!subtitle && <span className={"text-neutral"} onClick={() => onSubtitleChange!()}>
        {subtitle}
      </span>}
    </div>
  </div>
);

interface IInputAddressProps {
  title: string;
  name: string;
  subtitle: string;
  onConfirm: (value: string) => boolean;
  values: string[];
}

const InputAddressComponent = ({ title, name, onConfirm, values }: IInputAddressProps) => {
  const [value, setValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  return (
    <div className={`${styles.input} ${styles.inputAddress}`}>
      <label htmlFor={`${name}`}>{title}</label>

      <div className={`${styles.inputContainer} ${hasError ? styles.error : ""}`}>
        <input
          name={`${name}`}
          type="text"
          value={value}
          onChange={e => {
            setHasError(false);
            setValue(e.target.value);
          }}
        />
        <span
          className={"text-neutral"}
          onClick={() => {
            const result = onConfirm(value);
            if (!result) {
              setHasError(true);
            }
            setValue("");
          }}
        >
          +
        </span>
      </div>
      <div className={styles.distributedAddressContainer}>
        {values.map((item, i) => (
          <div key={i} className={styles.distributedAddress}>
            <span>{i}</span>
            <Address address={item} format="long"></Address>
          </div>
        ))}
      </div>
    </div>
  );
};
