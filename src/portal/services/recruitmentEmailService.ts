import emailjs from '@emailjs/browser';
import { JobApplication } from '../types';

export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_vtbrgi5',
  TEMPLATE_ID: 'jbuc3li', // The active template configured in your EmailJS dashboard
  FALLBACK_TEMPLATE_ID: 'template_p8i38d6',
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
  status: 'Shortlisted' | 'Hired' | 'Rejected' | 'Under Review' | string;
  subject: string;
  body: string;
}

/**
 * Returns default email subject and body template tailored to each candidate status
 */
export function getCandidateEmailTemplate(
  candidate: Pick<JobApplication, 'fullName' | 'roleTitle' | 'referenceCode'> & {
    email?: string;
    department?: string;
  },
  status: 'Shortlisted' | 'Hired' | 'Rejected' | 'Under Review' | string,
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
    case 'Shortlisted': {
      const agreementLink = `${EMAIL_CONFIG.PORTAL_URL}/agreement?ref=${ref}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(candidate.email || '')}`;
      return {
        subject: `Application Shortlisted & Freelancer Agreement — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

Thank you for applying for the ${role} position at ${EMAIL_CONFIG.COMPANY_NAME} (Application Ref: ${ref}).

We are pleased to inform you that your profile, portfolio, and experience have been Shortlisted by our technical and leadership review team!

==================================================
📄 FREELANCER ONBOARDING & SERVICE AGREEMENT
==================================================
As part of our standard professional onboarding process under the Indian Information Technology Act, 2000, please review and digitally sign your Freelancer Service Agreement using your personalized link below:

🔗 Review & Sign Your Agreement:
${agreementLink}

Summary of Agreed Engagement Terms:
• Role: ${role}
• Type: Independent Freelancer / Deliverable-based
• Developer Deliverable Fee: Based on approved sprint milestone deliverables
• Telecaller Commission: ₹150 per verified successful client conversion
• IP & Confidentiality: Perpetual worldwide assignment of created deliverables to Fusion Engine Technology; strict non-disclosure of company code and client records.
• Notice Period: 7 days written notice by either party.

Next Steps:
1. Open the agreement link above and type your legal name to digitally sign.
2. Once signed, our executive team will review your countersignature and activate your workforce portal login credentials.

If you have any questions, you can reply directly to this email.

Warm regards,
Talent Acquisition & Executive Team
${EMAIL_CONFIG.COMPANY_NAME}
${EMAIL_CONFIG.COMPANY_EMAIL}
${EMAIL_CONFIG.PORTAL_URL}`.trim(),
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
          ? '• Telecaller Tools: Access your CRM leads pipeline, calling scripts, merchant records, and commission tracking.'
          : assignedRole === 'admin'
          ? '• Executive Tools: Access full ERP oversight, workforce management, review gates, and financial governance.'
          : '• Developer Tools: Access your project sprint board, tasks queue, code submission review gates, and deliverables tracker.';

      return {
        subject: `Welcome Aboard! Offer & Portal Login Credentials — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

Congratulations! Following our evaluation of your application (Ref: ${ref}) and discussions, we are delighted to officially welcome you to ${EMAIL_CONFIG.COMPANY_NAME} as a ${role}!

We were truly impressed by your qualifications and are excited to have you contribute to our upcoming enterprise deliverables.

==================================================
🔑 YOUR WORKFORCE PORTAL LOGIN CREDENTIALS
==================================================
Portal Login URL:   ${loginUrl}
User ID:            ${userId}
Registered Email:   ${candidate.email || 'Your registered email'}
Temporary Password: ${tempPass}
Assigned Workspace: ${deptName}

==================================================
📋 STEP-BY-STEP LOGIN & ONBOARDING GUIDE
==================================================
Step 1: Open the Portal
Click the Login URL above or open: ${loginUrl}

Step 2: Enter Your Credentials
Type your User ID ("${userId}") and your Temporary Password ("${tempPass}").

Step 3: Set Your Personal Password (Required)
For security compliance, the portal will immediately prompt you to set your own secure permanent password on your first login.

Step 4: Access Your Workspace & Deliverables
Once logged in, your active workspace tools will be unlocked:
${roleWorkspaceDetail}

Step 5: Review Compliance & Documentation
Review your deliverable specifications and agreements in your Document Vault under "My Documents".

⚠️ SECURITY NOTICE:
Please keep these login credentials strictly confidential. Fusion Engine administrators will never ask for your permanent password.

If you have any questions or require onboarding assistance, reply directly to this email or reach us at ${EMAIL_CONFIG.COMPANY_EMAIL}.

Welcome aboard!

Warm regards,
Prakash (Founder & Super Admin)
${EMAIL_CONFIG.COMPANY_NAME}
${EMAIL_CONFIG.COMPANY_EMAIL}
${EMAIL_CONFIG.PORTAL_URL}`.trim(),
      };
    }

    case 'Rejected':
      return {
        subject: `${EMAIL_CONFIG.COMPANY_NAME} Application Update — ${role} [${ref}]`,
        body: `Dear ${name},

Thank you for taking the time to apply for the ${role} position at ${EMAIL_CONFIG.COMPANY_NAME} (Application Ref: ${ref}).

We carefully reviewed your qualifications and background. While your profile is commendable, we have decided to proceed with other candidates whose skillsets align more closely with our immediate project deliverables at this stage.

We will keep your resume and contact details in our active talent directory for future openings as our projects expand.

We wish you all the best in your career pursuits!

Warm regards,
Talent Acquisition Team
${EMAIL_CONFIG.COMPANY_NAME}
${EMAIL_CONFIG.COMPANY_EMAIL}
${EMAIL_CONFIG.PORTAL_URL}`.trim(),
      };

    default:
      return {
        subject: `Update regarding your application for ${role} — ${EMAIL_CONFIG.COMPANY_NAME} [${ref}]`,
        body: `Dear ${name},

We are writing to update you on the status of your application for the ${role} position at ${EMAIL_CONFIG.COMPANY_NAME} (Ref: ${ref}).

Your application is currently Under Review by our technical hiring team. We appreciate your patience and will reach out with next steps soon.

Warm regards,
Talent Acquisition Team
${EMAIL_CONFIG.COMPANY_NAME}
${EMAIL_CONFIG.COMPANY_EMAIL}
${EMAIL_CONFIG.PORTAL_URL}`.trim(),
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
      to_name: payload.toName,
      subject: payload.subject,
      title: payload.subject,
      name: payload.subject, // Fills {{name}} in EmailJS template subject line
      from_name: payload.subject, // Fills {{from_name}} in EmailJS template subject line
      message: payload.body,
      content: payload.body,
      from_email: EMAIL_CONFIG.COMPANY_EMAIL,
      reply_to: EMAIL_CONFIG.COMPANY_EMAIL,
      email: EMAIL_CONFIG.COMPANY_EMAIL,
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

