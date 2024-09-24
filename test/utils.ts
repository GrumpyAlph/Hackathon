import { GrumpyFortunes, PriceOracle, PriceOracleInstance, UpdatePrediction } from '../artifacts/ts'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import {
    Address,
    SignerProvider,
    HexString,
    DUST_AMOUNT,
    web3
} from '@alephium/web3'
import { testPrivateKey } from '@alephium/web3-test'

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
export const ZERO_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'
export const defaultSigner = new PrivateKeyWallet({ privateKey: testPrivateKey })

export async function deployPriceOracle(trustedSource: Address) {
    return await PriceOracle.deploy(defaultSigner, {
        initialFields: {
            trustedSource,
            predictionCount: 0n
        }
    })
}

export async function deployGrumpyFortunes(oracleAddress: Address) {
    return await GrumpyFortunes.deploy(defaultSigner, {
        initialFields: {
            oracle: oracleAddress 
        }
    })
}


export async function updatePrediction(
    signer: SignerProvider,
    priceOracle: PriceOracleInstance,
    newDate: bigint,
    newText: HexString,
    newPrice: bigint
) {
    return await UpdatePrediction.execute(signer, {
        initialFields: {
            oracle: priceOracle.contractId,
            newDate,
            newText,
            newPrice
        },
        attoAlphAmount: DUST_AMOUNT
    })
}

export async function updatePredictionFailed(
    signer: SignerProvider,
    priceOracle: PriceOracleInstance,
    newDate: bigint,
    newText: HexString,
    newPrice: bigint,
    errorCode: bigint
) {
    await expectAssertionError(
        updatePrediction(signer, priceOracle, newDate, newText, newPrice),
        priceOracle.address,
        Number(errorCode)
    )
}

export async function expectAssertionError(
    p: Promise<unknown>,
    address: string,
    errorCode: number
): Promise<void> {
    await expect(p).rejects.toThrow(
        new RegExp(`Assertion Failed in Contract @ ${address}, Error Code: ${errorCode}`)
    );
}