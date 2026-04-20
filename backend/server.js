import express from 'express';
import cors from 'cors';
import { handleBookingBefore } from './before/bookingHandler.before.js';
import { handleBookingAfter, setupObservers } from './after/bookingHandler.after.js';
import { state } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize observers for the AFTER design pattern framework
setupObservers();

// -------------------------------------------------------------
// POST /api/before/booking 
// ❌ Uses handleBookingBefore() (Monolithic messy handler)
// -------------------------------------------------------------
app.post('/api/before/booking', handleBookingBefore);

// -------------------------------------------------------------
// POST /api/after/booking 
// ✅ Uses handleBookingAfter() (Decorator-wrapped clean handler)
// -------------------------------------------------------------
app.post('/api/after/booking', handleBookingAfter);

// -------------------------------------------------------------
// ANCILLARY ROUTES (Basic CRUD/Retrieval)
// -------------------------------------------------------------
app.get('/api/bookings', (req, res) => {
    res.json([...state.bookings].reverse());
});

app.get('/api/notifications', (req, res) => {
    // Return last 10 notification logs
    res.json(state.notifications.slice(-10).reverse());
});

app.get('/api/analytics', (req, res) => {
    res.json(state.analytics);
});

app.post('/api/events', (req, res) => {
    const { title, date, location } = req.body;
    if (!title || !date || !location) {
        return res.status(400).json({ error: 'Missing required event fields' });
    }
    const newEvent = { id: Date.now(), title, date, location };
    state.events.unshift(newEvent);
    res.status(201).json(newEvent);
});

app.get('/api/events', (req, res) => {
    res.json(state.events);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
    console.log(`Ready for REST traffic.`);
});
