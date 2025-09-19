
const { State, City, User, Category, VendorCategoryRank, ContactUs, VendorPackageSubscription } = require('../../models'); // adjust path to your models
const { Op, Sequelize, where, fn, col } = require('sequelize');
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

    // Build base where clause
    let whereClause = {
      role_id: 2,
      status: 1
    };

    if (category_id) {
      whereClause[Op.or] = [
        { category_id: category_id },
        { category_id: { [Op.like]: `%,${category_id},%` } },
        { category_id: { [Op.like]: `${category_id},%` } },
        { category_id: { [Op.like]: `%,${category_id}` } }
      ];
    }

    if (city_id) {
      whereClause.city_id = city_id;
    }

    // Active subscription include
    const today = new Date().toISOString().split('T')[0];
    // today.setHours(0, 0, 0, 0); // remove time for comparison

    const subscriptionInclude = {
      model: VendorPackageSubscription,
      as: 'vendor', // must match User.hasMany alias
      required: true,
      where: {
        payment_status: 'completed',
         [Op.and]: [
      where(fn('DATE', col('vendor.start_date')), { [Op.lte]: today }),
      where(fn('DATE', col('vendor.end_date')), { [Op.gte]: today })
    ]
      }
    };

    // Sponsored vendors
    let sponsorRankInclude = {
      model: VendorCategoryRank,
      as: 'categoryRanks',
      required: false, // set false to avoid filtering out vendors
      attributes: ['sponsor_rank'],
      where: { is_sponsored: 1 }
    };
    if (category_id) sponsorRankInclude.where.category_id = category_id;

    const sponsoredVendors = await User.findAll({
      where: whereClause,
      include: [subscriptionInclude, sponsorRankInclude],
      order: [[{ model: VendorCategoryRank, as: 'categoryRanks' }, 'sponsor_rank', 'ASC']],
      distinct: true
    });

    const sponsoredIds = sponsoredVendors.map(v => v.id);

    // Non-sponsored vendors
    let nonSponsorRankInclude = {
      model: VendorCategoryRank,
      as: 'categoryRanks',
      required: false,
      where: { is_sponsored: 0 }
    };
    if (category_id) nonSponsorRankInclude.where.category_id = category_id;

    const nonSponsoredVendors = await User.findAll({
      where: {
        ...whereClause,
        id: { [Op.notIn]: sponsoredIds } // exclude already fetched sponsored
      },
      include: [subscriptionInclude, nonSponsorRankInclude],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    // Shuffle non-sponsored vendors
    const shuffledNonSponsored = nonSponsoredVendors.sort(() => Math.random() - 0.5);

    // Combine sponsored and non-sponsored
    const allVendors = [...sponsoredVendors, ...shuffledNonSponsored];

    // Add category names
    for (const v of allVendors) {
      const ids = (v.category_id || '').split(',').map(id => id.trim());
      const categoryNames = await Category.findAll({
        where: { id: ids },
        attributes: ['id', 'name']
      });

      let names = categoryNames.map(c => c.name);
      names = names.map(name => name === 'Other' ? v.category_name : name);

      v.dataValues.category_names = names;
    }

    return res.json({ status: true, data: allVendors });
  } catch (error) {
    return res.json({ status: false, msg: error.message });
  }
};




