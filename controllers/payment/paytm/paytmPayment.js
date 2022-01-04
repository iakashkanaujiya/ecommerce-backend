const https = require('https');
/* import checksum generation utility */
var PaytmChecksum = require("./paytmChecksum");
const formidable = require("formidable");

const { Order } = require("../../../models/order");

exports.initiatePaytmTransaction = async (req, res) => {

    // Here OrderId the ObjectId of the database
    const { orderId, redirectUrl } = req.query;

    const cursor = Order.findById(orderId).exec();
    const order = await cursor.then(data => (data));

    if (!order) {
        return res.status(400).json({ error: "No order found to process" });
    }

    var amount = order.subTotal + order.shipping;
    // This order_id is the Order Id of the Order
    var order_id = order.orderId;

    var params = {};

    params.body = {
        "requestType": "Payment",
        "mid": process.env.PAYTM_MID,
        "websiteName": "WEBSTAGING",
        "orderId": order_id,
        "callbackUrl": `${process.env.HOSTNAME}/api/verify-paytm-checksum?redirectUrl=${encodeURIComponent(redirectUrl)}`,
        "txnAmount": {
            "value": amount,
            "currency": "INR",
        },
        "userInfo": {
            "custId": req.profile._id,
        },
    };

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    const paytm = PaytmChecksum.generateSignature(JSON.stringify(params.body), process.env.PAYTM_MKEY);

    paytm.then(function (checksum) {

        params.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(params);

        var options = {
            /* for Staging */
            hostname: 'securegw-stage.paytm.in',
            /* for Production */
            // hostname: 'securegw.paytm.in',
            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${order_id}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                return res.json({ ...JSON.parse(response), params: { ...params.body } });
            });
        });

        post_req.write(post_data);
        post_req.end();
    });

};

// Verify CheckSumHash
exports.verifyPaytmChecksumHash = (req, res) => {

    const { redirectUrl } = req.query;

    const form = formidable({ multiples: true });

    form.parse(req, (err, fields) => {
        paytmChecksum = fields.CHECKSUMHASH;
        delete fields.CHECKSUMHASH;

        var isVerifySignature = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MKEY, paytmChecksum);
        if (isVerifySignature) {
            return res.redirect(`${redirectUrl}&success=true`);
        } else {
            return res.status(403).redirect(`${redirectUrl}&success=false`);
        }
    });

};

exports.getPaytmTransactionStatus = (req, res) => {

    const { orderId } = req.query;

    /* initialize an object */
    var paytmParams = {};

    /* body parameters */
    paytmParams.body = {

        /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
        "mid": process.env.PAYTM_MID,

        /* Enter your order id which needs to be check status for */
        "orderId": orderId,
    };

    /**
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    const paytm = PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MKEY);

    paytm.then(function (checksum) {
        /* head parameters */
        paytmParams.head = {
            /* put generated checksum value here */
            "signature": checksum
        };

        /* prepare JSON string for request */
        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                return res.json(JSON.parse(response));
            });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    });
};