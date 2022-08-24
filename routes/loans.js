const express = require('express');
const router = express.Router();
const { createLoan, getLoan, updateLoan } = require('../db/loan');

// define the home page route
router.get('/:id', async (req, res) => {
    console.log('GET', req.params.id);
    const loan = await getLoan(req.params.id);
    console.log(loan);
    res.json(loan);
});

router.post('/', async (req, res) => {
    console.log('POST');
    const { amount = null, interest = null, length = null, payment = null} = req.body;
    //check for all properties
    if (amount && interest && length && payment) {
        const createdLoanId = await createLoan(amount, interest, length, payment);
        res.json(createdLoanId);
    } else {
        throw new Error('incorrect payload');
    }
})

router.patch('/:id', async (req, res) => {
    console.log('PATCH', req.params.id);
    updateLoan(req.params.id, req.body);
    res.json(true);
});

module.exports = router;