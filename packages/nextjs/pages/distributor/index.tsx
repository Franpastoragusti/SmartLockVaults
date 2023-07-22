import { useState } from "react";
import styles from "./distributor.module.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ContractData } from "~~/components/distributor/ContractData";
import { ContractInteraction } from "~~/components/distributor/ContractInteraction";
import { useFetchBlocks, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
const CONTRACT_NAME = "YourContract";
const Distributor: NextPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { address } = useAccount();

  const { data: distributionBlock, isLoading: distributionBlockLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "distributionBlock",
  });
  const { totalBlocks } = useFetchBlocks();
  const isDistributing = totalBlocks > parseInt(distributionBlock?.toString() || "0");

  const DistributorView = () => (
    <>
      <h1>Your Distributor</h1>
      <button onClick={() => {}}>Let's Go</button>
    </>
  );
  const DistributorForm = () => (
    <form>
      <h1>Create your Distributor</h1>
      <input type="text" />
    </form>
  );

  return (
    <div className={styles.mainPage}>
      <div className={styles.card}>
      { !!isDistributing?  <div className={styles.cardBadge}>Success</div> : <div className={styles.inactive}>Inactive</div>}
        <h2 className={styles.cardTitle}>Distributor</h2>
        <div className={styles.mL}></div>
        <ContractData />
        <ContractInteraction isDistributing={isDistributing}/>
      </div>
    </div>
  );
};

export default Distributor;
