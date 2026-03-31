import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../utils/api';
import { matchesComplaintSearch } from '../utils/complaintSearch';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const mapComplaint = (item) => {
        const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
        const dateStr = `${createdDate.toLocaleString('en-US', { month: 'short' })} ${createdDate.getDate()}, ${createdDate.getFullYear()}`;
        const timelineDate = `${dateStr} • ${createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        return {
            ...item,
            id: item._id,
            category: item.department,
            priority: item.priority || 'Medium',
            createdAt: item.createdAt || new Date().toISOString(),
            remarks: item.remarks || '',
            date: dateStr,
            citizenId: String(item.userId),
            evidence: item.image || null,
            timeline: item.timeline || [
                { status: item.status || 'Submitted', date: timelineDate, note: 'Complaint submitted.' }
            ]
        };
    };

    const fetchComplaints = useCallback(async () => {
        try {
            const response = await api.getComplaints();
            setComplaints(response.map(mapComplaint));
        } catch (_error) {
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const addComplaint = async (complaintPayload) => {
        const response = await api.createComplaint(complaintPayload);
        const complaint = mapComplaint(response.complaint);
        setComplaints(prev => [complaint, ...prev]);
        return complaint;
    };

    const updateComplaintStatus = async (id, newStatus, newPriority, note) => {
        const response = await api.updateComplaint(id, {
            status: newStatus,
            priority: newPriority,
            remarks: note,
        });
        console.log("Update response:", response);
        const updatedComplaint = mapComplaint(response);
        setComplaints(prev => prev.map(c => (c.id === id ? { ...c, ...updatedComplaint } : c)));
    };

    const getComplaintById = (id) => complaints.find(c => c.id === id);
    const getComplaintsByDepartment = (dept) => complaints.filter(c => c.department === dept);
    const getComplaintsByUser = (userId) => complaints.filter(c => c.citizenId === userId);

    const filterComplaintsBySearch = useCallback((list) => {
        if (!list || !list.length) return list || [];
        return list.filter((c) => matchesComplaintSearch(c, searchQuery));
    }, [searchQuery]);

    return (
        <ComplaintContext.Provider value={{
            complaints,
            loading,
            searchQuery,
            setSearchQuery,
            filterComplaintsBySearch,
            addComplaint,
            fetchComplaints,
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
