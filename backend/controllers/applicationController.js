const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { analyzeResume } = require('../utils/gemini'); 
const { awardXPAndBadges } = require('../utils/gamification');
const { triggerRealtimeNotification } = require('../utils/supabase');

/**
 * @desc    Apply for an opportunity (Internship/Event)
 * @route   POST /api/applications
 * @access  Private (Student only)
 */

const applyForOpportunity = async (req, res) => {
    try {
        const { opportunityId, resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({ message: 'Resume text is required for AI analysis' });
        }

        // Verify if the opportunity exists and is open
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity || opportunity.status !== 'Open') {
            return res.status(404).json({ message: 'Opportunity not found or closed' });
        }

        // Check if student has already applied
        const existingApplication = await Application.findOne({
            studentId: req.user._id,
            opportunityId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this opportunity' });
        }

        // Analyze resume using Gemini
        const { atsScore, feedback } = await analyzeResume(resumeText, opportunity.skillsRequired);
        
        // Create the application card (starts in 'Applied' column)
        const application = await Application.create({
            studentId: req.user._id,
            opportunityId,
            status: 'Applied',
            atsScore: atsScore,  
            aiFeedback: feedback 
        });

        // Award XP for applying (e.g., 10 XP)
        const gamificationUpdate = await awardXPAndBadges(req.user._id, 50);

        res.status(201).json({
            application, 
            gamification: gamificationUpdate
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all applications for a specific opportunity (For Kanban Board)
 * @route   GET /api/applications/opportunity/:opportunityId
 * @access  Private (Organizer only)
 */
const getApplicationsForOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.params;

        // Fetch applications and populate student details
        const applications = await Application.find({ opportunityId })
            .populate('studentId', 'name email') // Get student info for the Kanban cards
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update application status (Kanban Drag & Drop Action)
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Organizer only)
 */
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // Validate if the status is one of the allowed Kanban columns
        const validStatuses = ['Applied', 'In-Review', 'Interview', 'Selected', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update the application
        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('opportunityId', 'title');

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Trigger Supabase Realtime Event here to notify the student instantly
        const channelName = `student-${updatedApplication.studentId}`;
        const payload = {
            applicationId: updatedApplication._id,
            opportunityTitle: updatedApplication.opportunityId.title,
            newStatus: updatedApplication.status,
            message: `Congratulations/Update! Your application for ${updatedApplication.opportunityId.title} is now: ${updatedApplication.status}`
        };

        triggerRealtimeNotification(channelName, 'application_status_changed', payload);

        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    applyForOpportunity, 
    getApplicationsForOpportunity, 
    updateApplicationStatus 
};