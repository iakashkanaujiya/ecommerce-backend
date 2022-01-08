const { Order, ProductCart } = require("../models/order");
const { createInvoice } = require("../pdfkit/createInvoice");

//create order
exports.createOrder = (req, res) => {
    const time = new Date();
    const orderId = "ODI" + time.getDate() + time.getMonth() == 0 ? time.getMonth() + "0" : time.getMonth() + time.getFullYear();

    req.body.order.user = req.profile._id;
    req.body.order.orderId = orderId;

    const order = new Order(req.body.order);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({ error: "Falied to create the order" });
        }
        return res.json(order);
    });
};

//get the order by Id
exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate({
            path: "items",
            populate: {
                path: "product",
            }
        })
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({ error: "No order found in Database" });
            }
            req.order = order;
            next();
        });
};

// get order
exports.getOrder = (req, res) => {
    return res.json(req.order);
};

//Get All Orders
exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({ error: "No orders found" });
            }
            return res.json(order);
        });
};

// get order status
exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.findByIdAndUpdate(
        { _id: req.order._id },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({ error: "Cannot update the order status" });
            }
            return res.status(200).json(order);
        }
    );
};


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendOrderConfirmation = async (order, customerPhone) => {
    var message = `Your order (${order.orderId}) containing ${order.items.length} items total (₹${order.subTotal + order.shipping}) has been placed sucessfully, and will be delivered soon, Team JustPantry.`;

    return await (
        client.messages.create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: customerPhone
        })
    );
};

// const generateInvoice = (order) => {
//     const items = [];

//     order.items.forEach(item => {
//         const it = {
//             name: item.product.name.substring(0, 30) + "...",
//             sellingPrice: (item.subTotal / item.quantity) * 100,
//             quantity: item.quantity,
//             subTotal: item.subTotal * 100
//         }
//         items.push(it);
//     });

//     const invoice = {
//         address: order.address,
//         items: items,
//         subTotal: order.subTotal * 100,
//         shipping: order.shipping * 100,
//         totalAmount: (order.subTotal + order.shipping) * 100,
//         paymentType: order.paymentType === "cod" ? "COD" : "Prepaid"
//     }

//     createInvoice(invoice, `public/invoice/${order.orderId}.pdf`);
//     return `${process.env.HOSTNAME}/public/invoice/${order.orderId}.pdf`;
// }

exports.completeOrder = (req, res) => {
    const { status } = req.body;

    Order.findByIdAndUpdate(
        { _id: req.order._id },
        { $set: req.body },
    ).populate({
        path: "items",
        populate: {
            path: "product",
        }
    }).exec((err, order) => {
        if (err) {
            return res.status(400).json({ error: "Order updation failed" });
        }
        if(status == "Received") {
            sendOrderConfirmation(order, req.profile.phone).then(message => {
                return res.json(order);
            }).catch(err => {
                return res.status(400).json(order);
            });
        } else {
            return res.json(order);
        }
    });
};







