const PDFDocument = require('pdfkit');
const Project = require('../models/Project');
const User = require('../models/User');
const Funding = require('../models/Funding');
const Report = require('../models/Report');
const { sendError } = require('../utils/responseHandler');
const { calculateESGScore, calculateImpactROI, generateReportReferenceID } = require('../utils/esgCalculator');

// Industry benchmark ESG score (default average)
const INDUSTRY_BENCHMARK = 65;

// @desc    Generate ESG Report PDF for a project
// @route   GET /api/reports/project/:projectId
// @access  Private/Investor or NGO (investor who funded or NGO who created)
const generateProjectReport = async (req, res) => {
    try {
        const { projectId } = req.params;
        const investorId = req.user._id;

        // Verify project exists
        const project = await Project.findById(projectId).populate('createdBy', 'name email');
        if (!project) {
            return sendError(res, 404, 'Project not found');
        }

        // Verify investor funded this project OR user is the NGO who created it
        const isNGOCreator = project.createdBy._id.toString() === investorId.toString();
        const funding = await Funding.findOne({
            projectId,
            investorId,
        });

        if (!funding && !isNGOCreator) {
            return sendError(res, 403, 'You have not funded this project or are not the project creator');
        }

        // Get investor details
        const investor = await User.findById(investorId);
        if (!investor) {
            return sendError(res, 404, 'Investor not found');
        }

        // Get NGO details
        const ngo = await User.findById(project.createdBy._id);

        // Get all fundings for this project (for stats)
        const allFundings = await Funding.find({ projectId }).countDocuments();

        // Calculate completion percentage
        const fundingPercentage = Math.min(
            (project.currentAmount / project.goalAmount) * 100,
            100
        );

        // ===== CALCULATE ESG SCORES =====
        const esgScore = calculateESGScore(project, allFundings);

        // ===== CALCULATE IMPACT ROI =====
        // For NGO creators, use the total project amount as the impact basis
        const impactBasis = funding || { amount: project.currentAmount };
        const impactROI = calculateImpactROI(project, impactBasis);

        // ===== GENERATE REPORT REFERENCE ID =====
        const referenceId = generateReportReferenceID();

        // Format current date
        const reportDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Create PDF document
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="ESG-Report-${project._id}-${Date.now()}.pdf"`
        );

        // Pipe document to response
        doc.pipe(res);

        // ===== WATERMARK =====
        doc.fontSize(80)
            .fillOpacity(0.08)
            .text('CONFIDENTIAL', {
                align: 'center',
                angle: -45,
                y: 300,
            });

        // Reset opacity
        doc.fillOpacity(1);

        // ===== HEADER =====
        doc.fontSize(24)
            .font('Helvetica-Bold')
            .text('BioFund Connect', { align: 'center' })
            .fontSize(16)
            .font('Helvetica')
            .text('ESG Impact Report', { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(10)
            .text(`Report Generated: ${reportDate}`, { align: 'center' })
            .text(`Reference ID: ${referenceId}`, { align: 'center' })
            .moveDown(1);

        // Horizontal line
        doc.moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .stroke();

        doc.moveDown(1);

        // ===== SECTION 1: ESG SCORE SUMMARY =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('ESG SCORE SUMMARY', { underline: true })
            .moveDown(0.5);

        // Main ESG Score Box
        doc.rect(50, doc.y, 495, 60).stroke();
        doc.fontSize(36)
            .font('Helvetica-Bold')
            .fillColor(esgScore.color)
            .text(esgScore.overall, 70, doc.y + 10);

        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#000000')
            .text(`Overall ESG Score`, 150, doc.y - 26)
            .fontSize(11)
            .text(`Rating: ${esgScore.label}`, 150, doc.y);

        doc.moveDown(4);

        // Sub-scores
        doc.fontSize(11)
            .font('Helvetica-Bold')
            .text('Score Breakdown:', { marginBottom: 8 });

        doc.fontSize(10)
            .font('Helvetica')
            .text(`Environmental Score: ${esgScore.environmental}/100`)
            .text(`Social Score: ${esgScore.social}/100`)
            .text(`Governance Score: ${esgScore.governance}/100`, { marginBottom: 15 });

        // ===== SECTION 2: BENCHMARK COMPARISON =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('BENCHMARK COMPARISON', { underline: true })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Project ESG Score: ${esgScore.overall}`)
            .text(`Industry Benchmark: ${INDUSTRY_BENCHMARK}`);

        const scoreDifference = (esgScore.overall - INDUSTRY_BENCHMARK).toFixed(2);
        const performanceText =
            scoreDifference >= 0
                ? `This project performs ${scoreDifference} points ABOVE industry average`
                : `This project performs ${Math.abs(scoreDifference)} points BELOW industry average`;

        doc.fontSize(10)
            .font('Helvetica')
            .text(performanceText, { marginBottom: 15 });

        // ===== SECTION 3: INVESTOR/CREATOR DETAILS =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text(isNGOCreator ? 'PROJECT CREATOR DETAILS' : 'INVESTOR DETAILS', { underline: true })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Name: ${investor.name}`)
            .text(`Email: ${investor.email}`);
        
        if (funding) {
            doc.text(`Investment Amount: $${funding.amount.toLocaleString()}`)
                .text(
                    `Investment Date: ${new Date(funding.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}`,
                    { marginBottom: 15 }
                );
        } else {
            doc.text(`Role: Project Creator (NGO)`)
                .text(`Total Funds Raised: $${project.currentAmount.toLocaleString()}`, { marginBottom: 15 });
        }

        // ===== SECTION 4: PROJECT DETAILS =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('PROJECT DETAILS', { underline: true })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Project Name: ${project.title}`);

        const locationName = project.location?.name || 'Global';
        doc.text(`Location: ${locationName}`);

        doc.text(`Impact Type: ${project.impactType || 'Conservation'}`);
        doc.text(`Risk Score: ${project.riskScore}/10`);

        const riskLevel =
            project.riskScore <= 3
                ? 'Low Risk'
                : project.riskScore <= 6
                    ? 'Medium Risk'
                    : 'High Risk';
        doc.text(`Risk Level: ${riskLevel}`);

        doc.moveDown(0.5);

        doc.fontSize(10)
            .font('Helvetica')
            .text('Project Description:')
            .font('Helvetica')
            .text(project.description || 'No description available', {
                align: 'left',
                width: 475,
                marginBottom: 15,
            });

        // ===== SECTION 5: IMPACT ROI =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('IMPACT RETURN ON INVESTMENT (ROI)', { underline: true })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Trees Per Dollar: ${impactROI.treesPerDollar}`)
            .text(`Gallons Saved Per Dollar: ${impactROI.waterPerDollar}`)
            .text(`Land (acres) Per Dollar: ${impactROI.landPerDollar}`)
            .text(
                `Average Impact Per Dollar: ${impactROI.avgImpactPerDollar} (combined metric)`,
                { marginBottom: 15 }
            );

        // ===== SECTION 6: NGO PROFILE =====
        if (ngo) {
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('NGO PROFILE', { underline: true })
                .moveDown(0.5);

            doc.fontSize(11)
                .font('Helvetica')
                .text(`Organization: ${ngo.name}`)
                .text(`Email: ${ngo.email}`)
                .text(`Trust Score: ${project.ngoTrustScore || 5}/10`)
                .text(
                    `Projects Created: ${allFundings}`,
                    { marginBottom: 15 }
                );
        }

        // Add page break if needed
        if (doc.y > 650) {
            doc.addPage();
        }

        // ===== SECTION 7: IMPACT METRICS =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('IMPACT METRICS', { underline: true })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Trees Planted: ${(project.impacts?.treesPlanted || 0).toLocaleString()}`)
            .text(`Land Restored: ${(project.impacts?.landsRestored || 0).toLocaleString()} acres`)
            .text(
                `Water Saved: ${(project.impacts?.waterSaved || 0).toLocaleString()} gallons`,
                { marginBottom: 15 }
            );

        // ===== SECTION 8: FUNDING SUMMARY =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('FUNDING SUMMARY', { underline: true })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Goal Amount: $${project.goalAmount.toLocaleString()}`)
            .text(`Current Funding: $${project.currentAmount.toLocaleString()}`)
            .text(`Funding Progress: ${fundingPercentage.toFixed(1)}%`)
            .text(
                `Number of Investors: ${allFundings}`,
                { marginBottom: 15 }
            );

        // Add progress bar representation
        const barWidth = 400;
        const barProgress = (fundingPercentage / 100) * barWidth;

        doc.rect(50, doc.y, barWidth, 15).stroke();
        if (fundingPercentage > 0) {
            doc.rect(50, doc.y, barProgress, 15).fill('#10b981').stroke();
        }

        doc.moveDown(1.5);

        // Add page break if needed
        if (doc.y > 700) {
            doc.addPage();
        }

        // ===== SECTION 9: PROJECT UPDATES =====
        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text('PROJECT TIMELINE', { underline: true })
            .moveDown(0.5);

        // Get project creation as first update
        const updates = [
            {
                date: new Date(project.createdAt),
                description: 'Project created and submitted for approval',
            },
            ...(project.updates || []).slice(0, 5).map((update) => ({
                date: new Date(update.createdAt),
                description: update.message || update.description,
            })),
        ];

        if (updates.length === 0) {
            doc.fontSize(11)
                .font('Helvetica')
                .text('No updates available yet', { marginBottom: 15 });
        } else {
            updates.forEach((update) => {
                const updateDate = update.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                doc.fontSize(10)
                    .font('Helvetica-Bold')
                    .text(`${updateDate}`, { color: '#0369a1' });

                doc.fontSize(10)
                    .font('Helvetica')
                    .text(update.description || 'Update', {
                        align: 'left',
                        width: 450,
                        marginBottom: 10,
                    });
            });
        }

        doc.moveDown(1);

        // ===== FOOTER =====
        doc.fontSize(9)
            .font('Helvetica')
            .text('Generated by BioFund Connect - Empowering Conservation Through Impact Investing', {
                align: 'center',
                color: '#64748b',
            });

        // Add footer line
        doc.moveTo(50, doc.page.height - 40)
            .lineTo(545, doc.page.height - 40)
            .stroke();

        doc.fontSize(8)
            .text(
                `Reference ID: ${referenceId} | Project ID: ${project._id}`,
                50,
                doc.page.height - 35,
                { align: 'center', color: '#94a3b8' }
            );

        // Finalize PDF
        doc.end();

        // ===== SAVE REPORT METADATA =====
        try {
            await Report.create({
                userId: investorId,
                projectId,
                referenceId,
                esgScore: {
                    overall: esgScore.overall,
                    environmental: esgScore.environmental,
                    social: esgScore.social,
                    governance: esgScore.governance,
                    label: esgScore.label,
                },
            });
        } catch (reportError) {
            console.error('Error saving report metadata:', reportError);
            // Don't fail the PDF download if report saving fails
        }
    } catch (error) {
        console.error('Error generating report:', error);
        return sendError(res, 500, 'Failed to generate report');
    }
};

