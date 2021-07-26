const Web3 = require("web3")
const Tokens = require("./tokens.js");
const holderModel = require("./model/holders.js");

const TokenIndex = 0;

const TokenABI = require(Tokens[TokenIndex].abi)
const TokenAddress = Tokens[TokenIndex].address;

const TokenInitBlockNumber = Tokens[TokenIndex].firstBlockNumber;
const BlockStepNumber = 4999; // MAX is 5000

// MainNet
const web3Provider = 'https://bsc-dataseed.binance.org';
// TestNet
// const web3Provider = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const web3 = new Web3(web3Provider);

const TokenInfo = async () => {
    const netId = await web3.eth.net.getId()
    const tokenContract = await new web3.eth.Contract(TokenABI, TokenAddress);

    console.log( netId );
    console.log( await tokenContract.methods._decimals().call() )
    console.log( await tokenContract.methods._name().call() )
    console.log( await tokenContract.methods._symbol().call() )
    console.log( await tokenContract.methods.totalSupply().call() )
}

const GetEvents = async (fromBlock = `${TokenInitBlockNumber}`) => {

    try {
        await new Promise((resolve) => setTimeout(resolve, 10000 * 3));
        let toBlock = Number(fromBlock) + BlockStepNumber;

        const tokenContract = new web3.eth.Contract(TokenABI, TokenAddress);
        const latestBlock = await web3.eth.getBlockNumber();
        const currentBlockNumber = await holderModel.findMax({ contractAddress : TokenAddress });

        console.log("BlockNumbers " , currentBlockNumber, latestBlock);

        if(toBlock > latestBlock) toBlock = latestBlock;

        if(currentBlockNumber < latestBlock) {
            console.log("From Block to Block ", fromBlock, toBlock)

            const events = await tokenContract.getPastEvents("Transfer", {
                fromBlock: `${fromBlock}`,
                toBlock: `${toBlock}`
            });

            for  (let i = 0; i < events.length; i++) {
                const event = events[i];

                const fromAddress = event.returnValues.from;
                const toAddress = event.returnValues.to;

                // console.log(fromAddress, toAddress)

                // console.log(event)
                // const txnHashData = await earnerModel.getTxnHash(event.transactionHash);

                // if (txnHashData) {
                //     continue;
                // }

                if(fromAddress !== '0x0000000000000000000000000000000000000000') {
                    await holderModel.updateData(
                        { holderAddress : fromAddress },
                        { contractAddress: TokenAddress, eventBlockNumber: event.blockNumber }
                    );
                }

                if(toAddress !== '0x0000000000000000000000000000000000000000') {
                    await holderModel.updateData(
                        { holderAddress : toAddress },
                        { contractAddress: TokenAddress, eventBlockNumber: event.blockNumber }
                    );
                }

                toBlock = Number(event.blockNumber) + 1;
            }

            return GetEvents(toBlock);
        }
    } catch(e) {
        console.log("error from eventHelper.js", e);
        return GetEvents(fromBlock);
    }
}

module.exports = {
    TokenInfo,
    GetEvents
}