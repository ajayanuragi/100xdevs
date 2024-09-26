const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { userRouter } = require('./routes/users');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
const mongoose = require('mongoose');

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

main();





