const { Role, State, City, Category } = require('../models');

async function seedAll() {
  // ✅ Roles
  const roles = [
    { id: 1, role_name: 'Admin', role: 'ADMIN', status: 1, is_disable: 1 },
    { id: 2, role_name: 'Vendor', role: 'VENDOR', status: 1, is_disable: 1 }
  ];

  const roleCount = await Role.count();
  if (roleCount === 0) {
    await Role.bulkCreate(roles);
    console.log('✅ Roles seeded.');
  } else {
    console.log('ℹ️ Roles already exist.');
  }

  // ✅ Categories
  const categories = [
    'Fabric Painting', 'Canvas Painting', 'Mehandi Art', 'Catering',
    'Cook/Chef on call', 'Bakery item', 'Food(Namkeen,Sweets, snacks)',
    'Gift & Packaging', 'Anchor', 'Clothes', 'Jewellery', 'Beauty services/ Home Salon',
    'Music artist', 'Cutlery', 'Cosmetics', 'Dance Tutor/ Choreographer',
    'Yoga Instructor', 'Education Tutor', 'Music teacher', 'Art & Craft Teacher',
    'Nursery & Pottery', 'Art work', 'Babysitter or pet care'
  ];

  const catCount = await Category.count();
  if (catCount === 0) {
    const categoryInsert = categories.map((name, index) => ({
      id: index + 1,
      name
    }));
    await Category.bulkCreate(categoryInsert);
    console.log('✅ Categories seeded.');
  } else {
    console.log('ℹ️ Categories already exist.');
  }

  // ✅ States and Cities
  const stateCityMap = {
    'Andhra Pradesh': ['Kurnool', 'Vijayawada', 'Visakhapatnam'],
    'Assam': ['Assam'],
    'Bihar': ['Bhagalpur', 'Patna'],
    'Chandigarh': ['Chandigarh'],
    'Chhattisgarh': ['Bilaspur', 'Durg', 'Raipur'],
    'Delhi': ['Delhi'],
    'Goa': ['Goa'],
    'Gujarat': ['Ahmedabad', 'Anand', 'Bharuch', 'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Kutch', 'Mehsana', 'Navsari', 'Patan', 'Rajkot', 'Surat', 'Vadodara', 'Valsad'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Kurukshetra', 'Palwal', 'Panipat', 'Rohtak', 'Sirsa', 'Yamuna Nagar'],
    'Himachal Pradesh': ['Himachal Pradesh'],
    'Jammu and Kashmir': ['Jammu and Kashmir'],
    'Ladakh': ['Ladakh'],
    'Jharkhand': ['Dhanbad', 'Ranchi'],
    'Karnataka': ['Bangalore', 'Belgaum', 'Dakshina Kannada', 'Hubli', 'Mangalore', 'Mysore', 'Udupi'],
    'Kerala': ['Alappuzha', 'Kannur', 'Kochi', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
    'Madhya Pradesh': ['Bhopal', 'Burhanpur', 'Guna', 'Gwalior', 'Indore', 'Jabalpur', 'Mandsaur', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Ujjain'],
    'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Dhule', 'Gondia', 'Jalgaon', 'Latur', 'Mumbai', 'Nagpur', 'Nashik', 'Osmanabad', 'Palghar', 'Pune', 'Satara', 'Solapur', 'Thane', 'Wardha'],
    'Odisha': ['Bargarh', 'Bhubaneswar', 'Cuttack', 'Jajpur', 'Khordha', 'Mayurbhanj', 'Puri', 'Rourkela', 'Sambalpur'],
    'Pondicherry': ['Pondichery'],
    'Punjab': ['Amritsar', 'Firozpur', 'Gurdaspur', 'Jalandhar', 'Ludhiana', 'Mohali', 'Patiala'],
    'Rajasthan': ['Ajmer', 'Alwar', 'Bhilwara', 'Bikaner', 'Ganganagar', 'Jaipur', 'Jaisalmer', 'Jodhpur', 'Kota', 'Nagaur', 'Udaipur'],
    'Sikkim': ['Sikkim'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Erode', 'Kanyakumari', 'Madurai', 'Salem', 'Thanjavur', 'Tiruvallur'],
    'Telangana': ['Hyderabad', 'Nizamabad', 'Warangal'],
    'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Amethi', 'Azamgarh', 'Ghaziabad', 'Gorakhpur', 'Hathras', 'Jaunpur', 'Jhansi', 'Kanpur', 'Lucknow', 'Mathura', 'Meerut', 'Muzaffarnagar', 'Noida', 'Sultanpur', 'Unnao', 'Varanasi'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
    'West Bengal': ['Hooghly', 'Howrah', 'Jalpaiguri', 'Kolkata', 'Malda', 'Siliguri']
  };

  const stateCount = await State.count();
  const cityCount = await City.count();

  if (stateCount === 0) {
    const stateInsertData = Object.keys(stateCityMap).map((stateName, index) => ({
      id: index + 1,
      name: stateName
    }));
    await State.bulkCreate(stateInsertData);
    console.log('✅ States seeded.');
  } else {
    console.log('ℹ️ States already exist.');
  }

  if (cityCount === 0) {
    const stateRecords = await State.findAll();
    const stateMap = {};
    for (const state of stateRecords) {
      stateMap[state.name] = state.id;
    }

    const cityInsertData = [];
    for (const [stateName, cities] of Object.entries(stateCityMap)) {
      const stateId = stateMap[stateName];
      if (!stateId) {
        console.warn(`⚠️ State not found: ${stateName}`);
        continue;
      }
      for (const cityName of cities) {
        cityInsertData.push({ name: cityName, state_id: stateId });
      }
    }

    await City.bulkCreate(cityInsertData);
    console.log('✅ Cities seeded.');
  } else {
    console.log('ℹ️ Cities already exist.');
  }

  console.log('✅ All seeding completed.');
}

seedAll()
  .then(() => process.exit())
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });
