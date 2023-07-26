import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
//import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployDistributor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const distributeAddresses: Address[] = [
    "0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A",
    "0x32d3B95D3B34b3D118F0396f082E6ae731092d6b",
  ];
  const notificationPeriod = 1;
  const owner = "0xc5d4D2DB5D5bB9d1d29B60137663D2DcBe7a3D3f";
  await deploy("Distributor", {
    from: deployer,
    // Contract constructor arguments
    args: [owner, notificationPeriod, distributeAddresses],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  // const yourContract = await hre.ethers.getContract("YourContract", deployer);
};

export default deployDistributor;

// // Tags are useful if you have multiple deploy files and only want to run one of them.
// // e.g. yarn deploy --tags YourContract
// deployDistributor.tags = ["Distributor"];

// async function mineBlocks(blockNumber:number) {
//   for (let i = 0; i < blockNumber; i++) {
//     await ethers.provider.send("evm_mine", []);
//   }
// }
// mineBlocks(100 * 24 * 60 * 60 / 15)

// const deployDistributorFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   /*
//       On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

//       When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
//       should have sufficient balance to pay for the gas fees for contract creation.

//       You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
//       with a random private key in the .env file (then used on hardhat.config.ts)
//       You can run the `yarn account` command to check your balance in every network.
//     */
//   const { deployer } = await hre.getNamedAccounts();
//   const { deploy } = hre.deployments;
//   // const distributeAddresses: Address[] = ["0x32405C7bbF55e281dcCd40D836463C8E88ba1B6A","0x32d3B95D3B34b3D118F0396f082E6ae731092d6b"];
//   // const notificationPeriod = 1;
//   const owner = "0xc5d4D2DB5D5bB9d1d29B60137663D2DcBe7a3D3f";
//   await deploy("DistributorFactory", {
//     from: deployer,
//     // Contract constructor arguments
//     args: [owner],
//     log: true,
//     // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
//     // automatically mining the contract deployment transaction. There is no effect on live networks.
//     autoMine: true,
//   });

//   // Get the deployed contract
//   // const yourContract = await hre.ethers.getContract("YourContract", deployer);
// };

// export default deployDistributorFactory;

// deployDistributorFactory.tags = ["DistributorFactory"];
