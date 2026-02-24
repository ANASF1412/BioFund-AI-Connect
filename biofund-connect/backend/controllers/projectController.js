const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).populate('createdBy', 'name email');
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
            sendSuccess(res, 200, 'Project status updated', updatedProject);
        } else {
            sendError(res, 404, 'Project not found');
        }
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProjectStatus,
};
