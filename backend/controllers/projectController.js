const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const notificationController = require('./notificationController');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const { location, category, impactType, minFunding, maxFunding, search } = req.query;
        let filters = {};

        // Search by title or description
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by location name
        if (location) {
            filters['location.name'] = { $regex: location, $options: 'i' };
        }

        // Filter by impact type (impactType field)
        if (impactType) {
            filters.impactType = impactType;
        }

        // Filter by category (for backward compatibility)
        if (category && !impactType) {
            filters.category = category;
        }

        // Filter by funding range
        if (minFunding || maxFunding) {
            filters.$expr = filters.$expr || {};
        }

        if (minFunding) {
            filters.currentAmount = { $gte: parseFloat(minFunding) };
        }

        if (maxFunding) {
            filters.goalAmount = { $lte: parseFloat(maxFunding) };
        }

        const projects = await Project.find(filters).populate('createdBy', 'name email');
        sendSuccess(res, 200, 'Projects retrieved', projects);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
        if (project) {
            sendSuccess(res, 200, 'Project retrieved', project);
        } else {
            sendError(res, 404, 'Project not found');
        }
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/NGO
const createProject = async (req, res) => {
    try {
        const { title, description, location, goalAmount } = req.body;

        const project = new Project({
            title,
            description,
            location,
            goalAmount,
            createdBy: req.user._id,
        });

        const createdProject = await project.save();
        sendSuccess(res, 201, 'Project created', createdProject);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private/Admin
const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const project = await Project.findById(req.params.id);

        if (project) {
            project.status = status;
            const updatedProject = await project.save();

            // Create notification for NGO when status changes to Approved
            if (status === 'Approved') {
                try {
                    await notificationController.createNotification(
                        project.createdBy,
                        'PROJECT_UPDATE',
                        `Your project "${project.title}" has been approved and is now live!`,
                        `/ngo/projects/${project._id}`,
                        project._id,
                        null
                    );
                } catch (notifError) {
                    console.error('Error creating approval notification:', notifError);
                }
            }

            sendSuccess(res, 200, 'Project status updated', updatedProject);
        } else {
            sendError(res, 404, 'Project not found');
        }
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Post an update for a project (notify all investors)
// @route   POST /api/projects/:id/update
// @access  Private/NGO
const postProjectUpdate = async (req, res) => {
    try {
        const { message } = req.body;
        const projectId = req.params.id;

        if (!message || message.trim() === '') {
            return sendError(res, 400, 'Update message is required');
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return sendError(res, 404, 'Project not found');
        }

        // Verify that the user is the project creator
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'You can only update your own projects');
        }

        // Create update notification for all investors who funded this project
        const Funding = require('../models/Funding');
        const investors = await Funding.find({ projectId }).distinct('investorId');

        for (const investorId of investors) {
            try {
                await notificationController.createNotification(
                    investorId,
                    'PROJECT_UPDATE',
                    `New update from "${project.title}": ${message}`,
                    `/investor/project/${projectId}`,
                    projectId,
                    req.user._id
                );
            } catch (notifError) {
                console.error('Error creating update notification:', notifError);
            }
        }

        sendSuccess(res, 200, 'Project update posted and notifications sent', {
            message,
            notifiedInvestors: investors.length,
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProjectStatus,
    postProjectUpdate,
};
