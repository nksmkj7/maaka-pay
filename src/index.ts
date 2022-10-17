import axios, { AxiosError } from "axios";

interface ImaakapayInitial {
    currency?: string;
    approved: string;
    canceled: string;
    declined: string;
    merchant_key: string;
    environment: environment;
}

interface IpayObj {
    amount: number;
    currency?: string;
    transaction_code: string | number;
    description: string;
}

type environment = "development" | "production";

let maakaPayObj: { [index: string]: string } = {};

const makaPayValidation = (payObj: IpayObj) => {
    const { amount, transaction_code, description } = payObj;
    if (!amount || (amount && amount < 0)) {
        throw new Error(
            "Amount should be included and should be greater than 0"
        );
    }
    if (!transaction_code) {
        throw new Error("Transaction code is missing");
    }
    if (!description) {
        throw new Error("Description is missing");
    }
};

const initializationValidation = (initializationObj: ImaakapayInitial) => {
    const { approved, canceled, declined, merchant_key, environment } =
        initializationObj;
    if (!approved) {
        throw new Error("Approved callback url is missing.");
    }
    if (!canceled) {
        throw new Error("Canceled callback url is missing.");
    }
    if (!declined) {
        throw new Error("Declined callback url is missing.");
    }
    if (!merchant_key) {
        throw new Error("Merchant key is missing.");
    }
    if (!environment) {
        throw new Error(
            "Must provided environment i.e development/ production"
        );
    }
    return true;
};

export const init = (initializationObj: ImaakapayInitial) => {
    initializationValidation(initializationObj);
    maakaPayObj = { ...maakaPayObj, ...initializationObj };
};

const currency = (currency: string) => {
    maakaPayObj["currency"] = currency;
};

const getPaymentObj = (maakaPayObj: ImaakapayInitial, payObj: IpayObj) => {
    const {
        approved,
        canceled,
        declined,
        merchant_key,
        currency: maakaObjCurrency,
    } = maakaPayObj;

    const {
        amount,
        transaction_code,
        description,
        currency: payObjCurrency,
    } = payObj;
    if (!payObjCurrency && !maakaObjCurrency) {
        throw new Error("Currency is missing");
    }
    return {
        approved,
        canceled,
        declined,
        merchant_key,
        currency: payObjCurrency ?? maakaObjCurrency,
        description,
        transaction_code,
        amount,
    };
};

export const pay = async (payObj: IpayObj) => {
    try {
        if (Object.keys(maakaPayObj).length <= 0) {
            throw new Error("Maakapay has not been initialized");
        }
        makaPayValidation(payObj);
        let paymentObj = getPaymentObj(
            maakaPayObj as unknown as ImaakapayInitial,
            payObj
        );
        let maakaPayUrl;
        if (maakaPayObj.environment === "production") {
            maakaPayUrl = "https://apiapp.maakapay.com/v1/createOrder";
        } else {
            maakaPayUrl = "https://apisandbox.maakapay.com/v1/createOrder";
        }
        const response = await axios.post(maakaPayUrl, paymentObj);
        return {
            status: response.status,
            message: response.statusText,
            data: response.data,
        };
    } catch (error: any) {
        if (error.isAxiosError) {
            return {
                status: error.response.status,
                message: error.response.statusText,
                data: error.response.data,
            };
        }
        return {
            status: 422,
            message: error.message,
        };
    }
};

export const maakaPay = {
    pay,
    currency,
    init,
};
