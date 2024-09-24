import {
  web3,
  TestContractParams,
  addressFromContractId,
  ONE_ALPH,
} from '@alephium/web3'
import {
  expectAssertionError,
  getSigner,
  randomContractId,
  testAddress,
} from '@alephium/web3-test'
import { PriceOracle, PriceOracleTypes } from '../artifacts/ts'
import { deployPriceOracle } from './utils';

const ErrorCodes = {
  Unauthorized: 0,
  InvalidIndex: 1,
};

interface Prediction {
  date: bigint;
  text: string;
  price: bigint;
}

describe('PriceOracle unit tests', () => {
  let testContractId: string
  let testContractAddress: string
  let testParamsFixture: TestContractParams<
    PriceOracleTypes.Fields,
    { newDate: bigint; newText: string; newPrice: bigint }
  >
  let trustedSourceAddress: string
  let unauthorizedAddress: string
  let unauthorizedContractId: string

  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    testContractId = randomContractId()
    testContractAddress = addressFromContractId(testContractId)
    trustedSourceAddress = testAddress
    unauthorizedContractId = randomContractId()
    unauthorizedAddress = addressFromContractId(unauthorizedContractId)

    testParamsFixture = {
      address: testContractAddress,
      initialAsset: { alphAmount: 10n ** 18n },
      initialFields: {
        trustedSource: trustedSourceAddress,
        predictionCount: 0n,
      },
      testArgs: {
        newDate: 1633046400n,
        newText: Buffer.from('Prediction for ALPH price', 'utf8').toString('hex'),
        newPrice: 100n,
      },
      inputAssets: [
        { address: trustedSourceAddress, asset: { alphAmount: 10n ** 18n } },
      ],
    }
  })

  it('Trusted source can update prediction', async () => {
    const testParams = { ...testParamsFixture }
    const testResult = await PriceOracle.tests.updatePrediction(testParams)

    const contractState = testResult.contracts[0] as PriceOracleTypes.State
    expect(contractState.fields.predictionCount).toEqual(1n)

    const predictionUpdatedEvents = testResult.events.filter(event => event.name === 'PredictionUpdated');
    expect(predictionUpdatedEvents.length).toEqual(1);

    const predictionEvent = predictionUpdatedEvents.find(event => event.name === 'PredictionUpdated');

    expect(predictionEvent?.contractAddress).toEqual(testContractAddress)
    expect(predictionEvent).not.toBeUndefined();
    expect(predictionEvent?.fields.date).toEqual(1633046400n)
    expect(predictionEvent?.fields.text).toEqual(
      Buffer.from('Prediction for ALPH price', 'utf8').toString('hex')
    )
    expect(predictionEvent?.fields.price).toEqual(100n)
  })

  it('Unauthorized address cannot update prediction', async () => {
    const testParams = {
      ...testParamsFixture,
      inputAssets: [
        { address: testAddress, asset: { alphAmount: 10n ** 18n } },
      ],
      testArgs: {
        newDate: 1633132800n,
        newText: Buffer.from('Unauthorized prediction', 'utf8').toString('hex'),
        newPrice: 150n,
      },
      callerAddress: unauthorizedAddress,
    }

    await expectAssertionError(
      PriceOracle.tests.updatePrediction(testParams),
      testContractAddress,
      ErrorCodes.Unauthorized
    )
  })

  it('Get latest prediction when no predictions exist', async () => {
    const newContractId = randomContractId()
    const newContractAddress = addressFromContractId(newContractId)

    const testParams = {
      address: newContractAddress,
      initialFields: {
        trustedSource: trustedSourceAddress,
        predictionCount: 0n,
      },
      initialAsset: { alphAmount: 10n ** 18n },
    }

    await expectAssertionError(
      PriceOracle.tests.getLatestPrediction(testParams),
      newContractAddress,
      ErrorCodes.InvalidIndex
    )
  })

  it('Get prediction at valid index', async () => {
    const signer = await getSigner(ONE_ALPH * 2n);
    const deployResult = await deployPriceOracle(signer.address)
    const priceOracle = deployResult.contractInstance

    const updatePredictionParams = {
      args: {
        newDate: 1633046400n,
        newText: Buffer.from('Prediction for ALPH price', 'utf8').toString('hex'),
        newPrice: 100n
      },
      signer,
      attoAlphAmount: ONE_ALPH,
      address: priceOracle.address,
    };

    const result = await priceOracle.transact.updatePrediction(updatePredictionParams)

    console.log('result: ', JSON.stringify(result));

    const testParams = {
      args: {
        index: 0n
      },
      address: priceOracle.address,
      group: priceOracle.groupIndex
    };

    const testResult = await priceOracle.view.getPredictionAt(testParams);
    const prediction = testResult.returns as Prediction;

    console.log('prediction', prediction);

    expect(prediction.date).toEqual(1633046400n);
    expect(prediction.text).toEqual(
      Buffer.from('Prediction for ALPH price', 'utf8').toString('hex')
    );
    expect(prediction.price).toEqual(100n);
  });


  it('Get prediction at invalid index', async () => {
    const signer = await getSigner(BigInt('1000000000000000000')); // 1 ALPH

    const deployResult = await deployPriceOracle(signer.address);
    const priceOracle = deployResult.contractInstance;
  
    const testParams = {
      args: {
        index: 10n,
      },
      address: priceOracle.address,
      group: priceOracle.groupIndex,
    };
  
    await expectAssertionError(
      priceOracle.view.getPredictionAt(testParams),
      priceOracle.address,
      ErrorCodes.InvalidIndex
    )
  });
  

  it('Multiple predictions update and retrieval', async () => {
    const signer = await getSigner(ONE_ALPH * 3n);
  
    const deployResult = await deployPriceOracle(signer.address);
    const priceOracle = deployResult.contractInstance;
  
    const updatePredictionParams1 = {
      args: {
        newDate: 1633046400n,
        newText: Buffer.from('Prediction for ALPH price', 'utf8').toString('hex'),
        newPrice: 100n,
      },
      signer,
      attoAlphAmount: ONE_ALPH,
      address: priceOracle.address,
      assets: [{ assetId: 'ALPH', amount: ONE_ALPH }],
    };
  
    await priceOracle.transact.updatePrediction(updatePredictionParams1);
  
    const updatePredictionParams2 = {
      args: {
        newDate: 1633132800n,
        newText: Buffer.from('Second prediction', 'utf8').toString('hex'),
        newPrice: 150n,
      },
      signer,
      attoAlphAmount: ONE_ALPH,
      address: priceOracle.address,
      assets: [{ assetId: 'ALPH', amount: ONE_ALPH }],
    };
  
    await priceOracle.transact.updatePrediction(updatePredictionParams2);

    const latestPredictionResult = await priceOracle.view.getLatestPrediction();
    const latestPrediction = latestPredictionResult.returns as Prediction;
    expect(latestPrediction.date).toEqual(1633132800n);
    expect(latestPrediction.text).toEqual(
      Buffer.from('Second prediction', 'utf8').toString('hex')
    );
    expect(latestPrediction.price).toEqual(150n);
  
    const testParams = {
      args: {
        index: 0n
      },
      address: priceOracle.address,
      group: priceOracle.groupIndex
    };
    
    const firstPredictionResult = await priceOracle.view.getPredictionAt(testParams);
    const firstPrediction = firstPredictionResult.returns as Prediction;
    expect(firstPrediction.date).toEqual(1633046400n);
    expect(firstPrediction.text).toEqual(
      Buffer.from('Prediction for ALPH price', 'utf8').toString('hex')
    );
    expect(firstPrediction.price).toEqual(100n);
  });
  
})