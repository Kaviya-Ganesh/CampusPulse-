import { state } from '../db.js';

// ==========================================
// 4. OBSERVER PATTERN (Pub/Sub)
// ==========================================
// ✅ AFTER: Decouples core logic from side effects. Services listen to events without 
//           adding clutter to the main handler.
class EventBus {
    constructor() {
        this.listeners = {};
    }
    subscribe(eventType, handler) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(handler);
    }
    publish(eventType, eventData) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(handler => handler(eventData));
        }
    }
}
export const eventBus = new EventBus();

export const setupObservers = () => {
    // Subscriber 1: Notification Service
    eventBus.subscribe('booking.created', (event) => {
        const { booking, notificationPref } = event.payload;
        
        // ==========================================
        // 3. STRATEGY PATTERN
        // ==========================================
        // ✅ AFTER: Avoids long if/else statements. Extensible by simply adding a new Strategy class.
        let strategy;
        if (notificationPref === 'email') {
            strategy = new SendEmailStrategy();
        } else if (notificationPref === 'sms') {
            strategy = new SendSMSStrategy();
        } else {
            strategy = new DefaultStrategy();
        }
        
        const notificationMsg = strategy.send(booking);
        const typeStr = notificationPref ? notificationPref.toUpperCase() : 'SYSTEM';
        state.notifications.push({ type: typeStr, message: notificationMsg, timestamp: new Date().toISOString() });
    });

    // Subscriber 2: Analytics Service
    eventBus.subscribe('booking.created', (event) => {
        const { booking } = event.payload;
        state.analytics.totalBookings += 1;
        if (!state.analytics.byRoom[booking.room]) {
            state.analytics.byRoom[booking.room] = 0;
        }
        state.analytics.byRoom[booking.room] += 1;
    });
};

class SendEmailStrategy {
    send(booking) {
        const msg = `Sending EMAIL to ${booking.studentName}: Room ${booking.room} booked on ${booking.date} at ${booking.time}`;
        console.log(msg);
        return msg;
    }
}

class SendSMSStrategy {
    send(booking) {
        const msg = `Sending SMS to ${booking.studentName}: Room ${booking.room} booked on ${booking.date} at ${booking.time}`;
        console.log(msg);
        return msg;
    }
}

class DefaultStrategy {
    send(booking) {
        const msg = `System Alert: No notification preference for ${booking.studentName}`;
        console.log(msg);
        return msg;
    }
}

// ==========================================
// 2. FACTORY PATTERN
// ==========================================
// ✅ AFTER: Centralizes object creation. Type-safe and standardizes event structure.
class EventFactory {
    static create(type, payload) {
        return {
            id: 'evt_' + Date.now().toString(),
            type,
            payload,
            timestamp: new Date().toISOString()
        };
    }
}

// ==========================================
// 1. DECORATOR PATTERN (Middleware chain)
// ==========================================
// ✅ AFTER: Wraps the main handler with reusable cross-cutting functionalities.

const withErrorHandling = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error(`[ERROR] AFTER Refactor - Error handling booking:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const withLogging = (handler) => async (req, res) => {
    console.log(`[LOG] AFTER Refactor - Incoming request to ${req.originalUrl} received.`);
    await handler(req, res);
    console.log(`[LOG] AFTER Refactor - Request finished.`);
};

const withAuth = (handler) => async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    await handler(req, res);
};

// ==========================================
// CORE HANDLER
// ==========================================
// ✅ AFTER: Single Responsibility Principle purely maintained.
// Core is strictly unaware of Auth, Logging, Errors, Analytics, or Notifications.
const coreBookingHandler = async (req, res) => {
    const { room, date, time, studentName, notificationPref } = req.body;

    if (!room || !date || !time || !studentName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBooking = {
        id: Date.now().toString(),
        room,
        date,
        time,
        studentName,
        createdAt: new Date().toISOString()
    };

    state.bookings.push(newBooking);

    // Use Factory and Observer rather than inline coupling
    const bookingEvent = EventFactory.create('booking.created', { booking: newBooking, notificationPref });
    eventBus.publish('booking.created', bookingEvent);

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
};

// Apply decorators (middleware chain)
export const handleBookingAfter = withErrorHandling(withLogging(withAuth(coreBookingHandler)));
