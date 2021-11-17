const WALLET = "0x14f3a86848765F623565ed25F1ece4478DcbEAD2";
const PRIVATE_KEY =
  "292ba317811cfe7ea399c7a8868520d1367b1baa17bc6f506d99c7f7490d71aa";

const BRIDGE_ABI = require("./Bridge.json");
const BRIDGE_CONTRACT_ADDRESS = "0x649bD4b833257B185088bc8810FDde51E3FF2a06";
const ERC20_HANDLER_ABI = require("./ERC20Handler.json");
const ERC20_HANDLER_ADDRESS = "0xC3c799eAAa7b14857B15c34088023070f6F5ACda";
const ERC_ABI = require("./ERC20Custom.json");
const ERC_ADDRESS = "0x568bFdf0cA7833fF3817Df0D0Bdf8C1dD3Dad83B";

const PROVIDER_RPC =
  "https://rinkeby.infura.io/v3/4de328e80412487faea850533e750278";
const Web3 = require("web3");
const web3 = new Web3(PROVIDER_RPC);

const { sendSignTransaction } = require("./blockchain-utils");

const _registerFungileResourceIDWithErc20Contract = async () => {
  const resourceId =
    "0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce00";

  const bridgeContractInstance = new web3.eth.Contract(
    BRIDGE_ABI,
    BRIDGE_CONTRACT_ADDRESS
  );

  const data = await bridgeContractInstance.methods
    .adminSetResource(ERC20_HANDLER_ADDRESS, resourceId, ERC_ADDRESS)
    .encodeABI();

  const sign = await sendSignTransaction(
    web3,
    data,
    WALLET,
    PRIVATE_KEY,
    BRIDGE_CONTRACT_ADDRESS
  );

  if (!sign.status) {
    throw new Error("TRANSACTION.FAILED");
  }

  return sign.transactionHash;
};

setImmediate(async () => {
  console.log(await _registerFungileResourceIDWithErc20Contract());
});
