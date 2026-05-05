const Settings = require("../models/Settings");
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id }).populate('user', 'email');

    if (!settings) {
      settings = await Settings.create({
        user: req.user._id,
      });
      settings = await settings.populate('user', 'email');
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateSettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};