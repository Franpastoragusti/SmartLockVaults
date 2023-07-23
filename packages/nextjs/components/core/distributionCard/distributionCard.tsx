import { useEffect } from "react";
import DistributorContract from "../../../../hardhat/artifacts/contracts/Distributor.sol/Distributor.json";
import styles from "./distributionCard.module.css";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface IProps {
  index: number;
  address: string;
  confirmLastIndex: () => void;
}

export interface IDistributionSelections {
  type: "equal" | "not-equal";
  frecuency: "each" | "periodic";
  time: "blocks" | "days" | "years";
  period: number;
  distributeAddresses: any[];
  distributionBlock: number;
  address: string;
}

export const DistributionCard = ({ index, confirmLastIndex, address }: IProps) => {
  const { data: distributorAddress } = useScaffoldContractRead({
    contractName: "DistributorFactory",
    functionName: "DistributorsDeployed",
    //@ts-ignore
    args: [address, index],
  });

  useEffect(() => {
    if (!!distributorAddress) {
      confirmLastIndex();
    }
  }, [distributorAddress]);

  const { data: distributeAddresses } = useContractRead({
    address: distributorAddress,
    abi: DistributorContract.abi,
    functionName: "readDistributeAddresses",
  });
  const { data: distributionBlock, refetch:distributionRefetch } = useContractRead({
    address: distributorAddress,
    abi: DistributorContract.abi,
    functionName: "distributionBlock",
  });
  const { data: periodInDays } = useContractRead({
    address: distributorAddress,
    abi: DistributorContract.abi,
    functionName: "periodInDays",
  });
  const { writeAsync:allIsFine } = useContractWrite({
    address: distributorAddress,
    abi: DistributorContract.abi,
    functionName: 'allIsFine',
  })
  const { writeAsync:distribute } = useContractWrite({
    address: distributorAddress,
    abi: DistributorContract.abi,
    functionName: 'distribute',
  })
  const { writeAsync:withdraw } = useContractWrite({
    address: distributorAddress,
    abi: DistributorContract.abi,
    functionName: 'withdraw',
  })

  if (!distributionBlock || !distributorAddress || !distributorAddress) {
    return <></>;
  }
  let distributonType = "Equal";
  const distributionLabel = `${distributonType} Distribution each ${periodInDays} day`;
  return (
    <li className={styles.distribution}>
      <div className={styles.addressContainer}>
        <Address size="sm" address={distributorAddress} format="short" />
        <Balance address={distributorAddress} />
        <div className={styles.section}>
        <button onClick={() => {
          allIsFine().then(() =>{
            distributionRefetch()
          })
        
          }}>allIsFine</button>
          <button onClick={() => distribute()}>distribute</button>
          <button onClick={() => withdraw()}>withdraw</button>
        </div>
      </div>
      <div className={styles.information}>
        <div className={styles.section}>
          <div>
            <p className={styles.infoTitle}>Definition</p>
            <p className={styles.infoLabel}>{distributionLabel}</p>
          </div>
          <div>
            <p className={styles.infoTitle}>Next distribution</p>
            <p className={styles.infoLabel}>{distributionBlock + ""}</p>
          </div>
        </div>
       
        <div className={styles.section}>
          <p className={styles.infoTitle}>Beneficiaries</p>
          <div className={styles.beneficiaries}>
            {(distributeAddresses as string[]).map((addresse, i) => (
              <Address key={i} address={addresse}></Address>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};
