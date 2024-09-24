'use client';


import React, { useEffect, useState } from "react";

import { AlephiumConnectButtonCustom } from '@alephium/web3-react';

import { hexToString } from "@alephium/web3"

import axios from 'axios';


import { Account } from "@alephium/web3";

import { getCurrentNodeProviderUrl } from "@/services/node.service";


export type AlephiumProps = {
  account?: Account
  className?: string,
  children?: React.ReactNode,
}


/**
 * ANS (Alephium domains)
 * 
 * first result : addr name
 */
export async function resolveProfileFromANS(addressInput: string) {

  const nodeProviderUrl = getCurrentNodeProviderUrl(); 
  console.log(nodeProviderUrl); 
  const url = `${nodeProviderUrl}/contracts/call-contract`;

  const data = {
    group: 0,
    address: "2BAPZNFtNfVUXT3b1wvg2Y5mPKPisFKDTgNjTWcKaKhJf",
    methodIndex: 3,
    args: [
      {
        type: "Address",
        value: addressInput
      }
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.type === 'CallContractSucceeded' && response.data.returns && response.data.returns.length > 0) {
      //console.log("name  : ",  hexToString(response.data.returns[0].value)); 
      //console.log("image : ",  hexToString(response.data.returns[1].value)); 

      return {
        "name": hexToString(response.data.returns[0].value),
        "pix": hexToString(response.data.returns[1].value)
      };

    } else {
      return await resolveNameFromAlephiumANS(addressInput);
    }
  } catch (error) {
    console.error('Error calling contract:', error);
    throw error;
  }
}
/**
 * AlephiumANS (Splinter version)
 * 
 * first result : addr name
 */
export async function resolveNameFromAlephiumANS(addressInput: string) {
  const nodeProviderUrl = getCurrentNodeProviderUrl(); 
  console.log(nodeProviderUrl); 
  const url = `${nodeProviderUrl}/contracts/call-contract`;

  const data = {
    group: 0,
    address: "21zFc2tYNKbSWHnL2Mb1FT8kd95cgnFhqtDFqbig1QbEF",
    methodIndex: 0,
    args: [
      {
        type: "Address",
        value: addressInput
      }
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response.data.type === 'CallContractSucceeded' && response.data.returns && response.data.returns.length > 0) {
      return {
        "name": hexToString(response.data.returns[0].value)
      };
    } else {
      throw "cant resolve name";
    }
  } catch (error) {
    console.error('Error calling contract:', error);
    throw error;
  }
}

const WalletButton: React.FC<AlephiumProps> = ({ account, children }) => {

  const [name, setName] = useState<string | null>(null);

  const [pix, setPix] = useState<string | null>(null);

  /**
   * 
   */
  useEffect(() => {
    const getName = async () => {
      if (account && account.address) {
        try {
          const result: { name: string; pix?: string } | null = await resolveProfileFromANS(account.address);
          console.info("resolved profile ", result);
          setName(result?.name);
          setPix(result?.pix || null);
        } catch (error) {
          console.warn('Error getting profile:', error);
          setName(null);
          setPix(null);
        }
      }
    }

    getName();

  }, [account]);

  /**
   * 
   */
  return (
    <AlephiumConnectButtonCustom>
      {({ show, isConnected, disconnect, truncatedAddress }) => {

        return (<button key={"button-disconnect-wallet"}
          onClick={isConnected ? disconnect : show}
          className={"block w-full"} >

          {isConnected ?
            (<div className="border-2 p-2 rounded-lg bg-darker">
              <div className="flex flex-row items-center">
                <div className="f1"></div>
                <div className="f0">
                  {pix && pix.length > 0 ? (<img src={pix} 
                                                  className={"max-w-8 rounded-full"} alt={"wallet pic"} />) : ""}
                </div>
                <div className="f1 p-2 whitespace-nowrap">
                  <div>{name && name.length > 0 ? name : truncatedAddress}</div>
                </div>
                <div className="f1"></div>
              </div>
            </div>)

            : (children
              || (<div className="border-2 p-4 rounded-lg whitespace-nowrap bg-darker">Please connect your wallet</div>))}
        </button>)

      }}
    </AlephiumConnectButtonCustom>
  );
}
/**/

export default WalletButton;
