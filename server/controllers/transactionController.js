const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const moment = require('moment');

const getTransaction = async (req, res) => {
  const {type, frequency, startDate, endDate} = req.query;
  try {
    const query = {
      user: req.user._id ,
    };

    if (type !== 'all') {
      query.transactionType = type;
    }
    
    if (frequency !== 'custom' && frequency!=='all') {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate()
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }
    console.log("query", query)
    const transactions = await Transaction.find(query);
    if (transactions) {
      const transformedTransactions = transactions.map((transaction) => {
        const transformedTransaction = transaction.toObject();
        transformedTransaction.date = transformedTransaction.date
          .toISOString()
          .substring(0, 10);
        return transformedTransaction;
      });
      res.send(transformedTransactions);
    } else {
      return {};
    }
  } catch (err) {
    console.log("err",err)
    res.status(400).json({ err });
  }
};

const addTransaction = async (req, res) => {
  const { title, amount, category, transactionType, date } = req.body;
  if (!title || !amount || !category || !transactionType || !date) {
    res.status(400).json({ msg: "Please enter all the required details" });
  }
  console.log("date", date);
  try {
    const newTransaction = await Transaction.create({
      title,
      amount,
      transactionType,
      category,
      user: req.user._id,
      date,
    });
    req.user.transactions.push(newTransaction._id);
    req.user.save();
    return res.status(201).send(newTransaction);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong in adding Transaction");
  }
};

const updateTransaction = async (req, res) => {
  const id = req.params.id;
  const { title, amount, category, transactionType, date } = req.body;
  if (!title || !amount || !category || !transactionType || !date) {
    res.status(400).json({ msg: "Please enter all the required details" });
  }
  console.log("id", id);
  try {
    const transactionToUpdate = await Transaction.findById({ _id: id });
    if (!transactionToUpdate) {
      res.status(400).json({ err: "Transaction not found" });
    }

    transactionToUpdate.title = title;
    transactionToUpdate.amount = amount;
    transactionToUpdate.category = category;
    transactionToUpdate.transactionType = transactionType;
    transactionToUpdate.date = date;

    await transactionToUpdate.save();
    console.log("updated successfully", transactionToUpdate);
    return res.status(200).send(transactionToUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong in adding Transaction");
  }
};

const deleteTransaction = async (req, res) => {
  const id = req.params.id;
  console.log("body", req.body)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid transactionID" });
  }
  try {
    const transactionToDelete = await Transaction.findByIdAndDelete({
      _id: id,
    });
    if (!transactionToDelete) {
      return res.status(500).json({ err: "Transaction not found" });
    }

    const transactionArr = req.user.transactions.filter((transaction) => {
      transaction._id == id;
    });

    req.user.transactions = transactionArr;
    req.user.save();

    return res.status(200).json({ msg: "transaction successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "something went wrong" });
  }
};


module.exports = {
  addTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
