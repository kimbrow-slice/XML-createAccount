require('dotenv').config();
const StellarSdk = require('stellar-sdk');

const signingKey = prcoess.env.signingKey;
const publicKey = process.env.publicKey;
const sourceKeypair = StellarSdk.Keypair.fromSecret(signingKey);
const sourcePublicKey = sourceKeypair.publicKey();


const server =  new StellarSdk.Server('https://horizon-testnet.stellar.org');

(async function main(){
    const account = await server.loadAccount(sourcePublicKey);

    const trasnactionFee = await server.fetchBaseFee();

    const trasnaction = new StellarSdk.TransactionBuilder(account, {
        trasnactionFee,
        networkpassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(StellarSdk.Operation.payment({
        destination: publicKey,
        asset: StellarSdk.Asset.native(),
        amount: '1000.00'
    }))
    .setTimeout(30)
    .build();

    trasnaction.sign(sourceKeypair);

    console.log(trasnaction.toEvnelope().toXDR('base64')
    );

    try{
        const transactionResult = await server.submitTracsaction(trasnaction);
        console.log(JSON.stringify(transactionResult, null, 2));
        console.log('\n Successful Transaction! To view the transaction click the link below:');
        console.log(transactionResult._links.trasnaction.href);
    } catch (error){
        console.log('Sorry! An error has occured:');
        console.log(error);
    }
})();