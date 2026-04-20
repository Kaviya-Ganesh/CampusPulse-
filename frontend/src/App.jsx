import React, { useState, useEffect } from 'react';
import { Calendar, Bell, BarChart3, Presentation, Server, Plus, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_BASE = 'http://localhost:3000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('book');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100 flex flex-col font-sans selection:bg-primary-500/30">
      
      {/* HEADER */}
      <header className="glass-panel rounded-none border-t-0 border-x-0 border-b-slate-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500/20 p-2 rounded-xl text-primary-400">
              <Presentation size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400">CampusPulse</h1>
            </div>
          </div>
          
        </div>
      </header>

      {/* STATUS BANNER */}
      {statusMsg.text && (
        <div className={cn("text-center py-2 text-sm font-medium animate-in fade-in slide-in-from-top-2", statusMsg.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400')}>
          {statusMsg.text}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAV */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <nav className="glass-panel p-3 flex flex-col gap-1">
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Modules</div>
            
            <NavItem icon={Calendar} label="Book a Room" active={activeTab === 'book'} onClick={() => setActiveTab('book')} />
            <NavItem icon={Server} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
            <NavItem icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
            <NavItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          </nav>

        </aside>

        {/* TAB CONTENT */}
        <section className="flex-1 animate-in fade-in duration-500">
          {activeTab === 'book' && <BookingTab setStatusMsg={setStatusMsg} />}
          {activeTab === 'events' && <EventsTab setStatusMsg={setStatusMsg} />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </section>

      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={cn("nav-item w-full", active && "active")}>
      <Icon size={20} className={cn("transition-colors", active ? "text-primary-400" : "text-slate-500")} />
      <span>{label}</span>
    </button>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function BookingTab({ setStatusMsg }) {
  const [formData, setFormData] = useState({
    studentName: '',
    room: 'Hall A',
    date: '',
    time: '',
    notificationPref: 'email'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = '/after/booking'; // Defaulting to the refactored code
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'admin' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ text: '🎉 Booking successful!', type: 'success' });
        setFormData({ ...formData, studentName: '', date: '', time: '' });
      } else {
        setStatusMsg({ text: `❌ Error: ${data.error}`, type: 'error' });
      }
    } catch (err) {
      setStatusMsg({ text: `❌ Network Error. Ensure backend is running.`, type: 'error' });
    }
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  return (
    <div className="glass-panel p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><Calendar size={24} /></div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Book a Room</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Student Name</label>
            <input required type="text" className="input-field" placeholder="Jane Doe" 
              value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Room</label>
            <select className="input-field appearance-none" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}>
              <option value="Hall A">Hall A</option>
              <option value="Room 204">Room 204</option>
              <option value="Lab 3">Lab 3</option>
              <option value="Conference Room B">Conference Room B</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Date</label>
            <input required type="date" className="input-field" 
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Time</label>
            <input required type="time" className="input-field" 
              value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-700/50">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Notification Preference</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="notify" value="email" checked={formData.notificationPref === 'email'}
                onChange={e => setFormData({...formData, notificationPref: e.target.value})}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500 bg-slate-900 border-slate-700" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="notify" value="sms" checked={formData.notificationPref === 'sms'}
                onChange={e => setFormData({...formData, notificationPref: e.target.value})}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500 bg-slate-900 border-slate-700" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">SMS</span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary mt-6 text-lg flex items-center justify-center gap-2">
          Submit Request
        </button>
      </form>
    </div>
  );
}

BookingTab.propTypes = {
  setStatusMsg: PropTypes.func.isRequired,
};

function EventsTab({ setStatusMsg }) {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', date: '', location: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE}/events`);
      const data = await res.json();
      setEvents(data);
    } catch(err) { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        setStatusMsg({ text: 'Event added!', type: 'success' });
        setFormData({ title: '', date: '', location: '' });
        fetchEvents();
      }
    } catch(err) { }
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><Plus size={20} className="text-emerald-400" /> Create Event</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-xs text-slate-400 uppercase">Title</label>
            <input required type="text" className="input-field py-2" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="w-full md:w-auto space-y-1">
            <label className="text-xs text-slate-400 uppercase">Date</label>
            <input required type="date" className="input-field py-2" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="w-full md:w-auto space-y-1">
            <label className="text-xs text-slate-400 uppercase">Location</label>
            <input required type="text" className="input-field py-2" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
          </div>
          <button type="submit" className="w-full md:w-auto btn-primary py-2 px-6">Add</button>
        </form>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/50">
          <h3 className="font-semibold text-slate-200">Upcoming Events</h3>
        </div>
        <div className="p-2">
          {events.length === 0 && <p className="p-4 text-sm text-slate-500 text-center">No events found.</p>}
          <div className="divide-y divide-slate-700/30">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center hover:bg-slate-800/40 transition-colors rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-200">{ev.title}</h4>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mt-1"><Server size={14} /> {ev.location}</p>
                </div>
                <div className="mt-2 md:mt-0 px-3 py-1 bg-slate-900/60 border border-slate-700 rounded-lg text-xs font-mono text-primary-300">
                  {ev.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

EventsTab.propTypes = {
  setStatusMsg: PropTypes.func.isRequired,
};

function NotificationsTab() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/notifications`);
        const data = await res.json();
        setLogs(data);
      } catch(err) { }
    };
    fetchLogs();
    const intv = setInterval(fetchLogs, 2000);
    return () => clearInterval(intv);
  }, []);

  return (
    <div className="glass-panel h-[600px] flex flex-col">
      <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Bell size={24} className="text-amber-400" /> Notifications Stream</h2>
          <p className="text-xs text-slate-400 mt-1">Live feed of dispatch events. Auto-updates every 2s.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-900/30">
        {logs.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
             <AlertCircle size={32} />
             <p>No notifications yet</p>
           </div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:bg-slate-800 transition-colors">
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", log.type === 'EMAIL' ? 'bg-primary-500' : log.type === 'SMS' ? 'bg-indigo-500' : 'bg-slate-500')} />
            <div className="flex flex-col md:flex-row justify-between md:items-start pl-2 gap-2">
              <div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider inline-block", 
                  log.type === 'EMAIL' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/20' : 
                  log.type === 'SMS' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' : 'bg-slate-700 text-slate-300 border border-slate-600'
                )}>
                  {log.type}
                </span>
                <p className="text-slate-200 font-medium text-sm mt-3 leading-relaxed">{log.message}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono shrink-0 bg-slate-900 px-2 py-1 rounded">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [stats, setStats] = useState({ totalBookings: 0, byRoom: {} });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/analytics`);
        const data = await res.json();
        setStats(data);
      } catch(err) {}
    };
    fetchStats();
    const intv = setInterval(fetchStats, 3000);
    return () => clearInterval(intv);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="glass-panel p-6 flex flex-col justify-center bg-gradient-to-br from-slate-800 to-slate-900 border-t border-t-primary-500/30">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-400" /> Total Bookings (Global)
          </h3>
          <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            {stats.totalBookings}
          </p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Bookings by Room</h3>
        </div>
        <div className="p-2">
          {Object.keys(stats.byRoom).length === 0 ? (
            <p className="p-6 text-sm text-center text-slate-500">No bookings data yet.</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg font-semibold tracking-wider">Room Name</th>
                  <th className="px-6 py-3 rounded-tr-lg font-semibold tracking-wider text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {Object.entries(stats.byRoom).map(([room, count]) => (
                  <tr key={room} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{room}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-center min-w-[2.5rem] h-8 px-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold rounded-lg shadow-inner">
                        {count}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
