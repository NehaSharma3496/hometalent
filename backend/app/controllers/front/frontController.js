
const { State, City, User, Category, VendorCategoryRank, ContactUs, VendorPackageSubscription } = require('../../models'); // adjust path to your models
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
    const { city_id } = req.query;

    if (!category_id && !city_id) {
      return res.status(400).json({ status: false, msg: 'At least category_id or city_id is required' });
    }

    // Build where clause
    let whereClause = {
      role_id: 2,
      status: 1
    };
    if (category_id) {
      whereClause.category_id = { [Op.like]: `%${category_id}%` };
    }
    if (city_id) {
      whereClause.city_id = city_id;
    }

    // Subscription filter: only vendors with an active subscription
    const now = new Date();
    const subscriptionInclude = {
      model: VendorPackageSubscription,
      as: 'subscriptions',
      where: {
        payment_status: 'completed',
        start_date: { [Op.lte]: now },
        end_date: { [Op.gte]: now }
      },
      required: true
    };

    // Get sponsored vendors for this specific category/city (ordered by category-specific sponsor_rank)
    let sponsoredWhere = { ...whereClause };
    let sponsorRankInclude = {
      model: VendorCategoryRank,
      as: 'categoryRanks',
      where: { is_sponsored: 1 },
      required: true,
      attributes: ['sponsor_rank']
    };
    if (category_id) sponsorRankInclude.where.category_id = category_id;

    const sponsoredVendors = await User.findAll({
      where: sponsoredWhere,
      include: [sponsorRankInclude, subscriptionInclude],
      order: [[{ model: VendorCategoryRank, as: 'categoryRanks' }, 'sponsor_rank', 'ASC']]
    });

    // Get non-sponsored vendors for this filter
    let nonSponsorRankInclude = {
      model: VendorCategoryRank,
      as: 'categoryRanks',
      where: { is_sponsored: 0 },
      required: false
    };
    if (category_id) nonSponsorRankInclude.where.category_id = category_id;

    const nonSponsoredVendors = await User.findAll({
      where: whereClause,
      include: [nonSponsorRankInclude, subscriptionInclude],
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



