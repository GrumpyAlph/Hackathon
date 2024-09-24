import { Deployer, DeployFunction } from '@alephium/cli';
import { PriceOracle, GrumpyFortunes } from '../artifacts/ts';

const deployPriceOracle: DeployFunction = async (deployer: Deployer) => {
  const trustedSource = '1CwUXX93QK7MCbBztwG9a557ZhhXXBQHvEgT4dywrgkeA';
  const initialPredictionCount = BigInt(0);

  const oracleResult = await deployer.deployContract(PriceOracle, {
    initialFields: {
      trustedSource: trustedSource,
      predictionCount: initialPredictionCount
    }
  });

  console.log(`PriceOracle deployed at contract Id: ${oracleResult.contractInstance.contractId}`);
  console.log(`PriceOracle deployed at contract address: ${oracleResult.contractInstance.address}`);

  const oracleAddress = oracleResult.contractInstance.address;

  const grumpyFortunesResult = await deployer.deployContract(GrumpyFortunes, {
    initialFields: {
      oracle: oracleAddress
    }
  });

  console.log(`GrumpyFortunes deployed at contract Id: ${oracleResult.contractInstance.contractId}`);
  console.log(`GrumpyFortunes deployed at contract address: ${grumpyFortunesResult.contractInstance.address}`);
};

export default deployPriceOracle;
