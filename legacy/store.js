// Mock store for persistence
const STORAGE_KEY = 'smart_public_cms_data_v2';

const initialData = {
    complaints: [
        {
            id: 'REF-90210',
            title: 'Broken Street Light',
            description: 'The street light at the corner of 5th Ave and Maple St has been flickering for three nights and finally went out completely this evening. This is a safety hazard for pedestrians as the area is very dark.',
            location: '5th Ave & Maple St, Sector 4',
            category: 'Electricity',
            department: 'Electricity Department',
            priority: 'High',
            status: 'In Progress',
            date: 'Oct 12, 2023',
            citizenId: 'user1',
            evidence: 'path/to/image.jpg',
            timeline: [
                { status: 'Submitted', date: 'Oct 12, 2023 • 08:30 AM', note: 'Complaint submitted by citizen.' },
                { status: 'Assigned', date: 'Oct 12, 2023 • 09:45 AM', note: 'Automatically assigned to Electricity Department.' },
                { status: 'In Progress', date: 'Oct 14, 2023 • 11:20 AM', note: 'Engineer dispatched to location.' }
            ]
        },
        {
            id: 'REF-90102',
            title: 'Road Pothole',
            description: 'Large pothole on the northbound lane of Main St. Bridge causing traffic delays and vehicle damage.',
            location: 'Main St. Bridge',
            category: 'Roads',
            department: 'Roads & Infrastructure',
            priority: 'Medium',
            status: 'Submitted',
            date: 'Oct 24, 2023',
            citizenId: 'user1',
            evidence: null,
            timeline: [
                { status: 'Submitted', date: 'Oct 24, 2023 • 10:00 AM', note: 'Complaint submitted.' }
            ]
        },
        {
            id: 'REF-8871',
            title: 'Water Leakage',
            description: 'Major water leak from a broken pipe near the central park entrance.',
            location: 'Central Park Entrance',
            category: 'Water',
            department: 'Water Supply Department',
            priority: 'High',
            status: 'Assigned',
            date: 'Nov 02, 2023',
            citizenId: 'user1',
            evidence: null,
            timeline: [
                { status: 'Submitted', date: 'Nov 02, 2023 • 08:00 AM', note: 'Complaint submitted.' },
                { status: 'Assigned', date: 'Nov 02, 2023 • 08:15 AM', note: 'Assigned to Water Supply Department.' }
            ]
        },
        {
            id: 'REF-1123',
            title: 'Garbage Collection',
            description: 'Trash has not been collected in our neighborhood for the past two weeks.',
            location: 'Sector 7 Residential Area',
            category: 'Sanitation',
            department: 'Sanitation Department',
            priority: 'Low',
            status: 'Resolved',
            date: 'Oct 15, 2023',
            citizenId: 'user2',
            evidence: null,
            timeline: [
                { status: 'Submitted', date: 'Oct 15, 2023 • 09:00 AM', note: 'Complaint submitted.' },
                { status: 'Assigned', date: 'Oct 15, 2023 • 09:15 AM', note: 'Assigned to Sanitation Department.' },
                { status: 'Resolved', date: 'Oct 18, 2023 • 02:00 PM', note: 'Garbage has been collected and schedule restored.' }
            ]
        }
    ]
};

const store = {
    getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            this.saveData(initialData);
            return initialData;
        }
        return JSON.parse(data);
    },

    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    getComplaints() {
        return this.getData().complaints;
    },

    addComplaint(complaint) {
        const data = this.getData();
        data.complaints.unshift(complaint);
        this.saveData(data);
    },

    updateComplaintStatus(id, newStatus, note) {
        const data = this.getData();
        const complaint = data.complaints.find(c => c.id === id);
        if (complaint) {
            complaint.status = newStatus;
            const now = new Date();
            const dateStr = `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            complaint.timeline.push({
                status: newStatus,
                date: dateStr,
                note: note || `Status updated to ${newStatus}`
            });
            this.saveData(data);
            return true;
        }
        return false;
    },

    getComplaintById(id) {
        return this.getComplaints().find(c => c.id === id);
    },

    getComplaintsByDepartment(department) {
        return this.getComplaints().filter(c => c.department === department);
    },
    
    getComplaintsByCitizen(citizenId) {
        return this.getComplaints().filter(c => c.citizenId === citizenId);
    }
};

window.store = store;
