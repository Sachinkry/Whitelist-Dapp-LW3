import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useRef, useEffect, useState } from "react";
import { providers } from "ethers";


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef() // return the object with key named current

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
    });
    console.log("FDSSDF", web3ModalRef.current);
  }, [walletConnected]);

  const getSignerOrProvider = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      alert('SWITCH TO RINKEBY NETWORK');
      throw new Error('Change to rinkeby');
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };




  async function connectWallet() {
    try {
      await getSignerOrProvider();
      setWalletConnected(true);
      console.log("maniac")
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            0 have already joined the Whitelist
          </div>
          <button className={styles.btn} onClick={connectWallet}>{!walletConnected ? 'Connect Wallet' : 'Connected'}</button>
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
