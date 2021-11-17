const {round} = require('lodash')
const maxUInt =
    "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const createDetail = async (web3, data, address, contractAddress, checkAddress = null, amount = 0) => {
    const nonce = await web3.eth.getTransactionCount(address, 'pending');
    let detail = {
        from: address,
        to: contractAddress,
        value: checkAddress === '0x0000000000000000000000000000000000000000' ? web3.utils.toWei(round(amount * 1.025, 6).toString(), "ether") : 0,
        data,
        nonce,
        gas: 0,
        gasPrice: 0,
    };
    let gasLimit = 80000;
    let gasPrice = (await web3.eth.getGasPrice()) * 1.2;
    detail.gas = gasLimit;
    detail.gasPrice = gasPrice;
    return detail;
}

const signTransaction  = async (web3, detail, privateKey) => {
    const signedTransaction = await web3.eth.accounts.signTransaction(
        detail,
        privateKey
    );

    return web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}

const sendSignTransaction = async (web3, data, adminAddress, privateKey, contractAddress) => {
    const detail = await createDetail(web3, data, adminAddress, contractAddress);

    return signTransaction(web3, detail, privateKey)
}

const approve = async (web3, contractAddress, abi, address, approvedAddress, privateKey) => {

    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    const allowance = await contractInstance.methods
        .allowance(address, approvedAddress)
        .call();
    if (allowance > 0) return;
    let nonce = await web3.eth.getTransactionCount(address);
    let data = contractInstance.methods
        .approve(approvedAddress, maxUInt)
        .encodeABI();

    let details = {
        from: address,
        to: contractAddress,
        value: 0,
        data: data,
        nonce: nonce,
    };
    let gasLimit = 500000;
    let gasPrice = (await web3.eth.getGasPrice()) * 1.5;

    details.gas = gasLimit;
    details.gasPrice = gasPrice;

    const signedTransaction = await web3.eth.accounts.signTransaction(
        details,
        privateKey
    );

    await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
    );
    console.log(
        "Finish approve %s token of contract %s from address %s with tx_id = %s",
        contractAddress,
        address
    );
}

module.exports = {
    sendSignTransaction,
    approve
}
