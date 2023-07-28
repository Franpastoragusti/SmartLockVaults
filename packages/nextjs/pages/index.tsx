import { useState } from "react";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import Modal from "~~/components/create/createModal/createModal";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { VaultCard } from "~~/components/core/vaultCard/vaultCard";
import { SmartLockButton } from "~~/components/core/smartLockButton/smartLockButton";

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useAccount();
  const { data: vaultAddresses, refetch } = useScaffoldContractRead({
    contractName: "SmartLockFactory",
    functionName: "getMyVaults",
    //@ts-ignore
    args: [],
    account:account.address
  });
  
  
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 
  return (
    <>
      <MetaHeader />
      <div className={`${styles.mainPage} `}>
        <h1 className={`${styles.title} text-primary`}>Smart Lock Vaults</h1>
        <ul className={styles.list}>
          {(vaultAddresses ?? []).map((item, i) => (
              <VaultCard  
              key={i}
              address={item}
              />
          ))}
          <li className={styles.createButton}>
            <SmartLockButton isLoading={false} disabled={false} label={"Create"} action={handleButtonClick}></SmartLockButton>
          </li>
        </ul>
      </div>
      {isModalOpen && <Modal onCreateCallback={refetch} onClose={handleCloseModal} title="Create"></Modal>}
    </>
  );
};

export default Home;