// Rule-based classifier for Complaint Assignment
const departments = [
    'Electricity',
    'Water',
    'Sanitation',
    'Roads',
    'Public Safety',
    'Animal Control',
    'Noise & Public Disturbance',
    'Drainage & Sewage'
];

const classifyComplaint = (title, description) => {
    const textToAnalyze = `${title} ${description}`.toLowerCase();

    // Electricity keywords
    if (textToAnalyze.match(/light|streetlight|electric|power|wire|blackout|outage/)) {
        return 'Electricity Department';
    }
    
    // Water keywords
    if (textToAnalyze.match(/water|pipe|leak|drain|flood|sewage/)) {
        return 'Water Supply Department';
    }

    // Sanitation keywords
    if (textToAnalyze.match(/garbage|trash|waste|dump/)) {
        return 'Sanitation Department';
    }

    // Roads keywords
    if (textToAnalyze.match(/road|pothole|pavement|sidewalk|street|bridge|traffic/)) {
        return 'Roads & Infrastructure';
    }

    // Default catch-all
    return 'Public Safety';
};

export const classifier = {
    classify: classifyComplaint,
    departments: departments
};

export default classifier;
