import { useState } from "react";
import { Spinner } from "../Spinner";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import styles from "./contractData.module.css";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Distributton } from "../core/distributton/distributton";

interface IProps {
  isDistributing: boolean;
}
export const ContractInteraction = ({ isDistributing }: IProps) => {
  const { writeAsync: allIsFine, isLoading: allIsFineIsLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "allIsFine",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
  const { writeAsync: distribute, isLoading: distributeIsLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "distribute",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
  const { writeAsync: withdraw, isLoading: withdrawIsLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "withdraw",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className={styles.actions}>
      <Distributton
        disabled={isDistributing && true}
        isLoading={allIsFineIsLoading}
        action={() => allIsFine()}
        label={"allIsFine"}
      />
      <Distributton
        disabled={!isDistributing && true}
        isLoading={distributeIsLoading}
        action={() => distribute()}
        label={"distribute"}
      />
      <Distributton
        disabled={isDistributing && true}
        isLoading={withdrawIsLoading}
        type="secondary"
        action={() => withdraw()}
        label={"withdraw"}
      />
    </div>
  );
};