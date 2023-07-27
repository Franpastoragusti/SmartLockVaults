import { useEffect } from "react";
import VaultContract from "../../../../hardhat/artifacts/contracts/Vault.sol/Vault.json";
import styles from "./vaultCard.module.css";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface IProps {
  index: number;
  address: string;
  confirmLastIndex: () => void;
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

export const VaultCard = ({ index, confirmLastIndex, address }: IProps) => {
  const { data: vaultAddress } = useScaffoldContractRead({
    contractName: "SmartLockFactory",
    functionName: "VaultsDeployed",
    //@ts-ignore
    args: [address, index],
  });
  debugger
  useEffect(() => {
    if (!!vaultAddress) {
      confirmLastIndex();
    }
  }, [vaultAddress]);

  const { data: distributeAddresses } = useContractRead({
    address: vaultAddress,
    abi: VaultContract.abi,
    functionName: "readDistributeAddresses",
  });
  const { data: distributionBlock, refetch:distributionRefetch } = useContractRead({
    address: vaultAddress,
    abi: VaultContract.abi,
    functionName: "distributionBlock",
  });
  const { data: periodInDays } = useContractRead({
    address: vaultAddress,
    abi: VaultContract.abi,
    functionName: "periodInDays",
  });
  const { writeAsync:allIsFine } = useContractWrite({
    address: vaultAddress,
    abi: VaultContract.abi,
    functionName: 'allIsFine',
  })
  const { writeAsync:distribute } = useContractWrite({
    address: vaultAddress,
    abi: VaultContract.abi,
    functionName: 'distribute',
  })
  const { writeAsync:withdraw } = useContractWrite({
    address: vaultAddress,
    abi: VaultContract.abi,
    functionName: 'withdraw',
  })

  if (!distributionBlock || !vaultAddress || !vaultAddress) {
    return <></>;
  }
  let distributonType = "Equal";
  const distributionLabel = `${distributonType} Distribution each ${periodInDays} day`;
  return (
    <li className={styles.distribution}>
      <div className={styles.addressContainer}>
        <Address size="sm" address={vaultAddress} format="short" />
        <Balance address={vaultAddress} />
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