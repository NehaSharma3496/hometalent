# Cashfree Payment Gateway Integration Setup

This guide explains how to set up and use the Cashfree payment gateway integration for vendor package subscriptions.

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Cashfree Payment Gateway Configuration
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
NODE_ENV=development  # or production
```

## Getting Cashfree Credentials

1. Sign up at [Cashfree](https://www.cashfree.com/)
2. Go to your dashboard and get your App ID and Secret Key
3. For testing, use the sandbox environment
4. For production, use the live environment

## API Endpoints

### 1. Create Payment Order
```
POST /api/payment/create-order
Content-Type: application/json
Authorization: Bearer <token>

{
  "vendor_id": 123,
  "package_id": 456
}
```

**Response:**
```json
{
  "status": true,
  "msg": "Payment order created successfully",
  "data": {
    "order_id": "HT_1234567890_abc123",
    "subscription_id": 789,
    "payment_url": "https://sandbox.cashfree.com/pg/...",
    "amount": 999.00,
    "package_name": "Premium Package",
    "validity_months": 12
  }
}
```

### 2. Payment Webhook
```
POST /api/payment/webhook
```
This endpoint receives payment status updates from Cashfree.

### 3. Payment Return
```
GET /api/payment/return?order_id=HT_1234567890_abc123
```
This endpoint handles user return from payment gateway.

### 4. Get Payment Status
```
GET /api/payment/status?order_id=HT_1234567890_abc123
Authorization: Bearer <token>
```

### 5. Process Refund
```
POST /api/payment/refund
Authorization: Bearer <token>

{
  "order_id": "HT_1234567890_abc123",
  "refund_amount": 999.00,
  "refund_note": "Customer requested refund"
}
```

## Payment Flow

1. **Vendor selects package** → Calls `/api/vendor/subscribe-package`
2. **Create payment order** → Calls `/api/payment/create-order`
3. **Redirect to payment** → User is redirected to Cashfree payment page
4. **Payment processing** → Cashfree processes the payment
5. **Webhook notification** → Cashfree sends status to `/api/payment/webhook`
6. **Subscription activation** → System updates subscription status
7. **Return to app** → User returns via `/api/payment/return`

## Subscription Statuses

- `pending`: Payment order created, waiting for payment
- `completed`: Payment successful, subscription active
- `failed`: Payment failed
- `refunded`: Payment refunded

## Testing

1. Use Cashfree sandbox credentials for testing
2. Test with small amounts
3. Verify webhook signatures
4. Test all payment scenarios (success, failure, refund)

## Security Features

- Webhook signature verification
- JWT token authentication for protected endpoints
- Input validation and sanitization
- Comprehensive logging of all payment activities

## Error Handling

The system handles various error scenarios:
- Invalid vendor/package
- Duplicate subscriptions
- Payment gateway failures
- Webhook signature mismatches
- Database errors

## Logging

All payment activities are logged in the `logs` table:
- Payment initiation
- Payment completion
- Payment failure
- Refund processing

## Support

For issues with:
- **Cashfree Integration**: Check Cashfree documentation and support
- **Application Logic**: Check application logs and database
- **Webhook Issues**: Verify webhook URL and signature verification 