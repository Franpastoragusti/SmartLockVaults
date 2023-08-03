import React, { MouseEvent, ReactNode, useEffect, useState } from "react";
import styles from "./createModel.module.css";
import ReactDOM from "react-dom";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { SmartLockButton } from "~~/components/smartLockVault/smartLockButton/smartLockButton";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface ModalProps {
  onClose: () => void;
  onCreateCallback: () => void;
  title?: string;
}
enum TimesEnum {
  SECONDS = 0,
  DAYS = 1,
  MONTHS = 2,
  YEARS = 3,
}
enum FoundsEnum {
  ONCE = 0,
  PERCENTAJE = 1,
  FIXED = 2,
}
const TimesOptions = [
  {
    label: "SECONDS",
    value: TimesEnum.SECONDS,
  },
  {
    label: "DAYS",
    value: TimesEnum.DAYS,
  },
  {
    label: "MONTHS",
    value: TimesEnum.MONTHS,
  },
  {
    label: "YEARS",
    value: TimesEnum.YEARS,
  },
];
const FoundsOptions = [
  {
    label: "ONCE",
    value: FoundsEnum.ONCE,
  },
  {
    label: "FIXED",
    value: FoundsEnum.FIXED,
  },
  {
    label: "PERCENTAJE",
    value: FoundsEnum.PERCENTAJE,
  },
];
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
  const [vaultType, setVaultType] = useState<FoundsEnum>(FoundsEnum.ONCE);
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "SmartLockFactory",
    functionName: "CreateNewVault",
    args: [BigInt(300), BigInt(300), distributionAccounts, name, BigInt(0), BigInt(0)],
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

    await writeAsync({
      args: [
        BigInt(secondsFrec!),
        BigInt(secondsDistFrec ?? 0),
        distributionAccounts,
        name,
        BigInt(vaultType),
        BigInt(founds ?? 0),
      ],
    });
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
    if (distributionAccounts.filter(val => value === val)?.length != 0) {
      return false;
    }
    setDistributionAccounts(current => [...current, value]);
    return true;
  };

  const onDelete = (value: string) => {
    setDistributionAccounts(current => [...current.filter(item => item != value)]);
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
    if (vaultType === FoundsEnum.ONCE) {
      next = FoundsEnum.FIXED;
    }
    if (vaultType === FoundsEnum.FIXED) {
      next = FoundsEnum.PERCENTAJE;
    }

    setVaultType(next);
  };

  const getTanslatedDistributionType = (type: FoundsEnum) => {
    if (FoundsEnum.ONCE == type) {
      return "ONCE";
    }
    if (FoundsEnum.PERCENTAJE == type) {
      return "PERCENTAJE";
    }
    return "FIXED";
  };

  const modalContent = (
    <div className={styles.modalContainer} onClick={handleCloseClick}>
      <div
        className={`${styles.modalCard} bg-base-300`}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
          <SelectComponent
            name={"vaultType"}
            options={FoundsOptions}
            value={vaultType}
            onChange={e => {
              setVaultType(e as number);
            }}
          ></SelectComponent>
        </div>
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
          name="secondsFrec"
          value={secondsFrecInput}
          onChange={e => {
            getSecondsInTime(e as number, timeFrecSelection, setSecondsFrec);
            setSecondsFrecInput(e as number);
          }}
          options={TimesOptions}
          type="number"
          title="Max Period to notify"
          subValue={timeFrecSelection}
          onSubtitleChange={(val) => {
            setTimeFrecSelection(parseInt(val));
            if (secondsFrecInput) {
              getSecondsInTime(secondsFrecInput, parseInt(val), setSecondsFrec);
            }
          }}
        />
        <InputAddressComponent
          name="accounts"
          onConfirm={val => onConfirmAddress(val)}
          onDelete={val => onDelete(val)}
          title="Accounts that will recieve the balance"
          subtitle="+"
          values={distributionAccounts}
        />
          <p className={styles.perDistributionTitle}>Per each Distribution</p>
          <div className={styles.perDistributionContainer}>
            <InputComponent
              name="founds"
              value={founds}
              onChange={e => {
                setFounds(e as number);
              }}
              type="number"
              title="Founds per each distribution"
            />
            <InputComponent
              name="secondsDistFrec"
              value={secondsDistFrecInput}
              onChange={e => {
                getSecondsInTime(e as number, timeDistFrecSelection, setSecondsDistFrec);
                setsecondsDistFrecInput(e as number);
              }}
              type="number"
              options={TimesOptions}
              title="Period for each distribution"
              subValue={timeDistFrecSelection}
              onSubtitleChange={val => {
                settimeDistFrecSelection(parseInt(val));
                if (secondsDistFrecInput) {
                  getSecondsInTime(secondsDistFrecInput, parseInt(val), setSecondsDistFrec);
                }
              }}
            />
        </div>

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

interface ISelectProps {
  name: string;
  options: {
    label: string;
    value: number;
  }[];
  value: string | number;
  onChange: (val: string | number | null) => void;
}

const SelectComponent = ({ name, options, onChange, value }: ISelectProps) => (
  <div className={styles.selectContainer}>
    <select className={styles.select} name={`${name}`} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(option => (
        <option key={option.value} value={option.value} selected>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface IInputProps {
  title: string;
  name: string;
  options?: {
    label: string;
    value: number;
  }[];
  subValue?: number;
  onSubtitleChange?: (val: string) => void;
  type: "number" | "text";
  value: string | number | null;
  onChange: (val: string | number | null) => void;
}

const InputComponent = ({ title, name, options, type, subValue, onChange, value, onSubtitleChange }: IInputProps) => (
  <div className={styles.input}>
    <label htmlFor={`${name}`}>{title}</label>

    <div className={styles.inputContainer}>
      <input name={`${name}`} type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} />
      {!!options && (
        <span className={"text-neutral"}>
          <select
            className={styles.select}
            name={`${name}`}
            value={subValue}
            onChange={e => onSubtitleChange!(e.target.value)}
          >
            {options.map(option => (
              <option key={option.value} value={option.value} selected>
                {option.label}
              </option>
            ))}
          </select>
        </span>
      )}
    </div>
  </div>
);

interface IInputAddressProps {
  title: string;
  name: string;
  subtitle: string;
  onConfirm: (value: string) => boolean;
  onDelete: (value: string) => void;
  values: string[];
}

const InputAddressComponent = ({ title, name, onConfirm, values, onDelete }: IInputAddressProps) => {
  const [value, setValue] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  return (
    <div className={`${styles.input} ${styles.inputAddress}`}>
      <label htmlFor={`${name}`}>{title}</label>

      <div className={`${styles.addressContainer} ${hasError ? styles.error : ""}`}>
        <input
          name={`${name}`}
          type="text"
          value={value}
          onChange={e => {
            setHasError(false);
            setValue(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              onConfirm(value);
              setValue("");
            }
          }}
        />
        <div className={styles.distributedAddressContainer}>
          {values.map((item, i) => (
            <div key={i} className={styles.distributedAddress} onClick={() => onDelete(item)}>
              <Address disableAddressLink={true} address={item} format="long"></Address>
              <span>X</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
