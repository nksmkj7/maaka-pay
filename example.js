const maakaPay = require('./lib/index.js')

//initialize first
maakaPay.init({
    approved: "localhost/reponse/approved",
    canceled: "localhost/reponse/approved",
    declined: "localhost/reponse/approved",
    merchant_key: "afadsfasfdadsf",
    environment: "development"
})


//call pay function that returns promise
const test = async () => {
    console.log(await maakaPay.pay({
        currency: "NPR",
        amount: 1,
        transaction_code: 'asdfasdfasf',
        description: "asdfadsfadsfadsf"
    }))
}


test()