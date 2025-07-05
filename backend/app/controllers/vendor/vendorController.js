const { Category, State, City } = require('../../models'); // adjust path as needed
const { commonEmail } = require("../../helper/commonEmail");


exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    res.json({ status: true, data: categories });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listStates = async (req, res) => {
  try {
    const states = await State.findAll({ order: [['id', 'ASC']] });
    res.json({ status: true, data: states });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

exports.listCitiesByState = async (req, res) => {
  try {
    const { state_id } = req.query;
    if (!state_id) {
      return res.status(400).json({ status: false, msg: 'state_id is required' });
    }

    const cities = await City.findAll({
      where: { state_id },
      order: [['id', 'ASC']]
    });

    res.json({ status: true, data: cities });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};
