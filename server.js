const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Welcome Mr.');
});

const tuitionRoutes = require('./routes/tuitionRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/tuition', tuitionRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
