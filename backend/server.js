require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const placeRoutes = require('./routes/placeRoutes');
const sosRoutes = require('./routes/sosRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initSosSocket } = require('./sockets/sosSocket');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// connect DB
connectDB(process.env.MONGO_URI);

// routes
app.use('/api/places', placeRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'Smart Inclusion API' }));

// error handler (after routes)
app.use(errorHandler);

// init sockets
initSosSocket(io);

// export io on app for controllers that want to emit
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
