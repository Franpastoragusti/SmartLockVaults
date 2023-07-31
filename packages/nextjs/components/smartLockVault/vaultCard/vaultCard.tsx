import { useEffect, useState } from "react";
import Image from "next/image";
import VaultContract from "../../../../hardhat/artifacts/contracts/Vault.sol/Vault.json";
import ArrowDownSvg from "../../../public/assets/CaretDown.svg";
import { SmartLockButton } from "../smartLockButton/smartLockButton";
import styles from "./vaultCard.module.css";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useAccountBalance, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface IProps {
  address: string;
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

const millisecondsInHour = 1000 * 60 * 60;
const millisecondsInDay = millisecondsInHour * 24;
const millisecondsInMonth = millisecondsInDay * 30;
const millisecondsInYear = millisecondsInDay * 365;

export const VaultCard = ({ address }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { balance } = useAccountBalance(address);
  const { data: distributeAddresses } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "readDistributeAddresses",
  });
  const { data: distributionBlock, refetch: distributionRefetch } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "distributionTimeStamp",
  });
  const { data: frec } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "frec",
  });
  const { data: name } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "name",
  });
  const { writeAsync: allIsFine } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: "allIsFine",
  });
  const { writeAsync: distribute } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: "distribute",
  });
  const { writeAsync: withdraw } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: "withdraw",
  });

  if (!distributionBlock || !address || !name) {
    return <></>;
  }

  const isLocked = (blockTimestamp: string) => {
    const timestampInMillis = parseInt(`${blockTimestamp}`.replace("n", "")) * 1000;
    const now = Date.now();
    const differenceInMillis = timestampInMillis - now;
    return differenceInMillis > 0;
  };

  const LockStatus = () => {
    const blockTimestamp = `${distributionBlock}`;
    const lockedResult = isLocked(blockTimestamp);
    if (!lockedResult && balance == 0) {
      return <span className={`${styles.badgeFinished} ${styles.badge}`}>Finished</span>;
    }
    if (!lockedResult) {
      return <span className={`${styles.badgeUnlocked} ${styles.badge}`}>Unlocked</span>;
    }
    return <span className={`${styles.badgeLocked} ${styles.badge}`}>{getPendingTime(blockTimestamp)}</span>;
  };

  const getPendingTime = (blockTimestamp: string) => {
    const timestampInMillis = parseInt(`${blockTimestamp}`.replace("n", "")) * 1000;
    const now = Date.now();
    const differenceInMillis = timestampInMillis - now;
    if (differenceInMillis <= 0) {
      return "";
    }

    if (differenceInMillis < millisecondsInHour) {
      return "Less than 1 hour";
    }
    if (differenceInMillis < millisecondsInDay) {
      return "Less than 1 day";
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

  let distributonType = "Equal";
  const distributionLabel = `${distributonType} Distribution each ${frec} day`;

  return (
    <li
      className={`${styles.vaultCard} bg-base-300 ${isOpen ? styles.opened : ""}`}
      onClick={() => setIsOpen(current => !current)}
    >
      <div className={`${styles.vaultCardHeader}`}>
        <h3 className={styles.title}>My cousins vault for 40030</h3>
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
      </div>
      <div className={styles.iconArrow}>
        <Image alt="SE2 logo" width={20} height={20} src={ArrowDownSvg} />
      </div>
      <div className={`${styles.sectionContainer}`}>
        <div className={styles.hr}></div>
        <div className={styles.section}>
          <div>
            <p className={`${styles.infoTitle} text-info`}>DEFINITION</p>
            <p className={styles.infoLabel}>{distributionLabel}</p>
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
        <div  className={styles.actionContainer}>
        <SmartLockButton isLoading={false} type="btn-outline" disabled={false} label={"All is fine"} action={() => {
          allIsFine().then(() =>{
            distributionRefetch()
          })
        
          }}></SmartLockButton>
        <SmartLockButton isLoading={false} type="btn-outline"  disabled={false} label={"Distribute"} action={() => distribute()}></SmartLockButton>
        <SmartLockButton isLoading={false} type="btn-outline" disabled={false} label={"Withdraw"} action={() => withdraw()}></SmartLockButton>
        </div>
     
      </div>
    </li>
  );
};
