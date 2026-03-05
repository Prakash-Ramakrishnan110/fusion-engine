# EmailJS Setup Guide

## 🚀 Quick Setup for Fusion Engine Contact Form

### 📧 Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a FREE account
3. Verify your email address

### 📧 Step 2: Create Email Service
1. Go to Email Services → Add New Service
2. Choose your email provider (Gmail recommended)
3. Connect your email account: `prakash7418r@gmail.com`
4. Name your service: `fusion-engine-service`

### 📧 Step 3: Create Email Template
1. Go to Email Templates → Create New Template
2. Template Name: `fusion-engine-contact`
3. Template ID will be generated automatically

### 📧 Step 4: Configure Template Content

#### **Subject:**
```
New Contact Form Submission from {{from_name}}
```

#### **Email Content:**
```
Hello Prakash,

You have received a new contact form submission from Fusion Engine website.

**Contact Details:**
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{from_phone}}
- Message: {{message}}

**Time:** {{time}}

**Reply to:** {{from_email}}

Please respond to this inquiry as soon as possible.

---
This email was sent from Fusion Engine Website
Contact: prakash7418r@gmail.com | Phone: +91 6369884331
```

### 📧 Step 5: Get Your Credentials
1. Go to Integration → API Keys
2. Copy your **Public Key**
3. Go to Email Services → Get Service ID
4. Copy your **Service ID**
5. Go to Email Templates → Get Template ID
6. Copy your **Template ID**

### 📧 Step 6: Update Code
Replace the placeholder values in `src/pages/Contact.tsx`:

```typescript
const SERVICE_ID = 'your_actual_service_id';
const TEMPLATE_ID = 'your_actual_template_id';
const PUBLIC_KEY = 'your_actual_public_key';
```

### 🎯 Benefits of EmailJS
- ✅ **No backend required**
- ✅ **Professional email delivery**
- ✅ **Free tier (200 emails/month)**
- ✅ **Direct sending (no email client)**
- ✅ **Custom email templates**
- ✅ **Reliable delivery**

### 📊 Free Plan Limits
- **200 emails per month**
- **Up to 3 email services**
- **Up to 10 templates**
- **Perfect for startup needs**

### 🔧 Testing
1. After setup, test the contact form
2. Check your email: `prakash7418r@gmail.com`
3. Verify all form data is included
4. Test reply functionality

### 🚀 Deployment Ready
Once configured, your contact form will:
- Send professional emails directly
- Include all client details
- Work on all deployments (Vercel, Netlify, etc.)
- No server maintenance required
