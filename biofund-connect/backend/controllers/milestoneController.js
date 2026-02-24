const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get milestones for a project
// @route   GET /api/milestones/:projectId
// @access  Public
const getMilestonesByProject = async (req, res) => {
    try {
        const milestones = await Milestone.find({ projectId: req.params.projectId });
        sendSuccess(res, 200, 'Milestones retrieved', milestones);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Create a milestone
// @route   POST /api/milestones
// @access  Private/NGO
const createMilestone = async (req, res) => {
    try {
        const { projectId, title, description, fundsRequested } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return sendError(res, 404, 'Project not found');

        if (project.createdBy.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized to add milestone to this project');
        }

        const milestone = new Milestone({
            projectId,
            title,
            description,
            fundsReleased: 0,
        });

        const createdMilestone = await milestone.save();
        sendSuccess(res, 201, 'Milestone created', createdMilestone);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Approve/Update milestone
// @route   PUT /api/milestones/:id
// @access  Private/Admin
const updateMilestone = async (req, res) => {
    try {
        const { status, fundsReleased } = req.body;
        const milestone = await Milestone.findById(req.params.id);

        if (milestone) {
            if (status) milestone.status = status;
            if (fundsReleased !== undefined) milestone.fundsReleased = fundsReleased;

            const updatedMilestone = await milestone.save();
            sendSuccess(res, 200, 'Milestone updated', updatedMilestone);
        } else {
            sendError(res, 404, 'Milestone not found');
        }
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    getMilestonesByProject,
    createMilestone,
    updateMilestone,
};
