const { ethers } = require('hardhat');

async function main() {

    // it looks for abi code and bytecode in the artifacts directory and store it in whitelistContract
    const whitelistContract = await ethers.getContractFactory("Whitelist");

    //here we deploy the contract
    const deployedWhitelistContract = await whitelistContract.deploy(10);
    // 10 is the Maximum number of whitelisted addresses allowed

    // wait for it to finish deploying
    await deployedWhitelistContract.deployed();

    console.log(
        "Whitelist Contract Address:",
        deployedWhitelistContract.address
    );
}

// call the main function and catch if there is an error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });