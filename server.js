const express = require('express')
const app = express();
const mongoose = require('mongoose')
const User = require('./user')

mongoose.connect('mongodb://localhost/pagination')

const db = mongoose.connection
db.once('open', async () => {
    if (await User.countDocuments().exec() > 0) return

    Promise.all([
        User.create({ name: 'User1' }),
        User.create({ name: 'User1' }),
        User.create({ name: 'User1' }),
    ]).then(() => console.log('Added Users'))

})
const users = [
    { id: 1, name: "Vishal" },
    { id: 2, name: "Vishal" },
    { id: 3, name: "Vishal" },
    { id: 4, name: "Vishal" },
    { id: 5, name: "Vishal" },
    { id: 6, name: "Vishal" },
    { id: 7, name: "Vishal" },
    { id: 8, name: "Vishal" },
    { id: 9, name: "Vishal" },
    { id: 10, name: "Vishal" },
    { id: 11, name: "Vishal" },
    { id: 12, name: "Vishal" },
    { id: 13, name: "Vishal" },
    { id: 14, name: "Vishal" },
];

app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedresults)
})



function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const results = {}
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        results.results = model.slice(startIndex, endIndex);
        try {
            results.results = await model.find().limt(limit).skip(startIndex).exec()
            res.paginatedresults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}
app.listen(3000);