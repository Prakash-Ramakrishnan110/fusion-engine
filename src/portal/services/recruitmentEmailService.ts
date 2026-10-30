import emailjs from '@emailjs/browser';
import { JobApplication } from '../types';

export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_vtbrgi5',
  TEMPLATE_ID: 'template_p8i38d6', // Active verified template in EmailJS
  FALLBACK_TEMPLATE_ID: 'jbuc3li',
  PUBLIC_KEY: 'QNzyFmRohhj8Soht0',
  COMPANY_NAME: 'Fusion Engine Technology',
  COMPANY_EMAIL: 'fusionenginetechnology@gmail.com',
  PORTAL_URL: 'https://www.fusionengine.in',
};

export interface CandidateEmailPayload {
  toEmail: string;
  toName: string;
  roleTitle: string;
  referenceCode: string;
  status: 'Applied' | 'Shortlisted' | 'Signed' | 'Hired' | 'Rejected' | 'Under Review' | string;
  subject: string;
  body: string;
}

/**
 * Returns default email subject and body template tailored to each recruitment lifecycle stage
 */
export function getCandidateEmailTemplate(
  candidate: Pick<JobApplication, 'fullName' | 'roleTitle' | 'referenceCode'> & {
    email?: string;
    department?: string;
    agreementSignedAt?: string;
    agreementSignature?: string;
  },
  status: 'Applied' | 'Shortlisted' | 'Signed' | 'Hired' | 'Rejected' | 'Under Review' | string,
  credentials?: {
    userId: string;
    temporaryPassword: string;
    role?: 'developer' | 'telecaller' | 'admin';
    loginUrl?: string;
  }
): { subject: string; body: string } {
  const name = candidate.fullName || 'Candidate';
  const role = candidate.roleTitle || 'Open Position';
  const ref = candidate.referenceCode || 'FET-APP';

  switch (status) {
    case 'Applied': {
      return {
        subject: `Application Confirmed: ${role} — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

Thank you for applying for the ${role} position at ${EMAIL_CONFIG.COMPANY_NAME}!

We have successfully received your candidate application and portfolio.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 YOUR APPLICATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Candidate Name:    ${name}
• Position Applied:  ${role}
• Application Ref:   ${ref}
• Submission Date:   ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
• Status:            Under Technical & Leadership Review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Technical Screening: Our engineering & recruitment review team is evaluating your qualifications.
2. Shortlisting & Agreement: If your profile matches our active project deliverables, you will receive an invitation to review and digitally sign your Freelancer Service Agreement.
3. Review Timeline: We aim to update applicants within 24 to 48 business hours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT: CHECK YOUR INBOX & SPAM FOLDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please check your primary Inbox and Spam / Junk / Promotions folders for future communications from ${EMAIL_CONFIG.COMPANY_EMAIL}.
Please click "Report as Not Spam" or add our email to your contacts so you do not miss your shortlisting and agreement signing link!

Warm regards,
Talent Acquisition & Executive Team
${EMAIL_CONFIG.COMPANY_NAME}
🌐 https://www.fusionengine.in
✉️ ${EMAIL_CONFIG.COMPANY_EMAIL}`.trim(),
      };
    }

    case 'Shortlisted': {
      const agreementLink = `${EMAIL_CONFIG.PORTAL_URL}/agreement?ref=${ref}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(candidate.email || '')}`;
      return {
        subject: `Congratulations! Shortlisted for ${role} — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

We are pleased to inform you that your application (Ref: ${ref}) for ${role} has been SHORTLISTED by our technical review team at ${EMAIL_CONFIG.COMPANY_NAME}!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 FREELANCER ONBOARDING & SERVICE AGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
As part of our standard professional onboarding process pursuant to Section 10A of the Indian Information Technology Act, 2000, please review and digitally sign your Freelancer Service Agreement using your personalized secure link:

🔗 REVIEW & SIGN YOUR AGREEMENT:
${agreementLink}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 SUMMARY OF AGREED ENGAGEMENT TERMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Position:          ${role}
• Engagement Model:  Independent Freelancer / Deliverable-Based
• Developer Pay:     Sprint & milestone compensation upon deliverable verification
• Telecaller Pay:    ₹150 per verified client conversion
• IP Protection:     Perpetual assignment of deliverables to Fusion Engine Technology
• Notice Period:     7 days written notice by either party

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NEXT STEPS TO ACTIVATE YOUR WORKSPACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Click the agreement link above on your phone or computer.
2. Carefully review the terms and type your legal full name to sign.
3. Once signed, our administration team will review your countersignature and generate your Workforce Portal login credentials.

⚠️ SPAM NOTICE: If you ever miss an update, please check your Spam/Junk folder and mark our emails as "Not Spam".

Warm regards,
Talent Acquisition & Executive Team
${EMAIL_CONFIG.COMPANY_NAME}
🌐 https://www.fusionengine.in
✉️ ${EMAIL_CONFIG.COMPANY_EMAIL}`.trim(),
      };
    }

    case 'Signed': {
      return {
        subject: `Agreement Certified & Recorded — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

This email certifies that your Freelancer Onboarding & Service Agreement has been DIGITALLY SIGNED AND RECORDED under Application Reference ${ref}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📜 ELECTRONIC EXECUTION CERTIFICATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Candidate Signature: ${candidate.agreementSignature || name}
• Application Ref:     ${ref}
• Role:                ${role}
• Signed Timestamp:    ${candidate.agreementSignedAt ? new Date(candidate.agreementSignedAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
• Statutory Standard:  Section 10A, Indian Information Technology Act, 2000

A permanent statutory record has been archived in our Document Vault. Our leadership team is now preparing your Workforce Portal workspace and login credentials.

You will receive an email shortly with your login User ID and temporary password.

Warm regards,
Executive Administration Team
${EMAIL_CONFIG.COMPANY_NAME}
🌐 https://www.fusionengine.in
✉️ ${EMAIL_CONFIG.COMPANY_EMAIL}`.trim(),
      };
    }

    case 'Hired': {
      const loginUrl = credentials?.loginUrl || 'https://www.fusionengine.in/portal/login';
      const userId = credentials?.userId || candidate.email?.split('@')[0] || 'your-user-id';
      const tempPass = credentials?.temporaryPassword || 'Welcome@2026!';
      const assignedRole = credentials?.role || (candidate.department === 'sales' ? 'telecaller' : 'developer');

      const deptName =
        assignedRole === 'telecaller'
          ? 'Inside Sales & CRM Pipeline'
          : assignedRole === 'admin'
          ? 'Executive Leadership & Administration'
          : 'Engineering & Deliverables';

      const roleWorkspaceDetail =
        assignedRole === 'telecaller'
          ? '• Inside Sales CRM: Access calling scripts, assigned merchants, lead activities, and commission ledger.'
          : assignedRole === 'admin'
          ? '• Executive ERP: Access full oversight, workforce records, client billing, and review gates.'
          : '• Engineering Workspace: Access your project sprint board, tasks queue, code submission review gates, and deliverable specs.';

      return {
        subject: `Welcome to the Team! Workspace Login Credentials — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

Congratulations and welcome to ${EMAIL_CONFIG.COMPANY_NAME}! Following the execution of your Freelancer Service Agreement, we are delighted to officially onboard you as a ${role}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 YOUR WORKSPACE LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Portal URL:         ${loginUrl}
• User ID:            ${userId}
• Registered Email:   ${candidate.email || 'Your registered email'}
• Temporary Password: ${tempPass}
• Assigned Workspace: ${deptName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STEP-BY-STEP FIRST LOGIN GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Open the Portal
Open: ${loginUrl}

Step 2: Sign In
Enter your User ID ("${userId}") and Temporary Password ("${tempPass}").

Step 3: Update Password (Mandatory)
For security, the portal will immediately ask you to set your own permanent password on first login.

Step 4: Access Your Deliverables
${roleWorkspaceDetail}

Step 5: Document Vault
You can inspect your signed agreement and project briefs in your Document Vault under "My Documents".

⚠️ SECURITY NOTICE: Keep these credentials strictly confidential. Fusion Engine administrators will never ask for your personal password.

Welcome aboard, we are excited to build with you!

Warm regards,
Prakash Ramakrishnan (Founder & Super Admin)
${EMAIL_CONFIG.COMPANY_NAME}
🌐 https://www.fusionengine.in
✉️ ${EMAIL_CONFIG.COMPANY_EMAIL}`.trim(),
      };
    }

    case 'Rejected':
      return {
        subject: `Application Update: ${role} — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

Thank you for your interest in joining ${EMAIL_CONFIG.COMPANY_NAME} and for taking the time to share your background for the ${role} opening (Application Ref: ${ref}).

We have reviewed your profile and experience. While your qualifications are strong, we have chosen to proceed with candidates whose immediate technical alignment matches our active customer sprint deliverables at this time.

We have archived your profile in our active talent directory, and we will reach out directly should a relevant opening open up as our client projects expand.

We wish you every success in your professional endeavors!

Warm regards,
Talent Acquisition Team
${EMAIL_CONFIG.COMPANY_NAME}
🌐 https://www.fusionengine.in
✉️ ${EMAIL_CONFIG.COMPANY_EMAIL}`.trim(),
      };

    default:
      return {
        subject: `Update on your application for ${role} — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

We are writing to update you on your application for the ${role} opening at ${EMAIL_CONFIG.COMPANY_NAME} (Ref: ${ref}).

Your application is currently Under Review by our technical hiring team. We appreciate your patience and will reach out with next steps soon.

Warm regards,
Talent Acquisition Team
${EMAIL_CONFIG.COMPANY_NAME}
🌐 https://www.fusionengine.in
✉️ ${EMAIL_CONFIG.COMPANY_EMAIL}`.trim(),
      };
  }
}

