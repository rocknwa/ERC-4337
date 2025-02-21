const hre = require("hardhat");

const ACCOUNT_ADDR = "0x7c974d348c2d2ac0e5542d41ca5e2b0e02b333a2";
 

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.count();
  console.log("Count:", count.toString());
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
