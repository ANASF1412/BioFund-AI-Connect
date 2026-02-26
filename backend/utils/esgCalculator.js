/**
 * ESG Score Calculation Utility
 * Calculates Environmental, Social, and Governance scores
 */

const calculateESGScore = (project, fundingCount) => {
    // ===== ENVIRONMENTAL SCORE (0-100) =====
    // Based on impact metrics
    const treeScore = Math.min((project.impacts?.treesPlanted || 0) / 1000, 40); // Max 40 points
    const waterScore = Math.min((project.impacts?.waterSaved || 0) / 100000, 30); // Max 30 points
    const landScore = Math.min((project.impacts?.landsRestored || 0) * 5, 30); // Max 30 points
    const environmentalScore = treeScore + waterScore + landScore;

    // ===== SOCIAL SCORE (0-100) =====
    // Based on project updates and community engagement
    const updateScore = Math.min((project.updates?.length || 0) * 10, 40); // Max 40 points
    const fundingScore = Math.min((fundingCount || 0) * 3, 60); // Max 60 points
    const socialScore = updateScore + fundingScore;

    // ===== GOVERNANCE SCORE (0-100) =====
    // Based on NGO trust score and project status
    const trustScore = (project.ngoTrustScore || 5) * 10; // 0-100
    const statusBonus = project.status === 'Approved' ? 0 : -10; // Penalty if pending
    const governanceScore = Math.min(trustScore + statusBonus, 100);

    // ===== FINAL ESG SCORE =====
    const esgScore = ((environmentalScore + socialScore + governanceScore) / 3).toFixed(2);

    // ===== ESG LABEL =====
    const getESGLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Moderate';
        if (score >= 20) return 'Fair';
        return 'Poor';
    };

    const esgLabel = getESGLabel(parseFloat(esgScore));

    // ===== ESG COLOR =====
    const getESGColor = (label) => {
        switch (label) {
            case 'Excellent':
                return '#10b981'; // Emerald
            case 'Good':
                return '#3b82f6'; // Blue
            case 'Moderate':
                return '#f59e0b'; // Amber
            case 'Fair':
                return '#ef4444'; // Red
            default:
                return '#6b7280'; // Gray
        }
    };

    const esgColor = getESGColor(esgLabel);

    return {
        overall: parseFloat(esgScore),
        environmental: parseFloat(environmentalScore.toFixed(2)),
        social: parseFloat(socialScore.toFixed(2)),
        governance: parseFloat(governanceScore.toFixed(2)),
        label: esgLabel,
        color: esgColor,
    };
};

/**
 * Calculate Impact ROI Metrics
 * Measures impact per dollar invested
 */
const calculateImpactROI = (project, investorFunding) => {
    const totalInvestment = investorFunding?.amount || 1; // Avoid division by zero

    return {
        treesPerDollar: ((project.impacts?.treesPlanted || 0) / totalInvestment).toFixed(2),
        waterPerDollar: ((project.impacts?.waterSaved || 0) / totalInvestment).toFixed(2),
        landPerDollar: ((project.impacts?.landsRestored || 0) / totalInvestment).toFixed(4),
        avgImpactPerDollar: (
            ((project.impacts?.treesPlanted || 0) +
                (project.impacts?.waterSaved || 0) / 100 +
                (project.impacts?.landsRestored || 0) * 10) /
            totalInvestment
        ).toFixed(2),
    };
};

/**
 * Generate unique reference ID for report
 */
const generateReportReferenceID = () => {
    return `ESG-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
};

module.exports = {
    calculateESGScore,
    calculateImpactROI,
    generateReportReferenceID,
};
