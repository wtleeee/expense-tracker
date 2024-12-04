const { fetchExpenses, addExpenses, deleteExpenses } = require('../Controllers/ExpenseController');

const router = require('express').Router();

// fetch all the expenses of user based on _id
router.get('/', fetchExpenses);

//add expenses
router.post('/', addExpenses);

//delete Expenses and we expect ID
router.delete('/:expenseId', deleteExpenses);

module.exports = router;