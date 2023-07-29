import { useEffect } from "react";
import VaultContract from "../../../../hardhat/artifacts/contracts/Vault.sol/Vault.json";
import styles from "./vaultCard.module.css";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

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

export const VaultCard = ({ address }: IProps) => {

  const { data: distributeAddresses } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "readDistributeAddresses",
  });
  const { data: distributionBlock, refetch:distributionRefetch } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "distributionTimeStamp",
  });
  const { data: frec } = useContractRead({
    address: address,
    abi: VaultContract.abi,
    functionName: "frec",
  });
  const { writeAsync:allIsFine } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: 'allIsFine',
  })
  const { writeAsync:distribute } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: 'distribute',
  })
  const { writeAsync:withdraw } = useContractWrite({
    address: address,
    abi: VaultContract.abi,
    functionName: 'withdraw',
  })

  if (!distributionBlock || !address) {
    return <></>;
  }
  let distributonType = "Equal";
  const distributionLabel = `${distributonType} Distribution each ${frec} day`;
  return (
    <li className={`${styles.distribution} bg-base-300`}>
      <div className={styles.addressContainer}>
        <Address size="sm" address={address} format="short" />
        <Balance address={address} />
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
            <p className={`${styles.infoTitle} text-info`}>Definition</p>
            <p className={styles.infoLabel}>{distributionLabel}</p>
          </div>
          <div>
            <p className={`${styles.infoTitle} text-info`}>Next distribution</p>
            <p className={styles.infoLabel}>{distributionBlock + ""}</p>
          </div>
        </div>
       
        <div className={styles.section}>
          <p className={`${styles.infoTitle} text-info`}>Beneficiaries</p>
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
