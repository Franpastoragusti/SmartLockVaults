import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { useAccount, useContractRead } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { DistributionCard, IDistributionSelections } from "~~/components/core/distributionCard/distributionCard";
import { Distributton } from "~~/components/core/distributton/distributton";
import Modal from "~~/components/create/createModal/createModal";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const DISTRIBUTIONS: IDistributionSelections[] = [
  {
    type: "equal",
    frecuency: "each",
    time: "years",
    period: 1,
    distributeAddresses: ["0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A", "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b"],
    distributionBlock: 93827,
    address: "0x42405C7bbF55e281dcCd40D836463C8E88b7AB6A",
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address: "0x32405C7bbF55e281dcCd40D836463C8F88b7AB6A",
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address: "0x32405C7bbF55e281dcCd40D836463C8E88b7ABBA",
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address: "0x32405C7bbF55e281dcCd40D836463D8E88b7AB6A",
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address: "0x32405C7bbF55e281dcCd40D83646438E88b7AB6A",
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 1,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32805C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 100312,
    address: "0x32405C7bbF55e281dcCd40C836463C8E88b7AB6A",
  },
  {
    type: "equal",
    frecuency: "each",
    time: "days",
    period: 30,
    distributeAddresses: [
      "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
      "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
      "0x32405C7bbF55e281dcCd90D836463C8E88ba1B6A",
      "0x36505C7bbF55e281dcCd40D836463C8E88ba1B6A",
    ],
    distributionBlock: 46374,
    address: "0x32405C7bbF55e281dcCd40D836463C8E88b7AB6A",
  },
];

const distributeAddresses: string[] = [
  "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
  "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
];
//Array.from({ length: totalDistributors }, () => 0)
const size: number = 10; // Replace 10 with the desired size of the array

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useAccount();
  const [totalDistributors, setTotalDistributors] = useState<number>(1);

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "DistributorFactory",
    functionName: "CreateNewDistributor",
    args: [account.address, BigInt(1), distributeAddresses],
    value: "0.01",
    onBlockConfirmation: txnReceipt => {
      debugger;
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const createDistributor = () => {
    writeAsync();
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    createDistributor();
    setIsModalOpen(false);
  };


  console.log(totalDistributors)
  return (
    <>
      <MetaHeader />
      <div className={styles.mainPage}>
        <h1 className={styles.title}>Your Distributions</h1>
        <ul className={styles.list}>
          {!!account && DISTRIBUTIONS.slice(0, totalDistributors).map((item, i) => (
              <DistributionCard  
              key={i}
              index={i}
              address={account.address!}
              distribution={item}
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

interface IDataDispl {
  index: number;
  address: string;
  confirmLastIndex:() => void
}

const Displ = ({ index, address, confirmLastIndex }: IDataDispl) => {
  const { data: distributorAddress, error: errorIn } = useScaffoldContractRead({
    contractName: "DistributorFactory",
    functionName: "DistributorsDeployed",
    //@ts-ignore
    args: [address, index],
  });
  useEffect(() => {
    if(!!distributorAddress){
      confirmLastIndex()
    }
  },[distributorAddress])

  
  return <p>{distributorAddress}</p>;
};
