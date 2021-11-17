const DOMAIN_ID = 0;
const RELAYERS = [
  "0x14f3a86848765F623565ed25F1ece4478DcbEAD2",
  "0xBdc93a803Fe622D814e685F3829e9c4d847bD89D",
  "0x421464673fBE59BDD83f66429bCFb50632230900",
  "0xc587475D9d18DBA99fE9Eb9Ca034B6a4D5CCD097",
  "0xB8f69a26925C1fE60a76fe70E78e1Ddd4164e66b",
];
const RELAYERS_THRESH_HOLD = 1;
const FEE = 0;
const EXPIRE = 100;
const ERC20_SYMBOL = "MASS",
  ERC20_NAME = "MASS Token",
  ERC20_DECIMALS = 18;

const Bridge = artifacts.require("Bridge");
const ERC20Handler = artifacts.require("ERC20Handler");
const ERC721Handler = artifacts.require("ERC721Handler");
const GenericHandler = artifacts.require("GenericHandler");
const ERC20Custom = artifacts.require("ERC20Custom");
const CentrifugeAsset = artifacts.require("CentrifugeAsset");

const deployedContracts = {};

module.exports = function (deployer) {
  deployer
    .deploy(Bridge, DOMAIN_ID, RELAYERS, RELAYERS_THRESH_HOLD, FEE, EXPIRE)
    .then(() => {
      console.log(`\n\tBridge contract address: ${Bridge.address}`);
      deployedContracts["Bridge"] = Bridge.address;
      return deployer.deploy(ERC20Handler, Bridge.address).then(() => {
        console.log(
          `\n\tERC20Handler contract address: ${ERC20Handler.address}`
        );
        deployedContracts["ERC20Handler"] = ERC20Handler.address;
        return deployer.deploy(ERC721Handler, Bridge.address).then(() => {
          console.log(
            `\n\tERC721Handler contract address: ${ERC721Handler.address}`
          );

          return deployer.deploy(GenericHandler, Bridge.address).then(() => {
            console.log(
              `\n\tGenericHandler contract address: ${GenericHandler.address}`
            );
            deployedContracts["GenericHandler"] = GenericHandler.address;
            return deployer
              .deploy(ERC20Custom, ERC20_NAME, ERC20_SYMBOL, ERC20_DECIMALS)
              .then(() => {
                console.log(
                  `\n\tERC20Custom contract address: ${ERC20Custom.address}`
                );
                deployedContracts["ERC20Custom"] = ERC20Custom.address;

                return deployer.deploy(CentrifugeAsset).then(() => {
                  console.log(
                    `\n\tCentrifugeAsset contract address: ${CentrifugeAsset.address}`
                  );
                  deployedContracts["CentrifugeAsset"] =
                    CentrifugeAsset.address;

                  console.log(`Contract Addresses
================================================================
Bridge:             ${deployedContracts.Bridge}
----------------------------------------------------------------
Erc20 Handler:      ${deployedContracts.ERC20Handler}
----------------------------------------------------------------
Generic Handler:    ${deployedContracts.GenericHandler}
----------------------------------------------------------------
Erc20:              ${deployedContracts.ERC20Custom}
----------------------------------------------------------------
Centrifuge Asset:   ${deployedContracts.CentrifugeAsset}
================================================================`);
                  console.log(
                    `cb-sol-cli bridge register-resource --resourceId "0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce00" --targetContract "${deployedContracts.ERC20Custom}"\n`
                  );
                  console.log(
                    `cb-sol-cli bridge register-generic-resource --resourceId "0x000000000000000000000000000000f44be64d2de895454c3467021928e55e01" --targetContract "${deployedContracts.CentrifugeAsset}" --handler "${deployedContracts.GenericHandler}" --hash --deposit "" --execute "store(bytes32)"\n`
                  );
                  console.log(
                    `cb-sol-cli bridge set-burn --tokenContract ${deployedContracts.ERC20Custom}\n`
                  );
                  console.log(
                    `cb-sol-cli erc20 add-minter --minter "${deployedContracts.ERC20Handler}"\n`
                  );
                });
              });
          });
        });
      });
    });
};
