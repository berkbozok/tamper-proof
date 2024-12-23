import React, { useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import crypto from "crypto";

const API_URL = "http://localhost:8080";
const IPFS_URL = "https://ipfs.infura.io/ipfs/";

function generateHash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

function App() {
  const [data, setData] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [cid, setCid] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(`${API_URL}/data`);
    const { data, hash, cid } = await response.json();
    setData(data);
    setHash(hash);
    setCid(cid);
  };

  const updateData = async () => {
    const dataHash = generateHash(data);
    const ipfsResult = await ipfs.add(data);
    setCid(ipfsResult.path);

    await fetch(`${API_URL}/data`, {
      method: "POST",
      body: JSON.stringify({ data, hash: dataHash, cid: ipfsResult.path }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = () => {
    const calculatedHash = generateHash(data);
    if (calculatedHash !== hash) {
      alert("Data integrity check failed! Fetching backup...");
      recoverData();
    } else {
      alert("Data is valid!");
    }
  };

  const recoverData = async () => {
    const response = await fetch(`${IPFS_URL}${cid}`);
    const recoveredData = await response.text();
    setData(recoveredData);
    alert("Recovered data from IPFS!");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
