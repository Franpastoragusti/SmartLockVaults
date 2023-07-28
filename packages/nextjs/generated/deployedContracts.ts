const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        SmartLockFactory: {
          address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_factoryOwner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "contractAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "executedBy",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address[]",
                  name: "distributeAddresses",
                  type: "address[]",
                },
              ],
              name: "NewVaultCreated",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_notificationPeriod",
                  type: "uint256",
                },
                {
                  internalType: "address payable[]",
                  name: "_distributeAddresses",
                  type: "address[]",
                },
              ],
              name: "CreateNewVault",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "factoryOwner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "getMyVaults",
              outputs: [
                {
                  internalType: "address[]",
                  name: "",
                  type: "address[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
