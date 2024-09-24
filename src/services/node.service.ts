import { NodeProvider, networkIds, web3 } from "@alephium/web3";

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

export const getGrumpyNetwork = () => {
    const network = process.env.GRUMPY_NETWORK as string;
    const grumpyNetwork = networkIds[network];
    const grumpyGroup = parseInt(process.env.GRUMPY_GROUP as string);
    return { grumpyNetwork: grumpyNetwork, grumpyGroup: grumpyGroup };
}