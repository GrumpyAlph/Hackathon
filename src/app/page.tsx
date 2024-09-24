"use client";

import React from 'react';
import Image from "next/image";

import NeonGrumpy from "./assets/img/Grumpy.neon.png";
import GrumpyFortuneLogo from "./assets/img/GrumpyFortunesLogo.png";
import NeonFortune from "./assets/img/Fortune.neon.png";
import {
  BsDiscord,
  BsTelegram,
  BsTwitterX
} from "react-icons/bs";

import { Henny_Penny } from "next/font/google";

import { useEffect, useState } from "react";
import { ReactTyped } from "react-typed";


const subTitleFont = Henny_Penny({ subsets: ["latin"], weight: "400" });

import { useWallet } from "@alephium/web3-react";
import { waitForTxConfirmation } from '@alephium/web3';
import WalletButton from "./components/walletButton";
import { defaultFeeSettingsModel,  feesModel, getGrumpyFees } from "@/utilities/settingsUtilitiy";
import { setNode } from '@/services/node.service';
import { transactionResponses } from '@/constants/remarks';
import { fetchGrumpyPrediction } from '@/services/predictionContract.service';
import TransactionConfirmationModal from '@/components/modal/TransactionConfirmationModal';
import NoSSR from './components/noSSR';


/**
 * 
 */
