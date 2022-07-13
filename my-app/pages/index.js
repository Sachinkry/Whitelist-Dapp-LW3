import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from 'web3modal';
import { useEffect, useState, useRef } from "react";
import { providers, Contract } from "ethers";
import {WHITELIST_CONTRACT_ADDRESS, abi} from "../constants/index";


export default function Home() {
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numAddressesWhitelisted, setNumAddressesWhitelisted]= useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {}
      });
      connectWallet();
    }
  }, [walletConnected]);

  // get  signer or provider
  const getSignerOrProvider = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();

    if(chainId !== 4) {
      window.alert("CHANGE TO RINKEBY");
      console.error("not on rinkeby network!");
    }

    if (needSigner) {
      const signer = await web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  // add address to whitelist
  const addAddressToWhitelist = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddresToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true)
      // wait for the transaction to mine
      await tx.wait();
      setLoading(false);
      // get the updated no of whitelisted addresses
      await getNumberOfWhitelisted()
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  }

  // get the number of whitelisted addresses
  const getNumberOfWhitelisted = async () => {
   try {
    const provider = await getSignerOrProvider();
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      provider
    );
    const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted()
    setNumAddressesWhitelisted(_numberOfWhitelisted);
   } catch (err) {
    console.error(err);
   }

  }

  // check if current address is whitelisted or not
  const checkIfAddressInWhitelist = async ()=>{
    try {
      const signer = await getSignerOrProvider(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // get address from signer
      const address = await signer.getAddress();
      // check if the address is in whitelist
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
      } catch (err) {
        console.error(err);
      }
  };

  // connect wallet function
  const connectWallet = async () => {
    try {
      await getSignerOrProvider();
      setWalletConnected(true);
      console.log("hi lol");

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  }

  // render button: when to retuen what text in button element
  const renderButton = () => {
    if(walletConnected) {
      if(joinedWhitelist) {
        return (
          <div className={styles.description}><b> Thanks for Joining Whitelist! </b></div>
        ) ;
      } else if(loading) {
        return <button className={styles.button}>Loading..</button>
      } else{
        return (
          <button className={styles.button} onClick={addAddressToWhitelist}>Join the Whitelist</button>
        );
      }
    } else {
      return (
        <button className={styles.button}>
          Connect Wallet
        </button>
      );
    }
  };
  
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
            {numAddressesWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
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
    // const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    // const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0)
    // const [loading, setLoading] = useState(false);
    // const web3ModalRef = useRef();
  
    // useEffect(() => {
    //   if (!walletConnected) {
    //     web3ModalRef.current = new Web3Modal({
    //       network: "rinkeby",
    //       providerOptions: {}
    //     });
    //   }
    //   console.log(web3ModalRef.current);
    // }, [walletConnected]);
  
    // const getSignerOrProvider = async (needSigner = false) => {
    //   const provider = await web3ModalRef.current.connect();
    //   const web3Provider = new providers.Web3Provider(provider);
    //   // console.log(provider);
    //   console.log(web3Provider);
    //   const { chainId } = await web3Provider.getNetwork();
  
    //   if (chainId !== 4) {
    //     alert("NOT ON RINKEBY NETWORK");
    //     throw error("change to rinkeby network");
    //   }
  
    //   if (needSigner) {
    //     const signer = web3Provider.getSigner();
    //     return signer;
    //   }
    //   return web3Provider;
    // }
  
    // const addAddressToWhitelist = async () => {
    //   try {
    //     const signer = await getSignerOrProvider(true);
    //     const whitelistContract = new Contract(
    //       WHITELIST_CONTRACT_ADDRESS,
    //       abi,
    //       signer
    //     );
    //     const tx = await whitelistContract.addAddressToWhitelist();
    //     setLoading(true);
    //     await tx.wait();
    //     setLoading(false);
  
    //     await getNumberOfWhitelisted();
    //     setJoinedWhitelist(true);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  
    // const getNumberOfWhitelisted = async () => {
    //   try {
    //     const provider = await getSignerOrProvider();
    //     const whitelistContract = new Contract(
    //       WHITELIST_CONTRACT_ADDRESS,
    //       abi,
    //       provider
    //     );
    //     const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
    //     setNumberOfWhitelisted(_numberOfWhitelisted);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  
    // const checkIfAddressInWhitelist = async () => {
    //   try {
    //     const signer = await getSignerOrProvider(true);
    //     const whitelistContract = new Contract(
    //       WHITELIST_CONTRACT_ADDRESS,
    //       abi,
    //       signer
    //     );
    //     const address = await signer.getAddress();
    //     const _joinedWhitelist = await WHITELIST_CONTRACT_ADDRESS.whitelistedAddresses(address);
    //     setJoinedWhitelist(_joinedWhitelist)
    //   } catch (err) {
    //     console.err
    //   }
    // }
  
    // const connectWallet = async () => {
    //   try {
    //     await getSignerOrProvider();
    //     setWalletConnected(true);
  
    //     checkIfAddressInWhitelist();
    //     getNumberOfWhitelisted();
  
    //   } catch (err) {
    //     console.log('error:', err);
    //   }
    // }
  
    // // render button:
    // const renderButton = () => {
    //   if (walletConnected) {
    //     if (joinedWhitelist) {
    //       return (
    //         <div className={styles.description}>Thanks for joining the Whitelist!</div>
    //       );
    //     } else if (loading) {
    //       return <button className={styles.button}>Loading</button>
    //     } else {
    //       return (
    //         <button onClick={addAddressToWhitelist} className={styles.button}>Join the Whitelist</button>
    //       );
    //     }
    //   } else {
    //     return (
    //       <button onClick={connectWallet} className={styles.button} >Connect your wallet</button>
    //     )
    //   }
    // }