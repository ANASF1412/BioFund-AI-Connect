const Funding = require('../models/Funding');
const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const notificationController = require('./notificationController');

// @desc    Create a funding record
// @route   POST /api/funding
// @access  Private/Investor
const createFunding = async (req, res) => {
    try {
        const { projectId, amount } = req.body;
        const investorId = req.user._id;

        // Validate amount
        if (!amount || amount <= 0) {
            return sendError(res, 400, 'Amount must be greater than 0');
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return sendError(res, 404, 'Project not found');
        }

        // Create funding record
        const funding = new Funding({
            investorId,
            projectId,
            amount,
        });

        await funding.save();

        // Update project funding and count
        project.currentAmount += amount;
        project.fundingCount += 1;
        await project.save();

        // Create notifications
        try {
            // Notify investor (confirmation)
            await notificationController.createNotification(
                investorId,
                'FUNDING',
                `You have successfully funded "${project.title}" with $${amount}`,
                `/investor/project/${projectId}`,
                projectId,
                null
            );

            // Notify NGO (new funding received)
            await notificationController.createNotification(
                project.createdBy,
                'FUNDING',
                `New funding received! ${req.user.name} invested $${amount} in "${project.title}"`,
                `/ngo/projects/${projectId}`,
                projectId,
                investorId
            );
        } catch (notifError) {
            console.error('Error creating notifications:', notifError);
            // Don't fail the request if notifications fail
        }

        // Populate and return the updated project
        const updatedProject = await Project.findById(projectId).populate('createdBy', 'name email');
        sendSuccess(res, 201, 'Funding created successfully', {
            funding,
            project: updatedProject,
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Get investor's funding history
// @route   GET /api/funding/my-investments
// @access  Private/Investor
const getMyInvestments = async (req, res) => {
    try {
        const investorId = req.user._id;

        // Get all funding records for this investor
        const fundingRecords = await Funding.find({ investorId })
            .populate({
                path: 'projectId',
                populate: {
                    path: 'createdBy',
                    select: 'name email',
                },
            })
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalInvested = fundingRecords.reduce((sum, f) => sum + f.amount, 0);
        const projectsSupported = new Set(fundingRecords.map(f => f.projectId._id.toString())).size;

        sendSuccess(res, 200, 'Investments retrieved', {
            investments: fundingRecords,
            stats: {
                totalInvested,
                projectsSupported,
                fundingCount: fundingRecords.length,
            },
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// @desc    Get all fundings for a project
// @route   GET /api/funding/project/:projectId
// @access  Public
const getProjectFundings = async (req, res) => {
    try {
        const { projectId } = req.params;

        const fundings = await Funding.find({ projectId })
            .populate('investorId', 'name email')
            .sort({ createdAt: -1 });

        sendSuccess(res, 200, 'Project fundings retrieved', fundings);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {
    createFunding,
    getMyInvestments,
    getProjectFundings,
};
