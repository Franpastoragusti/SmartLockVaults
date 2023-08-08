const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        SmartLockFactory: {
          address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
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
                  name: "_frec",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_distributionFrec",
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
                {
                  internalType: "uint256",
                  name: "_distibutionType",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_distributionValue",
                  type: "uint256",
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
