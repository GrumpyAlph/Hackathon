import { NetworkId, NodeProvider, networkIds, web3 } from "@alephium/web3";

export const getNode = () => {
    return new NodeProvider(getCurrentNodeProviderUrl());
}

export const setNode = () => {
    const nodeProvider = getNode();
    web3.setCurrentNodeProvider(nodeProvider);
    return nodeProvider;
}
export const getCurrentNodeProviderUrl = () => {
    return process.env.NEXT_PUBLIC_GRUMPY_NODE_PROVIDER || process.env.GRUMPY_NODE_PROVIDER || '';
}

interface GrumpyNetwork {
    grumpyNetwork: NetworkId,
    grumpyGroup: number
}

export const getGrumpyNetwork = (): GrumpyNetwork => {
    const network = process.env.GRUMPY_NETWORK as string;
  
    if (!networkIds.includes(network as NetworkId)) {
      throw new Error(`Invalid network ID: ${network}`);
    }
  
    const grumpyNetwork = network as NetworkId;
    const grumpyGroup = parseInt(process.env.GRUMPY_GROUP as string);
  
    if (isNaN(grumpyGroup)) {
      throw new Error(`Invalid group number: ${process.env.GRUMPY_GROUP}`);
    }
  
    return { grumpyNetwork, grumpyGroup };
  };