import { expect } from "chai";
import { ethers } from "hardhat";
import { Vault } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { defaultVaultPercentaje } from "../fixtures/fixtures";

describe("Vault Percentaje", function () {
  // We define a fixture to reuse the same setup in every test.
  let vault: Vault;
  let owner: SignerWithAddress;
  let deployer: SignerWithAddress;
  before(async () => {
    [deployer, owner] = await ethers.getSigners();

    const yourContractFactory = await ethers.getContractFactory("Vault");
    vault = (await yourContractFactory.deploy(
      owner.address,
      defaultVaultPercentaje.frec,
      defaultVaultPercentaje.distributionFrec,
      defaultVaultPercentaje.distributeAddresses,
      defaultVaultPercentaje.name,
      defaultVaultPercentaje.distibutionType,
      defaultVaultPercentaje.distributionValue,
    )) as Vault;

    await vault.deployed();
  });

  it("should let the user know that the contract is locked", async () => {
    await expect(vault.connect(deployer).distribute()).to.be.revertedWith("Contract is locked");
  });
  it("should distribute funds correctly", async () => {
    //Should distribute the percentaje not the half for each account
    const user1 = await ethers.provider.getSigner(defaultVaultPercentaje.distributeAddresses[0]);
    const user2 = await ethers.provider.getSigner(defaultVaultPercentaje.distributeAddresses[1]);
    const user1BalanceBefore = await user1.getBalance();
    const user2BalanceBefore = await user2.getBalance();
    const amount = ethers.utils.parseEther("100");
    await deployer.sendTransaction({
      to: vault.address,
      value: amount.toBigInt(),
    });
    await expect(vault.connect(deployer).distribute()).to.be.revertedWith("Contract is locked");
    const specificTimestamp = Date.now() + (parseInt(`${defaultVaultPercentaje.frec}`) + 300) * 1000; // Replace with the timestamp you want
    await ethers.provider.send("evm_setNextBlockTimestamp", [specificTimestamp]);

    await vault.connect(deployer).distribute();
    const user1BalanceAfter = await user1.getBalance();
    const user2BalanceAfter = await user2.getBalance();
    console.log("user1BalanceBefore", user1BalanceBefore, user1BalanceAfter);
    console.log("user2BalanceBefore", user2BalanceBefore, user2BalanceBefore);
    expect(user1BalanceBefore).to.be.gt(user1BalanceAfter);
    expect(user2BalanceAfter).to.be.gt(user2BalanceBefore);
  });
});
