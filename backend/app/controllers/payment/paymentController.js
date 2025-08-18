const { User, Package, VendorPackageSubscription, Log } = require('../../models');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { request } = require('http');

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || 'TEST107476494fe2ec32e4d43ac8a01694674701';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_62d31f1b655120620456557e2e820219_a9ae8f20';
const CASHFREE_API_ENDPOINT = 'https://sandbox.cashfree.com/pg';

// Generate unique order ID
function generateOrderId() {
  return 'HT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { vendor_id, package_id } = req.body;

    if (!vendor_id || !package_id) {
      return res.status(400).json({
        status: false,
        msg: 'vendor_id and package_id are required'
      });
    }

    // Validate vendor and package
    const vendor = await User.findOne({
      where: { id: vendor_id, role_id: 2 }
    });

    if (!vendor) {
      return res.status(404).json({
        status: false,
        msg: 'Vendor not found'
      });
    }

    const pkg = await Package.findOne({
      where: { id: package_id, status: 1 }
    });

    if (!pkg) {
      return res.status(404).json({
        status: false,
        msg: 'Package not found or inactive'
      });
    }

    // Check if vendor already has an active subscription
    const now = new Date();
    const activeSubscription = await VendorPackageSubscription.findOne({
      where: {
        vendor_id,
        payment_status: 'completed',
        end_date: { [Op.gte]: now }
      }
    });

    // if (activeSubscription) {
    //   return res.status(400).json({
    //     status: false,
    //     msg: 'Vendor already has an active subscription'
    //   });
    // }
     let startDate, endDate;
    const validityDays = pkg.validity_in_months * 30;
    if (activeSubscription) {
      startDate = new Date(activeSubscription.end_date);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate = now;
    }
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validityDays - 1);
    // Generate order ID
    const orderId = generateOrderId();

    // Create pending subscription record
    const subscription = await VendorPackageSubscription.create({
      vendor_id,
      package_id,
      amount: pkg.price.toString(),
      start_date: startDate,
      end_date: endDate,
      payment_status: 'pending',
      payment_reference: orderId
    });

    // Prepare payment data for Cashfree
    // const paymentData = {
    //   order_id: orderId,
    //   order_amount: pkg.price,
    //   order_currency: 'INR',
    //   customer_details: {
    //     customer_id: vendor.id.toString(),
    //     customer_name: vendor.owner_name || vendor.profile_name,
    //     customer_email: vendor.email,
    //     customer_phone: vendor.phone
    //   },
    //   order_meta: {
    //     return_url: `${req.protocol}://${req.get('host')}/payment/return?order_id=${orderId}`,
    //     notify_url: `${req.protocol}://${req.get('host')}/payment/webhook`
    //   }
    // };

    const paymentData = {
      link_id: orderId,
      link_amount: pkg.price,
      link_currency: 'INR',
      link_purpose: "Vendor Subscription",
      customer_details: {
        customer_id: vendor.id.toString(),
        customer_name: vendor.owner_name || vendor.profile_name,
        customer_email: vendor.email,
        customer_phone: vendor.phone
      },
      link_meta: {
        // return_url: `${req.protocol}://${req.get('host')}/payment/return?order_id=${orderId}`,
        return_url: `http://localhost:3000/vendor/payment-callback?order_id=${orderId}`,
        notify_url: `${req.protocol}://${req.get('host')}/payment/webhook`
      }
    };

    // Create payment session with Cashfree
    const cashfreeResponse = await fetch(`${CASHFREE_API_ENDPOINT}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(paymentData)
    });

    if (!cashfreeResponse.ok) {
      const errorText = await cashfreeResponse.text();
      console.error('Cashfree API error:', errorText);
      throw new Error('Failed to create payment order with Cashfree');
    }

    const cashfreeData = await cashfreeResponse.json();
    
    if (cashfreeData.link_url) {
      console.log('Cashfree provided payment_url:', cashfreeData.link_url);
      paymentUrl = cashfreeData.link_url;
    }

    // Log the payment initiation
    await Log.create({
      request_id: orderId,
      user_id: vendor_id,
      package_id: package_id,
      user_type: 'vendor',
      action: 'payment_initiated',
      details: `Payment order created: ${orderId}`
    });

    return res.json({
      status: true,
      msg: 'Payment order created successfully',
      data: {
        order_id: orderId,
        cf_order_id: cashfreeData.cf_link_id,
        subscription_id: subscription.id,
        payment_url: paymentUrl,
        amount: pkg.price,
        package_name: pkg.name,
        validity_months: pkg.validity_in_months
      }
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      status: false,
      msg: error.message
    });
  }
};

// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { vendor_id, package_id } = req.body;

//     if (!vendor_id || !package_id) {
//       return res.status(400).json({
//         status: false,
//         msg: 'vendor_id and package_id are required'
//       });
//     }

//     // ✅ Validate vendor
//     const vendor = await User.findOne({
//       where: { id: vendor_id, role_id: 2 }
//     });

//     if (!vendor) {
//       return res.status(404).json({
//         status: false,
//         msg: 'Vendor not found'
//       });
//     }

//     // ✅ Validate package
//     const pkg = await Package.findOne({
//       where: { id: package_id, status: 1 }
//     });

//     if (!pkg) {
//       return res.status(404).json({
//         status: false,
//         msg: 'Package not found or inactive'
//       });
//     }

//     // ✅ Check if vendor already has an active subscription
//     const now = new Date();
//     const activeSubscription = await VendorPackageSubscription.findOne({
//       where: {
//         vendor_id,
//         payment_status: 'completed',
//         end_date: { [Op.gte]: now }
//       }
//     });

//     if (activeSubscription) {
//       return res.status(400).json({
//         status: false,
//         msg: 'Vendor already has an active subscription'
//       });
//     }

//     // ✅ Generate order ID
//     const orderId = generateOrderId();

//     // ✅ Create pending subscription record
//     const subscription = await VendorPackageSubscription.create({
//       vendor_id,
//       package_id,
//       amount: pkg.price.toString(),
//       start_date: now,
//       end_date: new Date(now.getTime() + (pkg.validity_in_months * 30 * 24 * 60 * 60 * 1000)),
//       payment_status: 'pending',
//       payment_reference: orderId
//     });

//     // ✅ Prepare payment data for Cashfree
//     const paymentData = {
//       order_id: orderId,
//       order_amount: pkg.price,
//       order_currency: 'INR',
//       customer_details: {
//         customer_id: vendor.id.toString(),
//         customer_name: vendor.owner_name || vendor.profile_name,
//         customer_email: vendor.email,
//         customer_phone: vendor.phone
//       },
//       order_meta: {
//         return_url: `${req.protocol}://${req.get('host')}/payment/return?order_id=${orderId}`,
//         notify_url: `${req.protocol}://${req.get('host')}/payment/webhook`
//       }
//     };

//     // ✅ Create payment session with Cashfree
//     const cashfreeResponse = await fetch(`${CASHFREE_API_ENDPOINT}/orders`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-client-id': CASHFREE_APP_ID,
//         'x-client-secret': CASHFREE_SECRET_KEY,
//         'x-api-version': '2023-08-01'
//       },
//       body: JSON.stringify(paymentData)
//     });

//     if (!cashfreeResponse.ok) {
//       const errorText = await cashfreeResponse.text();
//       console.error('Cashfree API error:', errorText);
//       throw new Error('Failed to create payment order with Cashfree');
//     }

//     const cashfreeData = await cashfreeResponse.json();

//     // ✅ Clean payment_session_id if corrupted
//     let cleanPaymentSessionId = cashfreeData.payment_session_id;
//     if (cleanPaymentSessionId && cleanPaymentSessionId.includes("paymentpayment")) {
//       cleanPaymentSessionId = cleanPaymentSessionId.split("paymentpayment")[0];
//     }

//     // ✅ Log payment initiation
//     await Log.create({
//       user_id: vendor_id,
//       package_id: package_id,
//       user_type: 'vendor',
//       action: 'payment_initiated',
//       details: `Payment order created: ${orderId}`
//     });

//     // ✅ Return session_id (frontend will use SDK)
//     return res.json({
//       status: true,
//       msg: 'Payment order created successfully',
//       data: {
//         order_id: orderId,
//         cf_order_id: cashfreeData.cf_order_id,
//         subscription_id: subscription.id,
//         payment_session_id: cleanPaymentSessionId,  // 🔑 frontend uses this
//         amount: pkg.price,
//         package_name: pkg.name,
//         validity_months: pkg.validity_in_months
//       }
//     });

//   } catch (error) {
//     console.error('Error creating payment order:', error);
//     return res.status(500).json({
//       status: false,
//       msg: error.message
//     });
//   }
// };



// Payment webhook handler
exports.paymentWebhook = async (req, res) => {
  console.log('Received payment webhook:', req.body);
  
  try {
    const { order_id, order_amount, reference_id, tx_status, tx_time, tx_msg, signature } = req.body;

    // Verify webhook signature
    const computedSignature = crypto
      .createHmac('sha256', CASHFREE_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== computedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    // Find subscription by order ID
    const subscription = await VendorPackageSubscription.findOne({
      where: { payment_reference: order_id }
    });

    if (!subscription) {
      console.error('Subscription not found for order:', order_id);
      return res.status(404).send('Subscription not found');
    }

    // Update subscription based on payment status
    if (tx_status === 'SUCCESS') {
      subscription.payment_status = 'completed';
      subscription.payment_reference = reference_id;
      
      // Log successful payment
      await Log.create({
        user_id: subscription.vendor_id,
        package_id: subscription.package_id,
        user_type: 'vendor',
        action: 'payment_completed',
        details: `Payment successful: ${reference_id}, Amount: ${order_amount}`
      });

    } else if (tx_status === 'FAILED') {
      subscription.payment_status = 'failed';
      
      // Log failed payment
      await Log.create({
        user_id: subscription.vendor_id,
        package_id: subscription.package_id,
        user_type: 'vendor',
        action: 'payment_failed',
        details: `Payment failed: ${tx_msg}`
      });
    }

    await subscription.save();

    return res.status(200).send('OK');

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Internal server error');
  }
};

// Payment return handler
exports.paymentReturn = async (req, res) => {
  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.status(400).json({
        status: false,
        msg: 'order_id is required'
      });
    }

    // Find subscription
    const subscription = await VendorPackageSubscription.findOne({
      where: { payment_reference: order_id },
      include: [
        { model: User, as: 'vendor', attributes: ['id', 'owner_name', 'profile_name', 'email'] },
        { model: Package, as: 'Package', attributes: ['id', 'name', 'price', 'validity_in_months'] }
      ]
    });

    if (!subscription) {
      return res.status(404).json({
        status: false,
        msg: 'Subscription not found'
      });
    }

    return res.json({
      status: true,
      data: {
        subscription_id: subscription.id,
        payment_status: subscription.payment_status,
        order_id: order_id,
        vendor: subscription.vendor,
        package: subscription.Package,
        start_date: subscription.start_date,
        end_date: subscription.end_date
      }
    });

  } catch (error) {
    console.error('Error in payment return:', error);
    res.status(500).json({
      status: false,
      msg: error.message
    });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { order_id, user_id} = req.query;
    if (!order_id) {
      return res.status(400).json({
        status: false,
        msg: 'order_id is required'
      });
    }

    // Query Cashfree for payment status
    // const cashfreeResponse = await fetch(`${CASHFREE_API_ENDPOINT}/orders/${order_id}`, {
    const cashfreeResponse = await fetch(`${CASHFREE_API_ENDPOINT}/links/${order_id}/orders`, {
      method: 'GET',
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      }
    });

    // if (!cashfreeResponse.ok) {
    //   throw new Error('Failed to fetch payment status from Cashfree');
    // }

    const paymentData = await cashfreeResponse.json();
    
    const packgeid = await VendorPackageSubscription.findOne({
      attributes: ['package_id'],
      where: { payment_reference: order_id }  
    });

 
    VendorPackageSubscription.update({
      payment_status: paymentData[0]?.order_status == 'PAID' ? 'completed' : 'failed',
      payment_reference: paymentData[0]?.reference_id
    }, {
      where: { payment_reference: order_id }
    });
    // Log payment status check
    await Log.create({
      request_id: order_id,
      user_id: user_id,
      package_id: packgeid.package_id,
      user_type: 'vendor',
      action: 'payment_status_checked',
      details: `Payment status checked for order: ${order_id}, Status: ${paymentData[0]?.order_status}`
    });
    
    // if (!paymentData || !paymentData.order_status) {
    //   return res.status(404).json({
    //     status: false,
    //     data: null,
    //     msg: 'Payment data not found'
    //   });
    // }

    return res.json({
      status: true,
      data: paymentData,
      msg: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
   return res.json({
      status: false,
      msg: error.message
    });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { order_id, refund_amount, refund_note } = req.body;

    if (!order_id || !refund_amount) {
      return res.status(400).json({
        status: false,
        msg: 'order_id and refund_amount are required'
      });
    }

    // Create refund with Cashfree
    const refundData = {
      refund_amount: refund_amount,
      refund_note: refund_note || 'Refund processed'
    };

    const cashfreeResponse = await fetch(`${CASHFREE_API_ENDPOINT}/orders/${order_id}/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(refundData)
    });

    if (!cashfreeResponse.ok) {
      throw new Error('Failed to process refund with Cashfree');
    }

    const refundResult = await cashfreeResponse.json();

    // Update subscription status
    const subscription = await VendorPackageSubscription.findOne({
      where: { payment_reference: order_id }
    });

    if (subscription) {
      subscription.payment_status = 'refunded';
      await subscription.save();

      // Log refund
      await Log.create({
        user_id: subscription.vendor_id,
        package_id: subscription.package_id,
        user_type: 'vendor',
        action: 'payment_refunded',
        details: `Refund processed: ${refundResult.refund_id}, Amount: ${refund_amount}`
      });
    }

    res.json({
      status: true,
      msg: 'Refund processed successfully',
      data: refundResult
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      status: false,
      msg: error.message
    });
  }
}; 