Tamper-Proof Data Solution
This project adds a solution to ensure that data is tamper-proof and recoverable in case of tampering. Here's how it works:

How It Works
Ensuring Data Integrity:

The client generates a SHA-256 hash of the data and sends it to the backend along with the data.
When retrieving the data, the client recalculates the hash and compares it with the stored hash to detect tampering.
Recovering Tampered Data:

The original data is stored in IPFS (a decentralized storage system).
If tampering is detected, the client uses the CID (Content Identifier) to fetch and restore the original data from IPFS.
What’s Added
Frontend:

Hash generation and verification using SHA-256.
Integration with IPFS for storing and recovering data.
Alerts for tampering and seamless recovery.
Backend:

Stores the data, its hash, and the IPFS CID.
Endpoints to save and retrieve the data securely.
