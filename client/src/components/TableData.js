import React, {useContext, useState } from "react";
import axios from 'axios'
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Alert from "@mui/material/Alert";
import { UserContext } from "../contexts/UserContext";
import { TransactionContext } from "../contexts/TransactionContext";

const TableData = () => {
  const { user } = useContext(UserContext);
  const {dispatch} = useContext(TransactionContext)
  const { transactions } = useContext(TransactionContext);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [currId, setCurrId] = useState(null);
  const [values, setValues] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    transactionType: "",
  });


  const handleClose = () => {
    setCurrId(null);
    setShow(false);
    setError(null);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { title, amount, category, transactionType, date } = values;
    if (!title || !amount || !category || !transactionType || !date) {
      setError("Please fill all the required details");
      return;
    }
    if(date > new Date().toISOString().split("T")[0]){
      setError("Date should not be greater than today's date ")
      return;
    }
    console.log("currid",currId)
    try {
      const response = await axios.put(
        `/api/updateTransaction/${currId}`,
        {
          title,
          amount,
          category,
          date,
          transactionType,
          userId: user.existingUser._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setError(response.data.msg || "Something went wrong in adding");
        return;
      }

      setValues({
        title: "",
        amount: "",
        category: "",
        date: "",
        transactionType: "",
      });
      setError(null);
      setShow(false);

      const updatedTransaction = response.data;
      updatedTransaction.date = updatedTransaction.date.substring(0, 10);

      dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTransaction });
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };
  const handleEditClick = (itemKey) => {
    if (transactions.length > 0) {
      const editTran = transactions.filter((item) => item._id === itemKey);
      const { title, amount, category, transactionType, date } = editTran[0];
      setValues({title,amount,category,date,transactionType});
      setCurrId(itemKey)
      setEditingTransaction(editTran);
      setShow(true);
    }
  };
  const handleDeleteClick = async(itemKey) => {
    try {
      console.log("userid in delete",user.existingUser._id)
      const response = await axios.delete(`/api/deleteTransaction/${itemKey}`, 
        {
          data: { userId: user.existingUser._id },
          headers: {Authorization: `Bearer ${user.token}`}
        },
      );

      if (response.status === 200) {
        dispatch({ type: "DELETE_TRANSACTION", payload: itemKey });
      }
    } catch (err) {
      setError("Something went wrong in deleting the transaction");
    }
  };

  return (
    <div className="table-data-container">
      <Container>
        <Table responsive="md" className="data-table text-white">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.title}</td>
                <td>{item.amount}</td>
                <td>{item.transactionType}</td>
                <td>{item.category}</td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={() => handleEditClick(item._id)}
                    />
                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDeleteClick(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {editingTransaction && (
        <Modal
          show={show}
          onHide={handleClose}
          className="centered-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert severity="error">{error}</Alert>}
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  type="text"
                  value={values.title}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  name="amount"
                  type="number"
                  placeholder="Enter your Amount"
                  value={values.amount}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSelect">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  onChange={handleChange}
                  value={values.category}
                >
                  <option value="">Choose...</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Tip">Tip</option>
                  <option value="Food">Food</option>
                  <option value="Medical">Medical</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSelect1">
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select
                  name="transactionType"
                  onChange={handleChange}
                  value={values.transactionType}
                >
                  <option value="">Choose...</option>
                  <option value="credit">Credit</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TableData;
