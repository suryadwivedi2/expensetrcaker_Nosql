const Exp = require('../models/user-details');
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const saltrounds = 10;
        bcryt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            await Exp.create({
                name: name,
                email: email,
                password: hash,
                ispremium: false,
                totalexpense: 0
            })
            res.status(201).json({ email });
        })
    } catch (err) {
        res.status(500).json('something went wrong');
    }
}


const generatetoken = (id, ispremium) => {
    return jwt.sign({ userId: id, ispremium }, '8738654326758615762675');
}


exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Exp.findOne({ email: email });
        if (user.email === email) {
            bcryt.compare(password, user.password, (err, result) => {
                //console.log(user.ispremium);
                if (err) {
                    return res.status(400).json({ user: user });
                }
                if (result === true) {
                    res.status(201).json({ token: generatetoken(user.id, user.ispremium) });
                }
                if (result === false) {
                    return res.status(400).json({ result });
                }
            })
        } else {
            throw new Error('email is invalid');
        }
    } catch (err) {
        return res.status(501).json({ "message": "email not found" });
    }
}

