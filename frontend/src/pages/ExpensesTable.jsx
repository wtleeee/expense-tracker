import React from 'react'
import '../styles/ExpensesTable.css'

function ExpensesTable({ expenses, handDeleteExpense }) {
    console.log('ExpensesTable-->', expenses)
    return (
        <div className='expense-list'>
            <div className='table-heading'>
                <div className='heading-description'>Description</div>
                <div className='heading-amount'>Amount</div>
                <div className='heading-date'>Date</div>
                <div className='heading-delete'>Delete</div>
            </div>
            {
                expenses?.map((expense, index) => (

                    <div Key={index} className='expense-item'>

                        <div className='expense-description'>{expense.text}</div>
                        <div className='expense-amount-2'
                            style={{
                                color: expense.amount > 0 ? '#3cb371' : '#d64545'
                            }}
                        >
                            {expense.amount}
                        </div>
                        <div className='expense-date'>{new Date(expense.date).toLocaleDateString()}</div>
                        <div className='delete-button-container'>
                            <button className='delete-button' onClick={() => handDeleteExpense(expense._id)}>X</button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ExpensesTable