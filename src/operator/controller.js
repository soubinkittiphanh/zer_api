
const User = require('../models').user;
const Terminal = require('../models').terminal;
const { body, validationResult } = require('express-validator');
const logger = require('../api/logger');
const { Op } = require('sequelize');
const bcryptService = require('../api/bcryptService')
const service = require('./service')
const createCustomer = async (req, res) => {
  try {
    let { cus_id, cus_pass, cus_name, cus_tel, cus_email, cus_active, village, district, province } = req.body;
    const existUser = await service.getUserById(cus_id)
    if (existUser) return res.status(409).json({
      "status": "409 Conflict",
      "message": "A user with this email already exists."
    })

    const hashedPassword = await bcryptService.hashPassword(cus_pass);
    cus_pass = hashedPassword;
    const customer = await User.create({ cus_id, cus_pass, cus_name, cus_tel, cus_email, cus_active, village, district, province });
    res.status(201).json(customer);
  } catch (error) {
    logger.error(`Cannot create user with error ${error}`)
    res.status(400).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      include: [{
        model: Terminal,
        through: { attributes: [] }
      }]
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await User.findByPk(id, {
    });
    if (!customer) {
      return res.status(501).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const { cus_id, cus_pass, cus_name, cus_tel, cus_email, cus_active, village, district, province } = req.body;
    const customer = await User.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    customer.cus_id = cus_id;
    customer.cus_pass = cus_pass;
    customer.cus_name = cus_name;
    customer.cus_tel = cus_tel;
    customer.cus_email = cus_email;
    customer.cus_active = cus_active;
    customer.village = village;
    customer.district = district;
    customer.province = province;
    await customer.save();
  } catch (error) {
    logger.error(`SAVE USER ERROR ${error}`)
    res.status(500).json({ message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await User.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await User.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
};
