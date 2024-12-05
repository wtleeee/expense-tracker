import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpensesTable from './ExpensesTable';
import ExpenseTrackerForm from './ExpenseTrackerForm';
import ExpenseDetails from './ExpenseDetails';
import Dashboard from './Dashboard';
import '../styles/Home.css'

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [filterType, setFilterType] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [showDashboard, setShowDashboard] = useState(false);
    const [sortOrder, setSortOrder] = useState("dateDesc");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleFilter = (e) => {
        setFilterType(e.target.value);
    }

    const handleMonthFilter = (e) => {
        setSelectedMonth(e.target.value); // Update the selected month
    }

    const handleYearFilter = (e) => {
        setSelectedYear(e.target.value); // Update the selected year
    }
    useEffect(() => {
        const amounts = filteredExpenses.map((item) => item.amount);
        console.log(amounts);

        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        console.log('income: ', income)

        // will show the expenses in poitive
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1;
        console.log('expense: ', exp)

        setIncomeAmt(income);
        setExpenseAmt(exp);

    }, [filterType, filteredExpenses, selectedMonth, selectedYear]);

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log(result.data);
            setExpenses(result.data);
            setFilteredExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }


    const addExpenses = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify(data)
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log(result.data);
            setExpenses(result.data);
            handleSuccess(result.message)
        } catch (err) {
            handleError(err);
        }
    }
    //search query function
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    useEffect(() => {
        let filtered = expenses;
        // Search query filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((expense) =>
                expense.text && expense.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        // Filter by type if filterType is set
        if (filterType) {
            filtered = filtered.filter((expense) => expense.type === filterType);
        }

        // Filter by month if selectedMonth is set
        if (selectedMonth) {
            filtered = filtered.filter((expense) => {
                const expenseMonth = new Date(expense.date).getMonth() + 1; // Get month (1-12)
                return expenseMonth === parseInt(selectedMonth);
            });
        }

        // Filter by year if selectedYear is set
        if (selectedYear) {
            filtered = filtered.filter((expense) => {
                const expenseYear = new Date(expense.date).getFullYear(); // Get year
                return expenseYear === parseInt(selectedYear);
            });
        }

        // Sort order
        if (sortOrder === "asc") {
            filtered = [...filtered].sort((a, b) => a.amount - b.amount);
        } else if (sortOrder === "desc") {
            filtered = [...filtered].sort((a, b) => b.amount - a.amount);
        } else if (sortOrder === "dateAsc") {
            filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending by date
        } else if (sortOrder === "dateDesc") {
            filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending by date
        }



        setFilteredExpenses(filtered);
    }, [filterType, expenses, selectedMonth, selectedYear, sortOrder, searchQuery]);

    useEffect(() => {
        fetchExpenses()
    }, [])

    const handDeleteExpense = async (expenseId) => {
        try {
            const url = `${APIUrl}/expenses/${expenseId}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'

                },
                method: 'DELETE'
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log(result.data);
            setExpenses(result.data);
            handleSuccess(result.message)
        } catch (err) {
            handleError(err);
        }
    }

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle the visibility of the form
    };

    const closeOverlay = () => {
        setShowForm(false); // Close the overlay by setting showForm to false
        setShowDashboard(false);
    };

    const toggleDashboard = () => {
        setShowDashboard(!showDashboard); // Toggle the visibility of the dashboard
    };

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <div className='user-section'>
                    <h1>Welcome {loggedInUser}</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
                <ExpenseDetails
                    incomeAmt={incomeAmt}
                    expenseAmt={expenseAmt} />
                <br />
                <button onClick={toggleForm}>
                    Add Record
                </button>
                <button onClick={toggleDashboard}>View Dashboard</button>
                <br />
                <hr className="custom-hr" />
                {showForm && (
                    <div className="overlay">
                        <div className="form-container">
                            <button className='close-button' onClick={closeOverlay}>X</button>
                            <ExpenseTrackerForm addExpenses={addExpenses} closeOverlay={closeOverlay} />
                        </div>
                    </div>
                )}

                {showDashboard && (
                    <div className="overlay">
                        <div className="dashboard-container">
                            <button className="close-button" onClick={closeOverlay}>X</button>
                            <Dashboard filteredExpenses={filteredExpenses} />
                        </div>
                    </div>
                )}

                <div className='filter-container'>

                    <div className="type-filter">
                        <div>
                            <label htmlFor='filtertype'>Category</label>
                        </div>
                        <div>
                            <select
                                name='filtertype'
                                onChange={handleFilter}
                                defaultValue=""
                            >
                                <option value=''>All</option>
                                <option value='Housing'>Housing</option>
                                <option value='Groceries'>Groceries</option>
                                <option value='Transportation'>Transportation</option>
                                <option value='Health'>Health</option>
                                <option value='Debt Payments'>Debt Payments</option>
                                <option value='Entertainment'>Entertainment</option>
                                <option value='Clothing'>Clothing</option>
                                <option value='Income'>Income</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="month-filter">
                        <div>
                            <label htmlFor="month">Month</label>
                        </div>
                        <div>
                            <select name="month" onChange={handleMonthFilter} value={selectedMonth}>
                                <option value="">All</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                    </div>

                    <div className="year-filter">
                        <div className="filter-label">
                            <label htmlFor="year">Year</label>
                        </div>
                        <div className="filter-dropdown">
                            <select name="year" onChange={handleYearFilter} value={selectedYear}>
                                <option value="">All</option>
                                {Array.from(new Set(expenses.map((expense) => new Date(expense.date).getFullYear())))
                                    .map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="sort-container">
                    <div>
                        <select
                            name="sort"
                            onChange={(e) => setSortOrder(e.target.value)}
                            value={sortOrder}
                        >
                            {/* <option value="">Sorting : Default</option> */}
                            <option value="dateDesc">Sorting : Default - Date (Newest to Oldest)</option>
                            <option value="dateAsc">Date (Oldest to Newest)</option>
                            <option value="asc">Amount Ascending</option>
                            <option value="desc">Amount Descending</option>
                        </select>
                    </div>
                </div>
                <div className='search-section'>
                    <div className="search-bar">
                        <label>Search by name: </label>
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>



                <ExpensesTable
                    expenses={filteredExpenses}
                    handDeleteExpense={handDeleteExpense} />

                <ToastContainer />
            </div>
        </div>
    )
}

export default Home
