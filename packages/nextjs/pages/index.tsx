import { useState } from "react";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import Modal from "~~/components/create/createModal/createModal";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { VaultCard } from "~~/components/core/vaultCard/vaultCard";
import { SmartLockButton } from "~~/components/core/smartLockButton/smartLockButton";


const size: number = 10; // Replace 10 with the desired size of the array
const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useAccount();
  const [totalVaults, setTotalVaults] = useState<number>(1);


  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
    } = useScaffoldEventHistory({
    contractName: "SmartLockFactory",
    eventName: "NewVaultCreated",
    fromBlock: 0n,
    filters:{contractAddress:account.address!},
    blockData: true,
  });

  if(events){
    console.log(events)
  }
 
  
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 

  return (
    <>
      <MetaHeader />
      <div className={styles.mainPage}>
        <h1 className={styles.title}>Your Distributions</h1>
        <ul className={styles.list}>
          {!!account && Array.from({ length: totalVaults }, () => 0).slice(0, totalVaults).map((item, i) => (
              <VaultCard  
              key={i}
              index={i}
              address={account.address!}
              confirmLastIndex={() => setTotalVaults(i+2)}
              />
          ))}
          <li className={styles.createButton}>
            <SmartLockButton isLoading={false} disabled={false} label={"Create"} action={handleButtonClick}></SmartLockButton>
          </li>
        </ul>
      </div>
      {isModalOpen && <Modal onClose={handleCloseModal} title="Create"></Modal>}
    </>
  );
};

export default Home;