import React, { useState } from "react";
import { CustomInput } from "../customInput/customInput";
import { MultiAddressInput } from "../multiAddressInput/multiAddressInput";
import { SelectInput } from "../selectInput/selectInput";
import styles from "./createModel.module.css";

import ReactDOM from "react-dom";
import { isAddress } from "viem";
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
  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [secondsFrec, setSecondsFrec] = useState<number | null>(null);
  const [secondsFrecInput, setSecondsFrecInput] = useState<number | null>(null);
  const [timeFrecSelection, setTimeFrecSelection] = useState<TimesEnum>(TimesEnum.SECONDS);
  const [secondsDistFrec, setSecondsDistFrec] = useState<number | null>(null);
  const [tip, setTip] = useState<number>(0);

  const [secondsDistFrecInput, setsecondsDistFrecInput] = useState<number | null>(null);
  const [timeDistFrecSelection, settimeDistFrecSelection] = useState<TimesEnum>(TimesEnum.SECONDS);
  const [founds, setFounds] = useState<number | null>(null);
  const [vaultType, setVaultType] = useState<FoundsEnum | "">("");
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

  const onModalCreateClick = async () => {
    if (!secondsFrec || secondsFrec < 50 || distributionAccounts.length === 0) {
      return;
    }

    setShowTipsModal(true);
  };

  const onModalTipClick = async () => {
    await writeAsync({
      //@ts-ignore
      value: `${tip}`,
      args: [
        BigInt(secondsFrec ?? 0),
        BigInt(secondsDistFrec ?? 0),
        distributionAccounts,
        name,
        BigInt(vaultType ?? 0),
        BigInt(Math.round(Number(founds) * 10 ** 18)),
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

  const modalContent = (
    <div className={styles.modalContainer} onClick={handleCloseClick}>
      <div
        className={`${styles.modalCard} bg-base-300 ${showTipsModal ? styles.tipsModal : ""}`}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {showTipsModal ? (
          <div>
            <h3 className={styles.title}>Enjoying this free Dapp?</h3>
            <div className="tipImage"/>
            <p className={`${styles.subtitleTips} text-info`}> Support us <br></br> with a tip if you can!</p>

            <CustomInput
              name="tip"
              value={tip}
              onChange={e => {
                setTip(e as number);
              }}
              type="number"
              subValue={"ETH"}
              title="Tip"
            />
            <div className={styles.buttonContainerTips}>
              <SmartLockButton
                isLoading={false}
                disabled={false}
                label={"Create"}
                action={() => onModalTipClick()}
              ></SmartLockButton>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.titleContainer}>
              <h3 className={styles.title}>{title}</h3>
              <SelectInput
                name={"vaultType"}
                options={FoundsOptions}
                value={vaultType}
                placeholder="Select Type"
                onChange={e => {
                  setVaultType(e as number);
                }}
              ></SelectInput>
              <span className={styles.close} onClick={() => onClose()}>
                X
              </span>
            </div>
            <CustomInput
              name="name"
              value={name}
              onChange={e => {
                setName(e as string);
              }}
              disabled={vaultType == ""}
              type="text"
              title="Name of your Vault"
            />
            <CustomInput
              name="secondsFrec"
              value={secondsFrecInput}
              onChange={e => {
                getSecondsInTime(e as number, timeFrecSelection, setSecondsFrec);
                setSecondsFrecInput(e as number);
              }}
              disabled={vaultType == ""}
              options={TimesOptions}
              type="number"
              title="Max Period to notify"
              subValue={timeFrecSelection}
              onSubtitleChange={val => {
                setTimeFrecSelection(parseInt(val));
                if (secondsFrecInput) {
                  getSecondsInTime(secondsFrecInput, parseInt(val), setSecondsFrec);
                }
              }}
            />
            <MultiAddressInput
              name="accounts"
              disabled={vaultType == ""}
              onConfirm={val => onConfirmAddress(val)}
              onDelete={val => onDelete(val)}
              title="Accounts that will recieve the balance"
              subtitle="+"
              values={distributionAccounts}
            />
            <p className={`${styles.perDistributionTitle} ${vaultType == FoundsEnum.ONCE ? styles.disabled : ""}`}>
              Per each Distribution
            </p>
            <div className={styles.perDistributionContainer}>
              <CustomInput
                name="founds"
                value={founds}
                onChange={e => {
                  setFounds(e as number);
                }}
                subValue={vaultType == FoundsEnum.PERCENTAJE ? "%" : "ETH"}
                type="number"
                disabled={vaultType == "" || vaultType == FoundsEnum.ONCE}
                title={vaultType == FoundsEnum.PERCENTAJE ? "Balance % per each distribution": "Found per each distribution"}
              />
              <CustomInput
                name="secondsDistFrec"
                value={secondsDistFrecInput}
                onChange={e => {
                  getSecondsInTime(e as number, timeDistFrecSelection, setSecondsDistFrec);
                  setsecondsDistFrecInput(e as number);
                }}
                type="number"
                options={TimesOptions}
                title="Period for each distribution"
                disabled={vaultType == "" || vaultType == FoundsEnum.ONCE}
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
              action={() => onModalCreateClick()}
            ></SmartLockButton>
          </>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default Modal;
