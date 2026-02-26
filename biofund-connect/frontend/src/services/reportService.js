import api from './api';

const reportService = {
    /**
     * Get all reports for current investor
     */
    getMyReports: async () => {
        try {
            const response = await api.get('/reports');
            return response.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw error;
        }
    },

    /**
     * Get ESG score preview for a project
     */
    getESGScorePreview: async (projectId) => {
        try {
            const response = await api.get(`/reports/preview/${projectId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ESG preview:', error);
            throw error;
        }
    },

    /**
     * Download ESG Report PDF for a project
     * Only available for investors who funded the project
     */
    downloadProjectReport: async (projectId) => {
        try {
            const response = await api.get(`/reports/project/${projectId}`, {
                responseType: 'blob',
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ESG-Report-${projectId}-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            console.error('Error downloading report:', error);
            throw error;
        }
    },
};

export default reportService;
