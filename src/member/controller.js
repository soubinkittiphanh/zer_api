// Import the Member model
const { Member } = require('../models'); // Adjust this import according to your project structure
const bcryptService = require('../api/bcryptService')
const service = require(`./service`);
const { getLastNChars } = require('../api/common');
const membersController = {
    // Create a new member
    createMember: async (req, res) => {
        try {
            // ********* Check exist user ***********
            const phone8chars = getLastNChars(req.body.tel, 8)
            const dbMember = await service.getUserByTel(phone8chars)
            if (dbMember) return res.status(503).send(`user already existed`)
            const hashedPassword = await bcryptService.hashPassword(req.body.password);
            req.body.password = hashedPassword;
            req.body.tel = phone8chars;
            const member = await Member.create(req.body);
            res.status(201).json(member);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Retrieve all members
    getAllMembers: async (req, res) => {
        try {
            const members = await Member.findAll({include:['accounts']});
            res.status(200).json(members);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Retrieve a single member by id
    getMemberById: async (req, res) => {
        try {
            const member = await Member.findByPk(req.params.id);
            if (!member) {
                res.status(404).json({ error: 'Member not found' });
            } else {
                res.status(200).json(member);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a member
    updateMember: async (req, res) => {
        try {
            const member = await Member.findByPk(req.params.id);
            if (!member) {
                res.status(404).json({ error: 'Member not found' });
            } else {
                const updatedMember = await member.update(req.body);
                res.status(200).json(updatedMember);
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    // Update a member
    resetPassword: async (req, res) => {
        try {
            const tel = getLastNChars(req.params.tel,8)
            const dbMember = await service.getUserByTel(tel)
            const member = await Member.findByPk(dbMember.id);
            if (!member) {
                res.status(404).json({ error: 'Member not found' });
            } else {
                const hashedPassword = await bcryptService.hashPassword(req.body.password);
                req.body.password = hashedPassword;
                const updatedMember = await member.update(req.body);
                res.status(200).json(updatedMember);
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a member
    deleteMember: async (req, res) => {
        try {
            const member = await Member.findByPk(req.params.id);
            if (!member) {
                res.status(404).json({ error: 'Member not found' });
            } else {
                await member.destroy();
                res.status(204).send();
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = membersController;
