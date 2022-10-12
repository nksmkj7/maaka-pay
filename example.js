const maakaPay = require('./lib/index.js')

//initialize first
maakaPay.init({
    approved: "localhost/reponse/approved",
    canceled: "localhost/reponse/approved",
    declined: "localhost/reponse/approved",
    merchant_key: "your-mechant-key",
    environment: "development"
})


//call pay function that returns promise
const test = async () => {
    console.log(await maakaPay.pay({
        currency: "NPR",
        amount: 1,
        transaction_code: '123123123',
        description: "asdfadsfadsfadsf"
    }))
}


test()