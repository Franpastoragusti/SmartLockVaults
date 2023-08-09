import { useEffect, useState } from "react";
import Image from "next/image";
import VaultContract from "../vaultAbi/Vault.json";
import ArrowDownSvg from "../../../public/assets/CaretDown.svg";
import { SmartLockButton } from "../smartLockButton/smartLockButton";
import styles from "./vaultCard.module.css";
import { toast } from "react-hot-toast";
import { useContractRead, useContractWrite } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useAccountBalance } from "~~/hooks/scaffold-eth";
import { motion } from "framer-motion";

interface IProps {
  address: string;
  isOwner: boolean;
  delay:number
}

export interface IVaultSelections {
  type: "equal" | "not-equal";
  frecuency: "each" | "periodic";
  time: "blocks" | "days" | "years";
  period: number;
  distributeAddresses: any[];
  distributionBlock: number;
  address: string;
}
const millisecondsInMinute = 1000 * 60;
const millisecondsInHour = millisecondsInMinute * 60;
const millisecondsInDay = millisecondsInHour * 24;
const millisecondsInMonth = millisecondsInDay * 30;
const millisecondsInYear = millisecondsInDay * 365;

export const VaultCard = ({ address, isOwner, delay }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { balance } = useAccountBalance(address);
  const { data: distributeAddresses, error } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "readDistributeAddresses",
  });
  const { data: distributionTimeStamp, refetch: distributionRefetch } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "distributionTimeStamp",
  });
  const { data: frec } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "frec",
  });
  const { data: distibutionType } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "distibutionType",
  });
  const { data: distributionValue } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "distributionValue",
  });
  const { data: distributionFrec } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "distributionFrec",
  });
  const { data: name } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "name",
  });
  const { writeAsync: allIsFine, error: allIsFineError } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: "allIsFine",
  });
  const { writeAsync: distribute, error: distributeError } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: "distribute",
  });
  const { writeAsync: withdraw, error: withdrawError } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: "withdraw",
  });

  useEffect(() => {
    const renderError = allIsFineError ?? distributeError ?? withdrawError;
    if (renderError) {
      const details = extractDetails(renderError.message);
      toast.error(details);
    }
  }, [allIsFineError, distributeError, withdrawError]);

  function extractDetails(text: string) {
    const detailsRegex = /Details: (.+?)\n/;
    const match = text.match(detailsRegex);
    return match ? match[1] : null;
  }

  if (!distributionTimeStamp || !address || !name) {
    return <></>;
  }

  const isLocked = (blockTimestamp: string) => {
    const timestampInMillis = parseInt(`${blockTimestamp}`.replace("n", "")) * 1000;
    const now = Date.now();
    const differenceInMillis = timestampInMillis - now;
    return differenceInMillis > 0;
  };
  const getLockStatus = () => {
    const blockTimestamp = `${distributionTimeStamp}`;
    const lockedResult = isLocked(blockTimestamp);
    if (!lockedResult && balance == 0) {
      return "Finished";
    }
    if (!lockedResult) {
      return "Unlocked";
    }
    return "Locked";
  };

  const LockStatus = () => {
    const status = getLockStatus();
    const blockTimestamp = `${distributionTimeStamp}`;
    if (status === "Finished") {
      return <span className={`${styles.badgeFinished} ${styles.badge}`}>Finished</span>;
    }
    if (status === "Unlocked") {
      return <span className={`${styles.badgeUnlocked} ${styles.badge}`}>Unlocked</span>;
    }
    return <span className={`${styles.badgeLocked} ${styles.badge}`}>{getPendingTime(blockTimestamp)}</span>;
  };

  const getPendingTime = (blockTimestamp: string) => {
    const timestampInMillis = parseInt(`${blockTimestamp}`.replace("n", "")) * 1000;
    const now = Date.now();
    const differenceInMillis = timestampInMillis - now;

    let remaningTime = differenceInMillis;
    let text = "";
    if (differenceInMillis <= 0) {
      return "";
    }

    if (differenceInMillis > millisecondsInYear) {
      const [yearsText, remaningMonthsInMillis] = getTextAndReminingTime(
        differenceInMillis,
        millisecondsInYear,
        "year",
      );
      remaningTime = remaningMonthsInMillis;
      text = text + yearsText;
    }
    if (remaningTime > millisecondsInMonth) {
      const [monthsText, remaningDaysInMillis] = getTextAndReminingTime(remaningTime, millisecondsInMonth, "month");
      remaningTime = remaningDaysInMillis;
      text = text + monthsText;
    }
    if (remaningTime > millisecondsInDay) {
      const [daysText, remaningHoursInMillis] = getTextAndReminingTime(remaningTime, millisecondsInDay, "day");
      remaningTime = remaningHoursInMillis;
      text = text + daysText;
    }
    const [secsText, _] = getTextAndReminingTime(remaningTime, 1000, "sec");
    text = text.length > 0 ? text : secsText;

    return text;
  };

  const getTextAndReminingTime = (remaningTime: number, baseTime: number, unit: string): [string, number] => {
    let value = Math.floor(remaningTime / baseTime);
    remaningTime = remaningTime - value * baseTime;
    return [`${value} ${unit}${value === 1 ? "" : "s"} `, remaningTime];
  };

  const getFrec = (frecuency: string) => {
    const timestampInMillis = parseInt(frecuency) * 1000;
    const differenceInMillis = timestampInMillis;

    if (differenceInMillis < millisecondsInHour) {
      const secs = Math.floor(differenceInMillis / 1000);
      return `${secs} sec${secs === 1 ? "" : "s"}`;
    }

    if (differenceInMillis < millisecondsInDay) {
      const hours = Math.floor(differenceInMillis / millisecondsInHour);
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    }
    if (differenceInMillis < millisecondsInMonth) {
      const days = Math.floor(differenceInMillis / millisecondsInDay);
      return `${days} day${days === 1 ? "" : "s"}`;
    }
    if (differenceInMillis < millisecondsInYear) {
      const months = Math.floor(differenceInMillis / millisecondsInMonth);
      return `${months} month${months === 1 ? "" : "s"}`;
    }
    const years = Math.floor(differenceInMillis / millisecondsInYear);
    return `${years} year${years === 1 ? "" : "s"}`;
  };

  const getDistributionDescription = () => {
    if (0 == distibutionType) {
      return "All the balance equal once unlocked";
    }
    if (1 == distibutionType) {
      return `${Number(distributionValue) / 10 ** 18}% each ${getFrec(`${distributionFrec}`)} once unlocked`;
    }
    return `${Number(distributionValue) / 10 ** 18} ETH each ${getFrec(`${distributionFrec}`)} once unlocked`;
  };
  return (
    <motion.li
      initial={{ opacity: 0,}}
      animate={{ opacity: 1}}
      transition={{ delay: delay, duration: 1 }}
      className={`${styles.vaultCard} bg-base-300 ${isOpen ? styles.opened : ""}`}
      onClick={() => setIsOpen(current => !current)}
    >
      <div className={`${styles.vaultCardHeader}`}>
        <h3 className={styles.title}>{name + ""}</h3>
        <LockStatus />
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <p className={`${styles.infoTitle} ${styles.infoTitleMB}  text-info`}>ADDRESS</p>
          <Address size="sm" address={address} format="short" />
        </div>
        <div className={styles.section}>
          <div>
            <p className={`${styles.infoTitle} text-info`}>QUANTITY</p>
            <Balance address={address} />
          </div>
        </div>
        {isOwner ? (
          <div className={styles.section}>
            <div>
              <p className={`${styles.infoTitle} text-info`}>LOCK TIME</p>
              <p className={`${styles.infoNoMargin} text-sm`}>
                {getFrec(`${getLockStatus() === "Unlocked" && !!distributionFrec ? distributionFrec : frec}`)}
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.iconArrow}>
        <Image alt="SE2 logo" width={20} height={20} src={ArrowDownSvg} />
      </div>
      <div className={`${styles.sectionContainer}`}>
        <div className={styles.hr}></div>
        <div className={styles.section}>
          <div>
            <p className={`${styles.infoTitle} text-info`}>DEFINITION</p>
            <p className={styles.infoLabel}>{getDistributionDescription()}</p>
          </div>
        </div>
        <div className={styles.section}>
          <p className={`${styles.infoTitle} text-info`}>TARGET ACCOUNTS</p>
          <div className={styles.beneficiaries}>
            {(distributeAddresses as string[]).map((addresse, i) => (
              <Address key={i} address={addresse}></Address>
            ))}
          </div>
        </div>
        <div className={styles.hr}></div>
        <div className={styles.actionContainer}>
          {isOwner ? (
            <SmartLockButton
              isLoading={false}
              type="btn-outline"
              disabled={false}
              label={`Lock Again`}
              action={() => {
                allIsFine().then(() => {
                  distributionRefetch();
                });
              }}
            ></SmartLockButton>
          ) : (
            <></>
          )}
          <SmartLockButton
            isLoading={false}
            type="btn-outline"
            disabled={getLockStatus() !== "Unlocked"}
            label={"Distribute"}
            action={() =>
              distribute().then(() => {
                distributionRefetch();
              })
            }
          ></SmartLockButton>
          {isOwner ? (
            <SmartLockButton
              isLoading={false}
              type="btn-outline"
              disabled={false}
              label={"Withdraw"}
              action={() => withdraw()}
            ></SmartLockButton>
          ) : (
            <></>
          )}
        </div>
      </div>
    </motion.li>
  );
};
