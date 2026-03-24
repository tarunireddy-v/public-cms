import React, { createContext, useState, useEffect, useContext } from 'react';

const ComplaintContext = createContext();

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

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setComplaints(JSON.parse(stored).complaints || []);
        } else {
            setComplaints(initialData.complaints);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
    }, []);

    const saveComplaints = (newComplaints) => {
        setComplaints(newComplaints);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ complaints: newComplaints }));
    };

    const addComplaint = (complaint) => {
        saveComplaints([complaint, ...complaints]);
    };

    const updateComplaintStatus = (id, newStatus, newPriority, note) => {
        const updated = complaints.map(c => {
            if (c.id === id) {
                const now = new Date();
                const dateStr = `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                
                return {
                    ...c,
                    status: newStatus || c.status,
                    priority: newPriority || c.priority,
                    timeline: [...c.timeline, {
                        status: newStatus || c.status,
                        date: dateStr,
                        note: note || `Status updated to ${newStatus}`
                    }]
                };
            }
            return c;
        });
        saveComplaints(updated);
    };

    const getComplaintById = (id) => complaints.find(c => c.id === id);
    const getComplaintsByDepartment = (dept) => complaints.filter(c => c.department === dept);
    const getComplaintsByUser = (userId) => complaints.filter(c => c.citizenId === userId);

    return (
        <ComplaintContext.Provider value={{
            complaints,
            addComplaint,
            updateComplaintStatus,
            getComplaintById,
            getComplaintsByDepartment,
            getComplaintsByUser
        }}>
            {children}
        </ComplaintContext.Provider>
    );
};

export const useComplaints = () => useContext(ComplaintContext);
