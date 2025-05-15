// src/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const ticketRouter = require('./routes/tickets')
const procurementRouter = require('./routes/procurement');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter)
app.use('/api', procurementRouter);
app.use('/api/admin', adminRouter);
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('🗄️ Connected to MongoDB');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
