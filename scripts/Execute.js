const hre = require("hardhat");

const FACTORY_ADDRESS = "0x004bAe156F198e9e05824A534ecDc4070745Bf8E";
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0x7D0165344149f387eCCb8dE4D13E230bfdfAD87c";

async function main() {
  console.log("Getting EntryPoint contract...");
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  console.log("EntryPoint contract fetched:", entryPoint.target);

  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");

  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);
let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (ex) {
    sender = "0x" + ex.data.slice(-40);
  }

  const code = await hre.ethers.provider.getCode(sender);
  if (code !== "0x") {
    initCode = "0x";
  }

  console.log("smart account:", { sender });

  console.log("Init code:", initCode);

  /*await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther(".2"),
  });*/

  // CREATE
  const Account = await hre.ethers.getContractFactory("Account");
  const userOp = {
    sender,
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    /* callGasLimit: 400_000, // Increased gas limit
    verificationGasLimit: 400_000, // Increased gas limit
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),*/
    paymasterAndData: PM_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const {preVerificationGas, verificationGasLimit, callGasLimit} = await ethers.provider.send("eth_estimateUserOperationGas", [
    userOp,
    EP_ADDRESS,
  ]);

  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;

  const {maxFeePerGas} = await ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas");
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

 console.log("userOp:", userOp);
  
  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS,]);

  setTimeout(async () => {
    const { transactionHash } = await ethers.provider.send("eth_getUserOperationByHash", [opHash]);

  console.log("Transaction hash:", transactionHash);

  }, 5000);


 /* const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);*/
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
