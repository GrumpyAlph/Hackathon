import React from 'react';

import type { Metadata } from "next";

import { Spectral  } from "next/font/google";

import { AlephiumWalletProvider } from "@alephium/web3-react";

import "./globals.css";
  
import { getGrumpyNetwork } from '@/services/node.service';

export const metadata: Metadata = {
  title: "Gumpy Fortunes",
  description: "The First AI Powered Oracle on Alephium!",
};

const mainFont = Spectral({ subsets: ["latin"], weight:"400" });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const grumpyNetwork = getGrumpyNetwork();
  
  return (

    <AlephiumWalletProvider  key="wallet"
                             theme="midnight" 
                             network={grumpyNetwork.grumpyNetwork} 
                             addressGroup={grumpyNetwork.grumpyGroup} >         
      <html lang="en" >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
        <body className={ `" ${mainFont.className} antialiased w-full h-full`}>        
            {children}
          </body>      

      </html> 
    </AlephiumWalletProvider>

  );
}
