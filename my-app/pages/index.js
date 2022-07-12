import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useRef, useEffect, useState } from "react";
import { providers, Contract } from "ethers";
import {WHITELIST_CONTRACT_ADDRESS, abi} from "../constants"


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0)
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {}
      });
    }
    console.log(web3ModalRef.current);
  }, [walletConnected]);

  const getSignerOrProvider = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    // console.log(provider);
    console.log(web3Provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      alert("NOT ON RINKEBY NETWORK");
      throw error("change to rinkeby network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);

      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getSignerOrProvider();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await WHITELIST_CONTRACT_ADDRESS.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist)
    } catch (err) {
      console.err
    }
  }

  const connectWallet = async () => {
    try {
      await getSignerOrProvider();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();

    } catch (err) {
      console.log('error:', err);
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
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          <button className={styles.btn} onClick={connectWallet}>Join Whitelist</button>
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

// const [walletConnected, setWalletConnected] = useState(false);
// const web3ModalRef = useRef() // return the object with key named current

// useEffect(() => {
//   web3ModalRef.current = new Web3Modal({
//     network: "rinkeby",
//     providerOptions: {},
//   });
//   console.log("FDSSDF", web3ModalRef.current);
// }, [walletConnected]);

// const getSignerOrProvider = async (needSigner = false) => {
//   const provider = await web3ModalRef.current.connect();
//   const web3Provider = new providers.Web3Provider(provider);
//   const { chainId } = await web3Provider.getNetwork();
//   if (chainId !== 4) {
//     alert('SWITCH TO RINKEBY NETWORK');
//     throw new Error('Change to rinkeby');
//   }
//   if (needSigner) {
//     const signer = web3Provider.getSigner();
//     return signer;
//   }
//   return web3Provider;
// };

// async function connectWallet() {
//   try {
//     await getSignerOrProvider();
//     setWalletConnected(true);
//     console.log("maniac")
//   } catch (error) {
//     console.log("error", error);
//   }
// }
