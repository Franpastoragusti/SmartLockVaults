import { useState } from "react";
import styles from "./index.module.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { SmartLockButton } from "~~/components/smartLockVault/smartLockButton/smartLockButton";
import { Tabs } from "~~/components/smartLockVault/tabs/tabs";
import { VaultCard } from "~~/components/smartLockVault/vaultCard/vaultCard";
import Modal from "~~/components/smartLockVault/createModal/createModal";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useAccount();
  const { data: deployedVaultAddresses, refetch:refetchDeployed } = useScaffoldContractRead({
    contractName: "SmartLockFactory",
    functionName: "getMyDeployedVaults",
    //@ts-ignore
    args: [],
    account: account.address,
  });
  const { data: assignedVaultAddresses } = useScaffoldContractRead({
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

  return (
    <>
      <MetaHeader />
      <div className={`${styles.mainPage} `}>
        <h1 className={`${styles.title} text-primary`}>Smart Lock Vaults</h1>
        <Tabs tabTitles={["Deployed", "Assigned"]}>
          {active => {
            const isDeployed = active == 0;
            const vaults = isDeployed ? deployedVaultAddresses : assignedVaultAddresses;
            return (
              <div>
                <ul className={styles.list}>
                    {(vaults ?? []).map((item, i) => (
                      <VaultCard key={i} address={item} />
                    ))}
                    {isDeployed ? <div className={styles.createButtonContainer}>
                      <li className={styles.createButton}>
                        <SmartLockButton
                          isLoading={false}
                          disabled={false}
                          label={"Create"}
                          action={handleButtonClick}
                        ></SmartLockButton>
                      </li>
                    </div>: <></>}
                  </ul>
              </div>
            );
          }}
        </Tabs>
      </div>
      {isModalOpen && <Modal onCreateCallback={refetchDeployed} onClose={handleCloseModal} title="Create"></Modal>}
    </>
  );
};

export default Home;
