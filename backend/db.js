export const state = {
  bookings: [],
  events: [
    { id: 1, title: 'Software Patterns Lecture', date: '2026-05-10', location: 'Hall A' },
    { id: 2, title: 'Hackathon Info Session', date: '2026-05-15', location: 'Room 204' }
  ],
  notifications: [
    { type: 'SYSTEM', message: 'System Initialized. Awaiting bookings...', timestamp: new Date().toISOString() }
  ],
  analytics: {
    totalBookings: 0,
    byRoom: {}
  }
};
