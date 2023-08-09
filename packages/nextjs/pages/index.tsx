import { useEffect, useState } from "react";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import Modal from "~~/components/smartLockVault/createModal/createModal";
import { SmartLockButton } from "~~/components/smartLockVault/smartLockButton/smartLockButton";
import { Tabs } from "~~/components/smartLockVault/tabs/tabs";
import { VaultCard } from "~~/components/smartLockVault/vaultCard/vaultCard";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(true);
  const account = useAccount();
  const {
    data: deployedVaultAddresses,
    refetch: refetchDeployed,
    isLoading: deployedVaultsLoading,
  } = useScaffoldContractRead({
    contractName: "SmartLockFactory",
    functionName: "getMyDeployedVaults",
    //@ts-ignore
    args: [],
    account: account.address,
  });
  const { data: assignedVaultAddresses, isLoading: assignedVaultsLoading } = useScaffoldContractRead({
    contractName: "SmartLockFactory",
    functionName: "getMyAssignedVaults",
    //@ts-ignore
    args: [],
    account: account.address,
  });

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {

    setTimeout(() => {
      setAnimateItems(false)
    }, 2000);
  }, [])
  

  return (
    <>
      <MetaHeader />

      <div className={`${styles.mainPage} `}>
        <h1 className={`${styles.title} text-primary`}>Smart Lock Vaults</h1>
        <Tabs tabTitles={["Deployed", "Assigned"]}>
          {active => {
            const isDeployed = active == 0;
            const vaults = isDeployed ? deployedVaultAddresses : assignedVaultAddresses;
            const isLoading = isDeployed ? deployedVaultsLoading : assignedVaultsLoading;
            return (
              <ul className={styles.list}>
                {!isLoading && vaults?.length == 0 ? (
                  <div className={styles.emptyVaults}>No vaults {isDeployed ? "deployed" : "assigned"}</div>
                ) : (
                  <></>
                )}
                {(vaults ?? []).map((item, i) => (
                  <VaultCard key={i} address={item} isOwner={isDeployed} delay={!animateItems ? 0 : (i * 0.2)+3  } />
                ))}
                {isDeployed ? (
                  <div className={styles.createButtonContainer}>
                    <li className={styles.createButton}>
                      <SmartLockButton
                        isLoading={false}
                        disabled={false}
                        label={"Create"}
                        action={handleButtonClick}
                      ></SmartLockButton>
                    </li>
                  </div>
                ) : (
                  <></>
                )}
              </ul>
            );
          }}
        </Tabs>
      </div>
      {isModalOpen && (
        <Modal onCreateCallback={refetchDeployed} onClose={handleCloseModal} title="Create Vault"></Modal>
      )}
    </>
  );
};

export default Home;