export default function Home() {


  const { account, signer } = useWallet();
  /**
   *  global states
   */
  const [grumpyTalking, setGrumpyTalking] = useState<string[]>([]);

  const [fees, setFees] = useState<feesModel>(defaultFeeSettingsModel);

  const [modalOpen, setModalOpen] = useState({ 
    isOpen: false, 
    message: null,
    messageArrays: [],
    buttonLabels: { confirm: 'CONFIRM', cancel: 'CANCEL' },
    isLoading: false,
  });

  const handleModalOpen = (modalDetails) => {
    setModalOpen((prevState) => ({
      ...prevState,
      ...modalDetails,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen({
      isOpen: false,
      message: null,
      messageArrays: [],
      buttonLabels: { confirm: 'CONFIRM', cancel: '' },
      isLoading: false,
    });
  };

  const handleConfirmation = () => {
    handleCloseModal();
  };

  const handlePredictionClick = async () => {
    await chargeAlph();
  }

  const chargeAlph = async () => {
    if (!signer || !account)
      return;
 
    const attoAlphFeeAmount = fees.FEE * 10n ** fees.FEE_DECIMALS;
    const destinations = [{
      address: fees.WALLET,
      attoAlphAmount: attoAlphFeeAmount,
    }]
    try {
      const result = await signer.signAndSubmitTransferTx({ signerAddress: account?.address ?? '', destinations: destinations });
      const txId = result.txId;
      try {
        
        handleModalOpen({ isOpen: true, messageArrays: transactionResponses, buttonLabels: { confirm: '', cancel: '' }, isLoading: true });
        const confirmation = await waitForTxConfirmation(txId, 2, 2000);

        if (confirmation.blockHash) {
          handleCloseModal();
          try {
            const result = await fetchGrumpyPrediction();
            setGrumpyTalking([result]);
            return true;
          } catch {
            handleModalOpen({ isOpen: true, message: `Just what I needed!  Something went wrong!  Who created this thing?`, buttonLabels: { confirm: 'OK', cancel: '' } });
          }

        } else {
          return false;
        }
      } catch (error) {
        handleModalOpen({ isOpen: true, message: `Error: Transaction Failed ${(error as Error).message}`, buttonLabels: { confirm: 'OK', cancel: '' } });
        return false;
      }

    } catch (error) {
      if ((error as Error).message.toLowerCase().includes('user rejected')) {
        handleModalOpen({ isOpen: true, message: 'Transaction signing was rejected by the user.', buttonLabels: { confirm: 'OK', cancel: '' } });
      } else if ((error as Error).message.toLowerCase().includes('network error')) {
        handleModalOpen({ isOpen: true, message: 'Network issue encountered. Please check your connection.', buttonLabels: { confirm: 'OK', cancel: '' } });
      } else if ((error as Error).message.toLowerCase().includes('insufficient funds')) {
        handleModalOpen({ isOpen: true, message: 'The signer has insufficient funds for this transaction.', buttonLabels: { confirm: 'OK', cancel: '' } });
      } else {
        handleModalOpen({ isOpen: true, message: `An unexpected error occurred: ${(error as Error).message}`, buttonLabels: { confirm: 'OK', cancel: '' } });
      }

      return false;
    }
  }

  
  useEffect(() => {
 
    getGrumpyFees().then((fees) => {
      setFees(fees);
    });
    
    setGrumpyTalking([
      `Welcome, daring Alphenian...<br/><br/>
        Still holding out hope, huh?<br/><br/>
        Connect your wallet, and I’ll reluctantly reveal the fate of your $ALPH bag.<br/><br/><br/>
        Oh, and by the way, this isn’t financial advice. If you’re taking financial advice from a cat, you might want to get your head examined.`

    ]);

    setNode();

  }, [])

  /**
   *  main page
   */
  return (
    <div className={"flex flex-col min-h-screen bg-mask-black "}>
      <header className={"f0 text-center "}>
        <div className={"flex flex-row items-center"}>
          <div className={"f1"}></div>
          <div className={"f2 max-w-md		 px-8"}>
            <h1>
              <div className="flex flex-row item-centers">
                <div className="f1 mr-4">
                  <Image src={NeonGrumpy}
                    alt="Grumpy&apos;s"
                    width={640}
                    height={355} />
                </div>
                <div className="f1">
                  <Image src={NeonFortune}
                    alt="Fortune"
                    width={640}
                    height={355} />
                </div>
              </div>
            </h1>
          </div>
          <div className={"f1"}></div>
        </div>
      </header>
      <main className={"f1 grow scrollable text-center"}>
        <div className="max-w-screen-lg		mx-auto">

          <h2 className={`${subTitleFont.className} px-4 py-2 md:py-8 text-xl md:text-4xl	`}>Will Grumpy&apos;s Fortunes help make you a fortune?</h2>
          <div className={"flex flex-col md:flex-row item-centers p-4 	"}>
            <div className={"f1"}>
              <div className="machine w-96 relative mx-auto mb-half	" >
                <div className="inside background"></div>
                <div className="inside">
                  <div className="gf-logo  text-left">
                    <Image src={GrumpyFortuneLogo}
                      alt="Fortune"
                      width={640}
                      height={355} /> 
                  </div>
                </div>
              </div>
            </div>
            <div className={"f1 z-2"}>
              <div className={"flex flex-col items-center justify-center	h-full w-full"}>
                <div className="f0 w-full">
                  <div className={"prompt text-left bg-darker text-xl min-h-96 rounded-lg border-2	w-full p-8"}>
                    <ReactTyped strings={grumpyTalking}
                      typeSpeed={15}
                    ></ReactTyped>
                  </div>
                </div>
                <div className="f0 w-full pt-4">
                  <NoSSR>
                  {
                    account ? (
                      <div className={"flex flex-row items-center w-full"}>
                        <div className={"f1 pr-2"}>
                          <WalletButton account={account} />
                        </div>
                        <div className={"f1 pl-2"}>
                          <div className="border-2 p-4 rounded-lg cursor-pointer bg-darker"
                            onClick={handlePredictionClick}>
                            Get my prediction
                          </div>
                        </div>
                      </div>
                    ) : (
                      <WalletButton account={account} />
                    )
                  }
                  </NoSSR>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TransactionConfirmationModal
          isOpen={modalOpen.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmation}
          messageArrays={modalOpen.messageArrays}
          message={modalOpen.message}
          buttonLabels={modalOpen.buttonLabels}
          isLoading={modalOpen.isLoading}
        />
      </main>
      <footer className={"f0 bg-darker"}>
        <div className={"flex flex-row item-centers p-4"}>
          <div className={"f1 p-2 pl-8 text-center text-xs"}>
            Not Financial Advice, for entertainment purposes only.  Use at your own risk.  Copyright 20204, all rights reserved.
          </div>
          <div className={"f0"}>
            <a href="https://x.com/GrumpyAlph" target="_blank"
              rel="noopener noreferrer">
              <BsTwitterX size={"2em"} />
            </a>
          </div>
          <div className={"f0 px-4"}>
            <a href="https://t.co/bEMN21yv2E" target="_blank"
              rel="noopener noreferrer">
              <BsTelegram size={"2em"} />
            </a>
          </div>
          <div className={"f0"}>

            <a href="https://t.co/bEMN21yv2E" target="_blank"
              rel="noopener noreferrer">
              <BsDiscord size={"2em"} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}