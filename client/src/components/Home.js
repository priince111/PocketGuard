import React, { useContext, useState, useEffect } from "react";
import api from "./utils/api";
import { useLogout } from "../hooks/useLogout";
import { UserContext } from "../contexts/UserContext";
import { TransactionContext } from "../contexts/TransactionContext";
import { Button, Modal, Form, Container, Navbar } from "react-bootstrap";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Alert from "@mui/material/Alert";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableData from "./TableData";
import "./Home.css";
import ChartData from "./ChartData";

const Home = () => {
  const { logout } = useLogout();
  const { user, loading } = useContext(UserContext);
  const { dispatch } = useContext(TransactionContext);

  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [view, setView] = useState("table");
  const [type, setType] = useState("all");
  const [frequency, setFrequency] = useState("7");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [values, setValues] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    transactionType: "",
  });


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = async(e) => {
    e.preventDefault();
    console.log(user.existingUser,"user exiseerjf")
    if(user.existingUser.isGuest){
      try{
        const response = await api.delete(`/api/logout`, 
          {
            headers: {Authorization: `Bearer ${user.token}`}
          },
        );
      }catch(err){
        console.log("error in deleting guest user",err);
      }
    }
    logout();
    console.log("end the button")
  };

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleShow = () => {
    console.log("error", error);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleReset = () => {
    setFrequency("7");
    setType("all");
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, category, transactionType, date } = values;
    if (!title || !amount || !category || !transactionType || !date) {
      setError("Please fill all the required details");
      return;
    }
    if(date > new Date().toISOString().split("T")[0]){
      setError("Date should not be greater than today's date ");
      return;
    }
    try {
      const response = await api.post(
        "/api/addTransaction",
        {
          title,
          amount,
          category,
          date,
          transactionType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status !== 201) {
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
      const dateString = response.data.date;
      const indexOfT = dateString.indexOf("T");
      const dateWithoutTime = dateString.substring(0, indexOfT);
      response.data.date = dateWithoutTime;
      dispatch({ type: "CREATE_TRANSACTION", payload: response.data });
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  const handleChangeFrequency = (event) => {
    setFrequency(event.target.value);
    if (frequency !== "custom") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleSetType = (event) => {
    setType(event.target.value);
  };

  const handleTableClick = () => {
    setView("table");
  };

  const handleChartClick = () => {
    setView("chart");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    try{
      if(user.existingUser.isGuest){
        toast.success(`Login as Guest`);
        return;
      }
      toast.success(`Hi ${user.existingUser.FirstName}, welcome back!`);
    }catch(err){
      console.log("error in toast message", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/api/getTransaction`, {
          params: {
            frequency,
            startDate,
            endDate,
            type,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 200) {
          const json = response.data;
          dispatch({ type: "SET_TRANSACTION", payload: json });
        }
      } catch (err) {
        console.log("error in fetching transactions", err);
      }
    };

    fetchTransactions();
  }, [user, dispatch, frequency, type, startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  return (
    <div className="home-container">
      {user ? (
        <>
          <Navbar className="navbarCSS">
            <Navbar.Brand href="/home" className="text-white navTitle">
              PocketGuard
            </Navbar.Brand>
            <div className="profile-container">
              <IconButton onClick={handleMenuClick} className="profile-icon">
                <AccountCircleIcon style={{ color: "white",fontSize: 40 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>{user.existingUser.FirstName}</MenuItem>
                <MenuItem onClick={handleClick}>Logout</MenuItem>
              </Menu>
            </div>
          </Navbar>
          <Container className="mt-3"></Container>
          <div className="row-container">
            <div className="text-white">
              <Form.Group className="mb-3" controlId="formSelectFrequency">
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select
                  name="frequency"
                  value={frequency}
                  onChange={handleChangeFrequency}
                >
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white type">
              <Form.Group className="mb-3" controlId="formSelectFrequency">
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={type} onChange={handleSetType}>
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="credit">Earned</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white iconBtnBox">
              <FormatListBulletedIcon
                sx={{ cursor: "pointer" }}
                onClick={handleTableClick}
                className={`${
                  view === "table" ? "iconActive" : "iconDeactive"
                }`}
              />
              <BarChartIcon
                sx={{ cursor: "pointer" }}
                onClick={handleChartClick}
                className={`${
                  view === "chart" ? "iconActive" : "iconDeactive"
                }`}
              />
            </div>

            <div>
              <Button onClick={handleShow} className="addNew">
                Add New
              </Button>
            </div>
            <Modal
              show={show}
              onHide={handleClose}
              className="centered-modal"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Transaction Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {error && <Alert severity="error">{error}</Alert>}
                <Form>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="text"
                      placeholder="Enter Transaction Name"
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
                      name="date"
                      type="date"
                      placeholder="Enter your Date"
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
          </div>
          <div className="container mt-4 mb-5"></div>
          {frequency === "custom" && (
            <div className="calendar-container">
              <div className="date-picker">
                <label>Start Date: </label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartChange}
                  className="custom-date-picker"
                />
              </div>
              <div className="date-picker">
                <label>End Date: </label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndChange}
                  className="custom-date-picker"
                />
              </div>
            </div>
          )}
          <div className="content">
            <div className="resetBtnBox">
              <Button className="resetBtn" onClick={handleReset}>
                Reset Filter
              </Button>
            </div>
            <div className="row mt-3">
              {view === "table" ? (
                <div className="col-md-12">
                  <TableData />
                </div>
              ) : (
                <div className="col-md-12">
                  <ChartData />
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Home;
