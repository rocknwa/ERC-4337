const hre = require("hardhat");


const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  console.log("Getting EntryPoint contract...");
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  console.log("EntryPoint contract fetched:", entryPoint.target);

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  
  const initCode = //"0x";
   FACTORY_ADDRESS + AccountFactory.interface
    .encodeFunctionData("createAccount", [address0])
    .slice(2);

    console.log("smart account:", {sender})

  console.log("Init code:", initCode);

 await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther("100"),
  });

  // CREATE
  const Account = await hre.ethers.getContractFactory("Account");
  const userOp = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 400_000, // Increased gas limit
    verificationGasLimit: 400_000, // Increased gas limit
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x",
  };

  console.log("UserOp:", userOp);
  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));


  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });