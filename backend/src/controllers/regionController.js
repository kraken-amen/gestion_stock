const Region = require('../models/Region');

// Create a new region
exports.createRegion = async (req, res) => {
  try {
    const region = await Region.create(req.body);
    res.status(201).json(region);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single region by ID
exports.getRegionById = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(200).json(region);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a region by ID
exports.updateRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(200).json(region);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a region by ID
exports.deleteRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(200).json({ message: 'Region deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};