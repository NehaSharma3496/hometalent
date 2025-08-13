-- Update vendor_package_subscriptions table for Cashfree payment integration

-- First, backup existing data (if any)
CREATE TABLE IF NOT EXISTS vendor_package_subscriptions_backup AS 
SELECT * FROM vendor_package_subscriptions;

-- Update amount field to DECIMAL
ALTER TABLE vendor_package_subscriptions 
MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT 'Package subscription amount in INR';

-- Update payment_status to ENUM
ALTER TABLE vendor_package_subscriptions 
MODIFY COLUMN payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending' 
COMMENT 'Payment status of the subscription';

-- Add new fields for payment tracking
ALTER TABLE vendor_package_subscriptions 
ADD COLUMN transaction_id VARCHAR(255) NULL COMMENT 'Cashfree transaction ID after successful payment' AFTER payment_reference,
ADD COLUMN payment_method VARCHAR(100) NULL COMMENT 'Payment method used (UPI, Card, Net Banking, etc.)' AFTER transaction_id,
ADD COLUMN refund_amount DECIMAL(10,2) NULL COMMENT 'Amount refunded if applicable' AFTER payment_method,
ADD COLUMN refund_reference VARCHAR(255) NULL COMMENT 'Cashfree refund ID' AFTER refund_amount,
ADD COLUMN refund_note TEXT NULL COMMENT 'Reason for refund' AFTER refund_reference;

-- Add indexes for better performance
CREATE INDEX idx_vendor_package_subscriptions_vendor_status ON vendor_package_subscriptions(vendor_id, payment_status);
CREATE INDEX idx_vendor_package_subscriptions_payment_ref ON vendor_package_subscriptions(payment_reference);
CREATE INDEX idx_vendor_package_subscriptions_end_date ON vendor_package_subscriptions(end_date);

-- Update existing records to set amount if it's NULL
UPDATE vendor_package_subscriptions 
SET amount = 0.00 
WHERE amount IS NULL;

-- Update existing records to set payment_status if it's NULL
UPDATE vendor_package_subscriptions 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Verify the changes
DESCRIBE vendor_package_subscriptions; 