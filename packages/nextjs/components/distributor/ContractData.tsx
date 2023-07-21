import { Spinner } from "../Spinner";
import styles from "./contractData.module.css";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useFetchBlocks,
  useScaffoldContractRead,
} from "~~/hooks/scaffold-eth";

const MARQUEE_PERIOD_IN_SEC = 5;
const CONTRACT_NAME = "YourContract";
export const ContractData = () => {
  const { address } = useAccount();
  const { totalBlocks } = useFetchBlocks();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(CONTRACT_NAME);

  const { data: distributionBlock, isLoading: distributionBlockLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "distributionBlock",
  });

  const { data: distributeAddresses, isLoading: distributeAddressesLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "readDistributeAddresses",
  });

  const { data: owner, isLoading: ownerLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "owner",
  });
  const { data: periodInDays, isLoading: periodInDaysLoading } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "periodInDays",
  });
  if (!deployedContractData) {
    return <Spinner></Spinner>;
  }
  return (
    <div className={styles.contractData}>
        <div className={styles.addressContainer}>
          <Address address={deployedContractData.address} />
          <Balance address={deployedContractData.address} />
        </div>
      <div className={styles.addresses}>
        {distributeAddresses?.map(item => (
          <Address address={item} />
        ))}
      </div>
      <div className={styles.mL}></div>
      <p>PeriodInDays: {periodInDays?.toString() || "0"}</p>
      <p>CurrentBlock: {totalBlocks.toString() || "0"}</p>
      <p>DistributionBlock: {distributionBlock?.toString() || "0"}</p>
    </div>
  );
};

// useScaffoldEventSubscriber({
//   contractName: CONTRACT_NAME,
//   eventName: "GreetingChange",
//   listener: logs => {
//     logs.map(log => {
//       const { greetingSetter, value, premium, newGreeting } = log.args;
//       console.log("📡 GreetingChange event", greetingSetter, value, premium, newGreeting);
//     });
//   },
// });

// const {
//   data: myGreetingChangeEvents,
//   isLoading: isLoadingEvents,
//   error: errorReadingEvents,
// } = useScaffoldEventHistory({
//   contractName: CONTRACT_NAME,
//   eventName: "GreetingChange",
//   fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
//   filters: { greetingSetter: address },
//   blockData: true,
// });
