require('dotenv').config();
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendVerifcationCode = async (randomCode, customerPhone) => {
    return await (
        client.messages.create({
            body: `Your JustPantry verification code is: ${randomCode}`,
            from: process.env.TWILIO_NUMBER,
            to: customerPhone
        })
    );
};

// Signup the user
exports.signup = (req, res) => {
    // Get the cuser phone number
    const { phone } = req.body;
    // Create a verification code
    const randomCode = Math.floor(Math.random() * (10000 - 1000) + 1000);
    //Find user if already eixts
    User.findOne({ phone: phone }, (err, docs) => {
        if (err || !docs) {
            // Create new user in database
            const user = new User(req.body);
            user.save((err, user) => {
                if (err) {
                    return res.status(400).json({
                        error: "There was an errro to process the request"
                    });
                } else {
                    sendVerifcationCode(randomCode, phone).then(message => {
                        return res.json({
                            message: message, user: user, verificationCode: randomCode
                        });
                    }).catch(err => {
                        return res.status(400).json({
                            error: "Opps! something went wrong, Please try again"
                        });
                    });
                }
            });
        } else {
            sendVerifcationCode(randomCode, phone).then(message => {
                return res.json({
                    message: message, user: docs, verificationCode: randomCode
                });
            }).catch(err => {
                return res.status(400).json({
                    error: "Opps! something went wrong"
                });
            });
        }
    });
};

// Generate access token
const generateAccessToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "4d" });
}

// verify session token
exports.verifySessionToken = (req, res) => {
    const { token, userId } = req.body;
    // Check whether token exists
    if (!token || !userId) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, _id) => {
        if (err || userId == _id) {
            return res.sendStatus(403);
        } else {
            return res.sendStatus(200);
        }
    });
};

// Signin the user
exports.signin = (req, res) => {
    // Get the User Id
    const { userId } = req.body;
    // Create token
    const token = generateAccessToken(userId);
    const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET)
    // Save refresh token in database
    User.findByIdAndUpdate(
        { _id: userId },
        { $set: { sessionToken: refreshToken } },
        (err, user) => {
            if (err) {
                return res.status(400).json({ error: "Opps! something went wrong" });
            } else {
                // send response
                return res.json({ token, user });
            }
        }
    );
};

// Signout the user
exports.signout = (req, res) => {
    const { userId } = req.prams;
    User.findByIdAndUpdate(
        { _id: userId },
        { $set: { sessionToken: null } },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "There was an error to process the request"
                });
            } else {
                // send the response
                res.json({
                    message: "User signout"
                });
            }
        }
    );
};

// Protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth"
});

// Check whether the user is authenticated
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Session expired"
        });
    }
    next();
};