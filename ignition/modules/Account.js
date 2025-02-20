// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PaymasterModule", (m) => {
   
  const paymaster = m.contract("Paymaster");
  const entryPoint = m.contract("EntryPoint");
  const accountFactory = m.contract("AccountFactory");

  return { paymaster, entryPoint, accountFactory };
});

