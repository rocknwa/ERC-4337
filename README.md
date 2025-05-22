## Account Abstraction (ERC-4337)

This project demonstrates deploying and interacting with **smart contract accounts** and a **paymaster** using the ERC-4337 EntryPoint, enabling gasless transactions and flexible account management.

---

### ✨ Features

- **Smart Contract Accounts:**  
  Flexible accounts managed by `AccountFactory`.

- **Paymaster:**  
  Sponsors gas fees for user operations, improving UX.

- **EntryPoint:**  
  Handles user operations, ensuring compatibility with ERC-4337 bundlers.

---

### 🛠️ Modules and Workflow

#### **Account.js**
- Deploys `AccountFactory` and `Paymaster` in a reproducible way.

#### **Execute.js**
- Fetches the EntryPoint contract at `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`.
- Creates a new account using `AccountFactory`.
- Constructs and signs a user operation to call the `execute` function on the account.
- Submits the user operation to the EntryPoint.
- Retrieves and displays the transaction hash.

#### **test.js**
- Tests the `count` function of the Account contract.

#### **sig.js**
- Deposits ETH to the paymaster for gas sponsorship.

---

### 📚 Summary

This project provides a practical implementation of ERC-4337 account abstraction, showcasing:
- Flexible account management via smart contract accounts.
- Gasless transactions through paymaster sponsorship.
- End-to-end flow from account creation to user operation execution using the EntryPoint.

---


sig.js: Deposits ETH to the paymaster for gas sponsorship.





