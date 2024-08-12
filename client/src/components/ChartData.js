import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CircularProgressBar from "../components/utils/CircularProgressBar";
import LineProgressBar from "../components/utils/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TransactionContext } from "../contexts/TransactionContext";
import "./ChartData.css";

const ChartData = () => {
  const { transactions } = useContext(TransactionContext);
  const totalLength = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent = (
    (totalIncomeTransactions.length / totalLength) *
    100
  ).toFixed(2);
  let totalExpensePercent = (
    (totalExpenseTransactions.length / totalLength) *
    100
  ).toFixed(2);

  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalTurnOver = totalTurnOverIncome + totalTurnOverExpense;

  const TurnOverIncomePercent = (
    (totalTurnOverIncome / totalTurnOver) *
    100
  ).toFixed(2);
  const TurnOverExpensePercent = (
    (totalTurnOverExpense / totalTurnOver) *
    100
  ).toFixed(2);

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: "#FF6384",
    Rent: "#36A2EB",
    Salary: "#FFCE56",
    Tip: "#4BC0C0",
    Food: "#9966FF",
    Medical: "#FF9F40",
    Utilities: "#8AC926",
    Entertainment: "#6A4C93",
    Transportation: "#1982C4",
    Other: "#F45B69",
  };

  return (
    <Container>
      <Row>
        <Col md={3}>
          <div className="card">
            <h5 className="heading">Total Transactions: {totalLength}</h5>
            <div>
              <ArrowDropUpIcon style={{ color: "green" }} />
              Income: {totalIncomeTransactions.length}
            </div>
            <div>
              <ArrowDropDownIcon style={{ color: "red" }} />
              Expense: {totalExpenseTransactions.length}
            </div>
            <CircularProgressBar
              percentage={totalIncomePercent}
              color="green"
            />
            <CircularProgressBar percentage={totalExpensePercent} color="red" />
          </div>
        </Col>
        <Col md={3}>
          <div className="card">
            <h5 className="heading">Total TurnOver: {totalTurnOver}</h5>
            <div>
              <ArrowDropUpIcon style={{ color: "green" }} />
              Income: {totalTurnOverIncome} <CurrencyRupeeIcon />
            </div>
            <div>
              <ArrowDropDownIcon style={{ color: "red" }} />
              Expense: {totalTurnOverExpense} <CurrencyRupeeIcon />
            </div>
            <CircularProgressBar
              percentage={TurnOverIncomePercent}
              color="green"
            />
            <CircularProgressBar
              percentage={TurnOverExpensePercent}
              color="red"
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="card">
            <h5 className="heading">Categorywise Income</h5>
            <div className="card-body">
              {categories.map((category) => {
                const income = transactions
                  .filter(
                    (transaction) =>
                      transaction.transactionType === "credit" &&
                      transaction.category === category
                  )
                  .reduce((acc, transaction) => acc + transaction.amount, 0);

                const incomePercent = (income / totalTurnOver) * 100;

                return (
                  <>
                    {income > 0 && (
                      <LineProgressBar
                        label={category}
                        percentage={incomePercent.toFixed(2)}
                        lineColor={colors[category]}
                      />
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="card">
            <h5 className="heading">Categorywise Expense</h5>
            <div className="card-body">
              {categories.map((category) => {
                const expenses = transactions
                  .filter(
                    (transaction) =>
                      transaction.transactionType === "expense" &&
                      transaction.category === category
                  )
                  .reduce((acc, transaction) => acc + transaction.amount, 0);

                const expensePercent = (expenses / totalTurnOver) * 100;

                return (
                  <>
                    {expenses > 0 && (
                      <LineProgressBar
                        label={category}
                        percentage={expensePercent.toFixed(2)}
                        lineColor={colors[category]}
                      />
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChartData;
