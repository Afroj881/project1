const Client = require('../models/Client');

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().populate('createdBy', 'name email');
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).populate('createdBy', 'name email');
    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      res.status(404);
      throw new Error('Client not found');
    }
    res.json({ message: 'Client removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
