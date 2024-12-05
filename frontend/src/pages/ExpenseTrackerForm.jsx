import React, { useState } from "react";
import { handleError } from "../utils";
import '../styles/ExpenseTrackerForm.css';

function ExpenseTrackerForm({ addExpenses, closeOverlay }) {
  const [expenseInfo, setExpenseInfo] = useState({
    text: '',
    amount: '',
    type: 'Other',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseInfo({ ...expenseInfo, [name]: value });
  };

  const handleExpense = async (e) => {
    e.preventDefault();
    const { text, amount, type, date } = expenseInfo;

    if (!text || !amount || !type || !date) {
      handleError('All fields are required');
      return;
    }

    await addExpenses(expenseInfo);

    // Clear form after submission
    setTimeout(() => {
      setExpenseInfo({ text: '', amount: '', type: 'Other', date: '' });
    }, 1000);
    // Close the overlay after form submission
    closeOverlay();
  };

  return (
    <div className='expenseform-container'>
      <h3>Enter expense details:</h3>
      <form onSubmit={handleExpense}>
        <div>
          <label htmlFor='text'>Description</label>
          <input
            onChange={handleChange}
            type='text'
            name='text'
            placeholder='Enter your Expense Description...'
            value={expenseInfo.text}
          />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input
            onChange={handleChange}
            type='number'
            name='amount'
            placeholder='Enter Amount (Expense: -ve, Income: +ve)...'
            value={expenseInfo.amount}
          />
        </div>
        <div className='type_selection'>
          <label htmlFor='type'>Category</label>
          <select
            onChange={handleChange}
            name='type'
            value={expenseInfo.type}
          >
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
        <div>
          <label htmlFor='date'>Date</label>
          <input
            onChange={handleChange}
            type='date'
            name='date'
            value={expenseInfo.date}
          />
        </div>
        <button type='submit'>Add Record</button>
      </form>
    </div>
  );
}

export default ExpenseTrackerForm;