// @desc    Get all reports for logged-in investor
// @route   GET /api/reports
// @access  Private/Investor
const getMyReports = async (req, res) => {
    try {
        const userId = req.user._id;

        const reports = await Report.find({ userId })
            .populate('projectId', 'title category status')
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            data: reports,
            count: reports.length,
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return sendError(res, 500, 'Failed to fetch reports');
    }
};

// @desc    Get ESG score preview for a project
// @route   GET /api/reports/preview/:projectId
// @access  Private/Investor
const getESGScorePreview = async (req, res) => {
    try {
        const { projectId } = req.params;
        const investorId = req.user._id;

        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return sendError(res, 404, 'Project not found');
        }

        // Verify investor funded this project
        const funding = await Funding.findOne({
            projectId,
            investorId,
        });

        if (!funding) {
            return sendError(res, 403, 'You have not funded this project');
        }

        // Get all fundings for this project
        const fundingCount = await Funding.countDocuments({ projectId });

        // Calculate ESG score
        const esgScore = calculateESGScore(project, fundingCount);

        // Calculate Impact ROI
        const impactROI = calculateImpactROI(project, funding);

        return res.status(200).json({
            success: true,
            data: {
                esgScore,
                impactROI,
                benchmark: INDUSTRY_BENCHMARK,
            },
        });
    } catch (error) {
        console.error('Error fetching ESG preview:', error);
        return sendError(res, 500, 'Failed to fetch ESG score preview');
    }
};

module.exports = {
    generateProjectReport,
    getMyReports,
    getESGScorePreview,
};
