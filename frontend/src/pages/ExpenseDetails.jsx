import React from "react";
import '../styles/ExpenseDetails.css'

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    console.log('incomeAmt,expenseAmt ', incomeAmt, expenseAmt)

    return (
        <div>
            <div className="amounts-container">
                <div className="balance-row">
                    Balance: <span className="balance-amount">{incomeAmt - expenseAmt}</span>
                </div>
                <div className="income-expense-row">
                    Income: <span className="income-amount">{incomeAmt}</span>
                    Expense: <span className="expense-amount">{expenseAmt}</span>
                </div>
            </div>
        </div>
    )
}

export default ExpenseDetails