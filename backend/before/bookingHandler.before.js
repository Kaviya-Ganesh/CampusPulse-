import { state } from '../db.js';

// ❌ BEFORE: Auth check, logging, validation, business logic, notification logic, and analytics are crammed into ONE function.
// ❌ BEFORE: Violates SRP (Single Responsibility Principle) and DRY.
// ❌ BEFORE: Hardcoded inline auth check.
// ❌ BEFORE: Inline object literals (No factory).
// ❌ BEFORE: Long if/else for notification (No strategy).
export const handleBookingBefore = (req, res) => {
    // 1. Inline Auth Check
    const authHeader = req.headers.authorization;
    if (authHeader !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    try {
        // 2. Inline Logging
        console.log(`[LOG] BEFORE Refactor - Incoming booking request received.`);

        const { room, date, time, studentName, notificationPref } = req.body;

        if (!room || !date || !time || !studentName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 3. Inline Booking Creation (No Factory)
        const newBooking = {
            id: Date.now().toString(),
            room,
            date,
            time,
            studentName,
            createdAt: new Date().toISOString()
        };

        state.bookings.push(newBooking);

        // 4. Inline Analytics Update
        state.analytics.totalBookings += 1;
        if (!state.analytics.byRoom[room]) {
            state.analytics.byRoom[room] = 0;
        }
        state.analytics.byRoom[room] += 1;

        // 5. Inline event generation 
        const eventData = {
            type: 'booking.created',
            payload: newBooking,
            timestamp: new Date().toISOString()
        };
        console.log(`[LOG] BEFORE Refactor - Internal Event Generated:`, eventData.type);
        
        // 6. Long if/else for notifications (No Strategy Pattern)
        let notificationMsg = '';
        if (notificationPref === 'email') {
             notificationMsg = `Sending EMAIL to ${studentName}: Room ${room} booked on ${date} at ${time}`;
             console.log(`[LOG] Sending EMAIL alert`);
             state.notifications.push({ type: 'EMAIL', message: notificationMsg, timestamp: new Date().toISOString() });
        } else if (notificationPref === 'sms') {
             notificationMsg = `Sending SMS to ${studentName}: Room ${room} booked on ${date} at ${time}`;
             console.log(`[LOG] Sending SMS alert`);
             state.notifications.push({ type: 'SMS', message: notificationMsg, timestamp: new Date().toISOString() });
        } else {
             notificationMsg = `System Alert: No notification preference for ${studentName}`;
             console.log(`[LOG] System Alert`);
             state.notifications.push({ type: 'SYSTEM', message: notificationMsg, timestamp: new Date().toISOString() });
        }

        console.log(`[LOG] BEFORE Refactor - Booking successful:`, newBooking.id);

        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        // 7. Inline Error Handling
        console.error(`[ERROR] BEFORE Refactor - Error handling booking:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
