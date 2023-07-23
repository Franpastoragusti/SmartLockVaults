const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        DistributorFactory: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
                  indexed: false,
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
              ],
              name: "NewDistributorCreated",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
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
              name: "CreateNewDistributor",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "DistributorsDeployed",
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
