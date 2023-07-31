const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        SmartLockFactory: {
          address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
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
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
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
              name: "getMyAssignedVaults",
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
              name: "getMyDeployedVaults",
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
