import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { useAccount, useContractRead } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { DistributionCard, IDistributionSelections } from "~~/components/core/distributionCard/distributionCard";
import { Distributton } from "~~/components/core/distributton/distributton";
import Modal from "~~/components/create/createModal/createModal";
import { useFetchBlocks, useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";


const size: number = 10; // Replace 10 with the desired size of the array
const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useAccount();
  const [totalDistributors, setTotalDistributors] = useState<number>(1);


  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
    } = useScaffoldEventHistory({
    contractName: "DistributorFactory",
    eventName: "NewDistributorCreated",
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
          {!!account && Array.from({ length: totalDistributors }, () => 0).slice(0, totalDistributors).map((item, i) => (
              <DistributionCard  
              key={i}
              index={i}
              address={account.address!}
              confirmLastIndex={() => setTotalDistributors(i+2)}
              />
          ))}
          <li className={styles.createButton}>
            <Distributton isLoading={false} disabled={false} label={"Create"} action={handleButtonClick}></Distributton>
          </li>
        </ul>
      </div>
      {isModalOpen && <Modal onClose={handleCloseModal} title="Create"></Modal>}
    </>
  );
};

export default Home;