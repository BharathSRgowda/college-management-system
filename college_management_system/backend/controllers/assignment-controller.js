const Assignment = require('../models/assignmentSchema.js');

// Create a new assignment
const assignmentCreate = async (req, res) => {
    try {
        const assignment = new Assignment({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            subject: req.body.subjectId,
            sclassName: req.body.sclassId,
            college: req.body.adminID,
            createdBy: req.body.createdBy || 'Admin'
        });
        const result = await assignment.save();
        const populated = await Assignment.findById(result._id)
            .populate('subject', 'subName subCode')
            .populate('sclassName', 'sclassName');
        res.send(populated);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all assignments for a college
const assignmentList = async (req, res) => {
    try {
        const assignments = await Assignment.find({ college: req.params.id })
            .populate('subject', 'subName subCode')
            .populate('sclassName', 'sclassName')
            .sort({ createdAt: -1 });
        if (assignments.length > 0) {
            res.send(assignments);
        } else {
            res.send({ message: "No assignments found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get assignments for a specific class
const assignmentListByClass = async (req, res) => {
    try {
        const assignments = await Assignment.find({ sclassName: req.params.id })
            .populate('subject', 'subName subCode')
            .populate('sclassName', 'sclassName')
            .sort({ createdAt: -1 });
        if (assignments.length > 0) {
            res.send(assignments);
        } else {
            res.send({ message: "No assignments found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete a single assignment
const deleteAssignment = async (req, res) => {
    try {
        const result = await Assignment.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete all assignments for a college
const deleteAssignments = async (req, res) => {
    try {
        const result = await Assignment.deleteMany({ college: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No assignments found to delete" });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    assignmentCreate,
    assignmentList,
    assignmentListByClass,
    deleteAssignment,
    deleteAssignments
};
