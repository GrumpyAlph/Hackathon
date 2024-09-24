import {
    web3,
    TestContractParams,
    addressFromContractId,
    ONE_ALPH,
  } from '@alephium/web3'
  import {
    getSigner,
    randomContractId,
    testAddress,
  } from '@alephium/web3-test'
  import { PriceOracle, PriceOracleTypes, GrumpyFortunes, GrumpyFortunesTypes, GrumpyFortunesInstance } from '../artifacts/ts'
  import { deployPriceOracle, deployGrumpyFortunes } from './utils';
  
  interface Prediction {
    date: bigint;
    text: string;
    price: bigint;
  }
  
  describe('GrumpyFortunes unit tests', () => {
    let oracleContractId: string
    let oracleContractAddress: string
    let testParamsFixture: TestContractParams<
      PriceOracleTypes.Fields,
      { newDate: bigint; newText: string; newPrice: bigint }
    >
    let trustedSourceAddress: string
  
    beforeAll(async () => {
      web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
      oracleContractId = randomContractId()
      oracleContractAddress = addressFromContractId(oracleContractId)
      trustedSourceAddress = testAddress
  
      testParamsFixture = {
        address: oracleContractAddress,
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
  
    it('GrumpyFortunes returns latest prediction', async () => {
      const signer = await getSigner(ONE_ALPH * 2n)
      
      const oracleDeployResult = await deployPriceOracle(signer.address)
      const priceOracle = oracleDeployResult.contractInstance
      // First, update the oracle with a prediction
      const updatePredictionParams = {
        args: {
          newDate: 1633046400n,
          newText: Buffer.from('Grumpy fortune prediction', 'utf8').toString('hex'),
          newPrice: 200n,
        },
        signer,
        attoAlphAmount: ONE_ALPH,
        address: oracleContractAddress,
      }

      console.log('priceOracle', JSON.stringify(priceOracle))
  
      await priceOracle.transact.updatePrediction(updatePredictionParams)
  
      const grumpyFortunesDeployResult = await deployGrumpyFortunes(oracleDeployResult.contractInstance.address)
      const grumpyFortunes = grumpyFortunesDeployResult.contractInstance
  
      const testResult = await grumpyFortunes.view.getFortune()
      const latestPrediction = testResult.returns as Prediction
  
      expect(latestPrediction.date).toEqual(1633046400n)
      expect(latestPrediction.text).toEqual(
        Buffer.from('Grumpy fortune prediction', 'utf8').toString('hex')
      )
      expect(latestPrediction.price).toEqual(200n)
    })
  })
  