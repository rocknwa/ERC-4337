const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0x7D0165344149f387eCCb8dE4D13E230bfdfAD87c";


async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
     
  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther(".2"),
  });
  console.log("Deposit complete");
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
