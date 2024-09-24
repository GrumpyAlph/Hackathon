# Hackathon - Grumpy Fortunes

## What is Grumpy Fortunes?
Grumpy Fortunes is the first AI price prediction oracle on Alephium.  
The underlying custom oracle contract and scheduled task are a more serious undertaking.  The system uses historical data from CoinGecko (We have plans to eventually expand this to use other sources as well to ensure price accuracy.)  The scheduled task is run at bar close to retrieve and store the daily price information in the database.  The stored price data are then collated and sent to the AI for analysis.  The analysis returns an AI prediction for 3 time frames 24 hr, 7 day, and 1 month.  This analysis is then stored on the blockchain in the contract for use by this system or any other contracts that would like to call the oracle.  The oracle contract was implemented using the map function to allow for historical price prediction requests.

### What is an oracle?
In antiquity:
> A person (such as a priestess in ancient Greece) through whom a deity is believed to speak.
> A shrine where such divine communications are delivered.
> An authoritative or wise statement or prediction
> (www.merriam-webster.com/dictionary/oracle)

### In Crypto:
> Blockchain oracles are entities that connect blockchains to external systems, enabling smart contracts to execute based on real-world inputs and outputs. 
> Oracles play an important role in the creation of the verifiable web, connecting isolated blockchains to off-chain data and compute, and enabling interoperability between blockchains.
> Blockchain oracles are not the data source themselves, but rather the layer that queries, verifies, and authenticates external data sources and then relays that information.
> (www.coinbase.com/learn/crypto-glossary/what-is-a-blockchain-oracle-in-crypto)

But Grumpy Fortunes is much more than just a price oracle!  Designed after the idea of the Zoltar fortune telling machine, we use the custom oracle to allow Grumpy to "predict" the future price of Alephium in a way that only Grumpy can do!  The system, usese a contract to call the oracle contract to get the current prediction (even though this is unneccessary since the data is in the tables, it shows how the oracle can be used by other contracts).  Once the prediction has been loaded, the system 
