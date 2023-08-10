import { expect } from "chai";
import { ethers } from "hardhat";
import { SmartLockFactory, Vault } from "../typechain-types";

const defaultVaultOnce = {
  frec: BigInt(30),
  distributionFrec: BigInt(30),
  distributeAddresses: ["0xcD5873a6c339FEcd9e16f9Cc68A19D8AD3ABAA2e", "0xA221Fc957eE8Bf38E685EA963495f00b204468BA"],
  name: "Test Once",
  distibutionType: BigInt(0),
  distributionValue: BigInt(0),
};

const defaultVaultFixed = {
  frec: BigInt(300),
  distributionFrec: BigInt(3000),
  distributeAddresses: [
    "0xcD5873a6c339FEcd9e16f9Cc68A19D8AD3ABAA2e",
    "0x05C2e5A9d75Fd02A30e3A9109EB080aab7a8d5AC",
    "0xA221Fc957eE8Bf38E685EA963495f00b204468BA",
  ],
  name: "Test Fixed",
  distibutionType: BigInt(1),
  distributionValue: BigInt(1),
};

describe("SmartLockFactory", function () {
  // We define a fixture to reuse the same setup in every test.

  let smartLockFactory: SmartLockFactory;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("SmartLockFactory");
    smartLockFactory = (await yourContractFactory.deploy(owner.address)) as SmartLockFactory;
    await smartLockFactory.deployed();
  });

  describe("Deployment", function () {
    it("Should be deployed adn initial values to 0", async function () {
      const assigend = await smartLockFactory.getMyAssignedVaults();
      const deployed = await smartLockFactory.getMyDeployedVaults();

      expect(assigend.length).to.equal(0);
      expect(deployed.length).to.equal(0);
    });
  });

  describe("CreateVault", function () {
    it("Should create a vault without paying", async function () {
      // Check Initial Balance
      const initialBalance = await ethers.provider.getBalance(smartLockFactory.address);
      expect(initialBalance).to.equal(0);

      await smartLockFactory.CreateNewVault(
        defaultVaultOnce.frec,
        defaultVaultOnce.distributionFrec,
        defaultVaultOnce.distributeAddresses,
        defaultVaultOnce.name,
        defaultVaultOnce.distibutionType,
        defaultVaultOnce.distributionValue,
        {
          value: 0,
        },
      );
      // Check Actual Balance
      const actualBalance = await ethers.provider.getBalance(smartLockFactory.address);
      expect(actualBalance).to.equal(0);

      // Check Initial Contract Variables
      const assigend = await smartLockFactory.getMyAssignedVaults();
      const deployed = await smartLockFactory.getMyDeployedVaults();
      expect(assigend.length).to.equal(0);
      expect(deployed.length).to.equal(1);

      // Check Initial VaultContract Variables
      const youtVault = (await ethers.getContractAt("Vault", deployed[0])) as Vault;
      expect(await youtVault.frec()).to.equal(defaultVaultOnce.frec);
      expect(await youtVault.distributionFrec()).to.equal(defaultVaultOnce.distributionFrec);
      const distributedAddreses = await youtVault.readDistributeAddresses();
      expect(distributedAddreses.length).to.equal(defaultVaultOnce.distributeAddresses.length);
      expect(await youtVault.name()).to.equal(defaultVaultOnce.name);
      expect(await youtVault.distibutionType()).to.equal(defaultVaultOnce.distibutionType);
      expect(await youtVault.distributionValue()).to.equal(defaultVaultOnce.distributionValue);
    });

    it("Should create a vault paying 0.3 ETH", async function () {
      // Check Initial Balance
      const initialBalance = await ethers.provider.getBalance(smartLockFactory.address);
      expect(initialBalance).to.equal(0);
      const amount = ethers.utils.parseEther("0.3");
      await smartLockFactory.CreateNewVault(
        defaultVaultFixed.frec,
        defaultVaultFixed.distributionFrec,
        defaultVaultFixed.distributeAddresses,
        defaultVaultFixed.name,
        defaultVaultFixed.distibutionType,
        defaultVaultFixed.distributionValue,
        {
          value: amount,
        },
      );
      // Check Actual Balance
      const actualBalance = await ethers.provider.getBalance(smartLockFactory.address);
      expect(actualBalance).to.equal(amount);
    });
  });

  describe("Withdraw", function () {
    it("should not allow non-owners to withdraw funds", async function () {
      const nonOwner = await ethers.provider.getSigner(1);

      const initialBalance = await ethers.provider.getBalance("0xcD5873a6c339FEcd9e16f9Cc68A19D8AD3ABAA2e");

      await expect(smartLockFactory.connect(nonOwner).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );

      const finalBalance = await ethers.provider.getBalance("0xcD5873a6c339FEcd9e16f9Cc68A19D8AD3ABAA2e");
      expect(finalBalance).to.be.closeTo(initialBalance, ethers.utils.parseEther("0.001"));
    });

    it("should allow the owner to withdraw funds", async function () {
      const [owner2] = await ethers.getSigners();
      const initialBalance = await ethers.provider.getBalance(owner2.address);
      const withdrawAmount = ethers.utils.parseEther("0.3"); // Amount in ether

      await smartLockFactory.connect(owner2).withdraw();

      const finalBalance = await ethers.provider.getBalance(owner2.address);

      expect(finalBalance).to.be.closeTo(initialBalance.add(withdrawAmount), ethers.utils.parseEther("0.001"));
    });
  });
});
