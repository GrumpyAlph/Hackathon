import { fetchGrumpyFees, fetchGrumpyNode } from "@/services/settings.service";

export type Setting = {
    Id: number;
    SettingType: string;
    SettingGroup: string;
    SettingKey: string;
    Value: string;
}

export interface feesModel {
    FEE: bigint;
    FEE_DECIMALS: bigint;
    WALLET: string;
    [key: string]: any;
}

export interface nodeModel {
    NODE_URL: string;
    [key: string]: any;
}

export const defaultFeeSettingsModel: feesModel = {
    FEE: 0n,
    FEE_DECIMALS: 18n,
    WALLET: ''
};
export const defaultNodeSettingsModel: nodeModel = {
    NODE_URL: ""
};


export const getGrumpyNode = async (url: string = '') => {

    const values = await fetchGrumpyNode(url);

    const settings = extractSettings(values, defaultNodeSettingsModel);

    return { NODE_URL: settings.NODE_URL };
}



export const getGrumpyFees = async (url: string = '') => {

    const values = await fetchGrumpyFees(url);

    const settings = extractSettings(values, defaultFeeSettingsModel);

    const alphFee = BigInt(settings.FEE);
    const decimals = BigInt(settings.FEE_DECIMALS);
    const wallet = settings.WALLET;

    return { FEE: alphFee, FEE_DECIMALS: decimals, WALLET: wallet };
}


export function extractSettings(settingsArray: Setting[], initialSettings: feesModel | nodeModel) {

    settingsArray.forEach((setting: any) => {
        initialSettings[setting.SettingKey] = setting.Value;
    });
    return initialSettings;
} 
