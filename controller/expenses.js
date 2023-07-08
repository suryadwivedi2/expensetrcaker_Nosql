const mongodb = require('mongodb');
const Expense = require('../models/expenses');
const bcryt = require('bcrypt');
const User = require('../models/user-details');


exports.addexpense = async (req, res, next) => {
    //const t=await sequelize.transaction();
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const id = req.user.id;
        const totalexpenses=Number(req.user.totalexpense)+Number(amount);
        await Expense.create({ amount: amount, description: description, category: category, userId: id })
        //,{transaction:t})
        await  User.findByIdAndUpdate({_id:id},{totalexpense:totalexpenses})
        //,transaction:t})
        //await t.commit();
        res.status(200).json({ "message": 'successfullycreated' });
    } catch (err) {
        //await t.rollback();
        res.status(400).json(err);
    }
}


exports.getuser = async (req, res, next) => {
    try {
        const total_expense_perpage = Number(req.params.no_of_item);
        const page = Number(req.query.page);
        const totalitems = await Expense.count({ userId: req.user.id });
        const products = await Expense.find({ userId: req.user.id })
            .skip((page - 1) * total_expense_perpage)
            .limit(total_expense_perpage)

        res.status(200).json(
            {
                products: products,
                currentPage: page,
                hasNextpage: total_expense_perpage * page < totalitems,
                nextPage: page + 1,
                hasPreviouspage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalitems / total_expense_perpage)
            });
    } catch (err) {
        res.status(500).json(err);
    };
}

exports.deleteexpense = async (req, res, next) => {
    // const t = await sequelize.transaction();
    try {
        const expid = req.params.id;
        const uid = req.user.id;
        const expense = await Expense.findOne({ _id: expid });
         const updatedexpense = Number(req.user.totalexpense) - Number(expense.amount);
        await Expense.findOneAndDelete({ _id: expid, userId: uid });

        //, transaction: t })
         await User.findByIdAndUpdate({ _id: uid },{ totalexpense: updatedexpense })
         //, transaction: t })
        //   await t.commit();
        res.status(200).json({ message: 'succefully deleted' });
    } catch (err) {
        // await t.rollback();
        res.status(401).json({ err });
    }
}