/**
 * Sends candidate notification email via EmailJS browser SDK
 */
export async function sendCandidateEmail(payload: CandidateEmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

    const templateParams = {
      to_email: payload.toEmail,
      email: payload.toEmail, // Covers templates using {{email}}
      to_name: payload.toName,
      name: payload.toName, // Covers templates using {{name}}
      from_name: 'Fusion Engine Technology',
      subject: payload.subject,
      title: payload.subject,
      message: payload.body,
      content: payload.body,
      from_email: EMAIL_CONFIG.COMPANY_EMAIL,
      reply_to: EMAIL_CONFIG.COMPANY_EMAIL,
      role: payload.roleTitle,
      ref_code: payload.referenceCode,
      status: payload.status,
      time: new Date().toLocaleString(),
    };

    let response;
    try {
      response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
    } catch (primaryErr) {
      console.warn('Primary template attempt warning, trying fallback template:', primaryErr);
      response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.FALLBACK_TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
    }

    if (response.status === 200 || response.text === 'OK') {
      return { success: true };
    }
    return { success: false, error: `Email service returned status ${response.status}` };
  } catch (err: any) {
    console.error('Candidate EmailJS dispatch note:', err);
    return { success: false, error: err?.text || err?.message || 'Failed to dispatch email via EmailJS.' };
  }
}

/**
 * Generates an encoded mailto: URL for instant fallback in default desktop/mobile mail client
 */
export function generateMailtoLink(toEmail: string, subject: string, body: string): string {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `mailto:${encodeURIComponent(toEmail)}?subject=${encSubject}&body=${encBody}`;
}

/**
 * Generates a direct 1-click Gmail Web compose URL with pre-filled recipient, exact subject & formatted letter
 */
export function generateGmailComposeUrl(toEmail: string, subject: string, body: string): string {
  const encTo = encodeURIComponent(toEmail);
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSubject}&body=${encBody}`;
}
