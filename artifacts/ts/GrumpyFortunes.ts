/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  Asset,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
  SignExecuteContractMethodParams,
  SignExecuteScriptTxResult,
  signExecuteMethod,
  addStdIdToFields,
  encodeContractFields,
} from "@alephium/web3";
import { default as GrumpyFortunesContractJson } from "../grumpyFortunes/GrumpyFortunes.ral.json";
import { getContractByCodeHash } from "./contracts";
import { Prediction, PriceOracleValue, AllStructs } from "./types";

// Custom types for the contract
export namespace GrumpyFortunesTypes {
  export type Fields = {
    oracle: HexString;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getFortune: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<PriceOracleValue>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
  export type MulticallReturnType<Callss extends MultiCallParams[]> = {
    [index in keyof Callss]: MultiCallResults<Callss[index]>;
  };

  export interface SignExecuteMethodTable {
    getFortune: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];
}

class Factory extends ContractFactory<
  GrumpyFortunesInstance,
  GrumpyFortunesTypes.Fields
> {
  encodeFields(fields: GrumpyFortunesTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  at(address: string): GrumpyFortunesInstance {
    return new GrumpyFortunesInstance(address);
  }

  tests = {
    getFortune: async (
      params: Omit<
        TestContractParamsWithoutMaps<GrumpyFortunesTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<PriceOracleValue>> => {
      return testMethod(this, "getFortune", params, getContractByCodeHash);
    },
  };

  stateForTest(
    initFields: GrumpyFortunesTypes.Fields,
    asset?: Asset,
    address?: string
  ) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const GrumpyFortunes = new Factory(
  Contract.fromJson(
    GrumpyFortunesContractJson,
    "",
    "277cb0d72a3759824862646ed1416f23afe9b9af7f0cfe5f874fa6d2674bda04",
    AllStructs
  )
);

// Use this class to interact with the blockchain
export class GrumpyFortunesInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<GrumpyFortunesTypes.State> {
    return fetchContractState(GrumpyFortunes, this);
  }

  view = {
    getFortune: async (
      params?: GrumpyFortunesTypes.CallMethodParams<"getFortune">
    ): Promise<GrumpyFortunesTypes.CallMethodResult<"getFortune">> => {
      return callMethod(
        GrumpyFortunes,
        this,
        "getFortune",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    getFortune: async (
      params: GrumpyFortunesTypes.SignExecuteMethodParams<"getFortune">
    ): Promise<GrumpyFortunesTypes.SignExecuteMethodResult<"getFortune">> => {
      return signExecuteMethod(GrumpyFortunes, this, "getFortune", params);
    },
  };

  async multicall<Callss extends GrumpyFortunesTypes.MultiCallParams[]>(
    ...callss: Callss
  ): Promise<GrumpyFortunesTypes.MulticallReturnType<Callss>> {
    return (await multicallMethods(
      GrumpyFortunes,
      this,
      callss,
      getContractByCodeHash
    )) as GrumpyFortunesTypes.MulticallReturnType<Callss>;
  }
}
