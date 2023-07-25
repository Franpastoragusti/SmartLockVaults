import { ethers } from "hardhat";

async function increaseBlockNumber(blocksToIncrease: number) {
  for (let i = 0; i < blocksToIncrease; i++) {
    // Send a transaction to mine a new block (for example, send a transaction to yourself)
    await ethers.provider.send("evm_mine", []);
    // You can also use ethers.js to send a transaction or call a function on any contract

    // Add a delay to simulate block mining time (adjust the delay as needed)
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
  }
}

async function main() {
  const blocksToIncrease = (1 * 24 * 60 * 60) / 15; // Replace this with the number of blocks you want to increase
  await increaseBlockNumber(blocksToIncrease);

  const currentBlockNumber = await ethers.provider.getBlockNumber();
  console.log(`Current block number: ${currentBlockNumber}`);
}

main();
