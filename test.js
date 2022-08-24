require('dotenv').config();
const prompts = require('prompts');
const fetch = require('node-fetch');

const API_URL = process.env.API_URL;

const mainMenuEnum = {
    POST: 0,
    PATCH: 1,
    GET: 2,
    EXIT: 3
}
const dtoPrompts = [
    {
        type: 'number',
        name: 'amount',
        message: 'What is the amount of the loan?',
        min: 0,
        float: true,
        initial: 10000
    },
    {
        type: 'number',
        name: 'interest',
        message: 'What is the interest on the loan?',
        min: 0,
        float: true,
        initial: 3.5
    },
    {
        type: 'number',
        name: 'payment',
        message: 'What is the payment on the loan?',
        min: 0,
        float: true,
        initial: 1000
    },
    {
        type: 'number',
        name: 'length',
        message: 'What is the length on the loan?',
        min: 0,
        initial: 36
    }
];
async function updateLoan() {
    const { id } = await prompts({
        type: 'text',
        name: 'id',
        message: 'What is the loan id?',
        initial: "my-uuid",
    });
    const selectedFields = await prompts({
        type: 'multiselect',
        name: 'value',
        message: 'Pick fields to edit',
        choices: [
            { title: 'Amount', value: 'amount' },
            { title: 'Interest', value: 'interest'},
            { title: 'Payment', value: 'payment'},
            { title: 'Length', value: 'length'}
        ]
    });
    const filtered = dtoPrompts.filter((prompt) => selectedFields.value.includes(prompt.name));
    const dto = await prompts(filtered);
    const response = await fetch(`${API_URL}/loans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    console.log(`PATCH ${API_URL}/loans/${id}`, data);
}
async function createLoan() {
    const dto = await prompts(dtoPrompts);
    const response = await fetch(`${API_URL}/loans/`, {
        method: 'POST',
        body: JSON.stringify(dto),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    console.log(`POST ${API_URL}/loans/`, data);
}

async function getLoan() {
    const { id } = await prompts({
        type: 'text',
        name: 'id',
        message: 'What is the loan id?',
        initial: "my-uuid",
    });
    const response = await fetch(`${API_URL}/loans/${id}`);
    const data = await response.json();
    console.log(`GET ${API_URL}/loans/${id}`, data);
}

async function main() {
    while(true) {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick an option',
            choices: [
                { title: 'Create a loan - POST', value: mainMenuEnum.POST},
                { title: 'Update a loan - PATCH', value: mainMenuEnum.PATCH},
                { title: 'Get loan information - GET', value: mainMenuEnum.GET},
                { title: 'Exit', value: mainMenuEnum.EXIT}
            ],
            initial: 1
        });
        switch (response.value) {
            case mainMenuEnum.POST:
                await createLoan();
                break;
            case mainMenuEnum.PATCH:
                await updateLoan();
                break;
            case mainMenuEnum.GET:
                await getLoan();
                break;
            case mainMenuEnum.EXIT:
                process.exit();
        }
    }

}

main();