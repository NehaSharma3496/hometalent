
const { State, City, User, Category, VendorCategoryRank } = require('../../models'); // adjust path to your models
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../../config/db.config');
exports.listStatesAndCities = async (req, res) => {
  try {
    // Fetch all states along with their cities
    const states = await State.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: City,
        attributes: ['id', 'name'],
        order: [['id', 'ASC']]
      }],
      order: [['id', 'ASC']]
    });

    const result = [];

    // Flatten into required format
    for (const state of states) {
      result.push({
        id: state.id,
        name: state.name,
        type: 'state'
      });

      for (const city of state.Cities) {
        result.push({
          id: city.id,
          name: city.name,
          type: 'city'
        });
      }
    }

    res.json({ status: true, data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getVendorsByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;

    if (!category_id) {
      return res.status(400).json({ status: false, msg: 'category_id is required' });
    }

    // Get sponsored vendors for this specific category (ordered by category-specific sponsor_rank)
    const sponsoredVendors = await User.findAll({
      where: {
        role_id: 2,
        status: 1,
        category_id: {
          [Op.like]: `%${category_id}%`
        }
      },
      include: [{
        model: VendorCategoryRank,
        as: 'categoryRanks',
        where: { 
          category_id: category_id,
          is_sponsored: 1
        },
        required: true,
        attributes: ['sponsor_rank']
      }],
      order: [[{ model: VendorCategoryRank, as: 'categoryRanks' }, 'sponsor_rank', 'ASC']]
    });

    // Get non-sponsored vendors for this category
    const nonSponsoredVendors = await User.findAll({
      where: {
        role_id: 2,
        status: 1,
        category_id: {
          [Op.like]: `%${category_id}%`
        }
      },
      include: [{
        model: VendorCategoryRank,
        as: 'categoryRanks',
        where: { 
          category_id: category_id,
          is_sponsored: 0
        },
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });

    // Shuffle non-sponsored vendors
    const shuffledNonSponsored = nonSponsoredVendors.sort(() => Math.random() - 0.5);

    // Combine sponsored vendors first, then shuffled non-sponsored vendors
    const allVendors = [...sponsoredVendors, ...shuffledNonSponsored];

    // Get all category names for each vendor
    for (const v of allVendors) {
      const ids = (v.category_id || '').split(',').map(id => id.trim());
      const categoryNames = await Category.findAll({
        where: { id: ids },
        attributes: ['id', 'name']
      });
      v.dataValues.category_names = categoryNames.map(c => c.name);
    }

    res.json({ status: true, data: allVendors });
  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};



