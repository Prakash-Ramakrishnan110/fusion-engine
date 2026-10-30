export interface FreelancerAgreementDetails {
  candidateName: string;
  candidateAddress?: string;
  candidatePhone: string;
  candidateEmail: string;
  role: 'Software Developer' | 'Telecaller';
  startDate?: string;
  agreementDate?: string;
  projectName?: string;
  projectFee?: string;
  commissionPerConversion?: number;
}

export function generateFreelancerAgreementText(details: FreelancerAgreementDetails): string {
  const isDev = details.role === 'Software Developer';
  const agreementDate = details.agreementDate || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startDate = details.startDate || agreementDate;

  return `
================================================================================
FUSION ENGINE TECHNOLOGY
FREELANCER ONBOARDING & SERVICE AGREEMENT
Tagline: Innovate • Integrate • Accelerate
Website: https://fusionengine.in
Email: fusionenginetechnology@gmail.com
================================================================================

This Freelancer Onboarding & Service Agreement (“Agreement”) is entered into on ${agreementDate} between Fusion Engine Technology and the Freelancer identified below.

1. COMPANY DETAILS
Company Name: Fusion Engine Technology
Company Representative: Prakash Ramakrishnan
Website: https://fusionengine.in
Email: fusionenginetechnology@gmail.com

2. FREELANCER DETAILS
Full Name: ${details.candidateName}
Address: ${details.candidateAddress || 'Registered Address on Application'}
Phone Number: ${details.candidatePhone}
Email Address: ${details.candidateEmail}
Role: ${details.role}
Start Date: ${startDate}
Agreement Date: ${agreementDate}

3. PURPOSE OF THE AGREEMENT
Fusion Engine Technology engages the Freelancer to provide services according to the assigned role and agreed responsibilities.
The Freelancer agrees to perform the assigned work professionally, communicate regularly, protect Company information, and follow the terms of this Agreement.
This is a freelance engagement. It does not guarantee permanent employment or future assignments.

4. ROLES AND RESPONSIBILITIES
${
  isDev
    ? `A. Software Developer
The Software Developer agrees to:
• Develop, test, maintain, and improve software applications assigned by the Company.
• Follow the agreed project requirements, technical specifications, and coding standards.
• Complete the assigned work within the mutually agreed timeline.
• Provide regular progress updates and communicate any delays or technical difficulties.
• Submit source code, documentation, designs, and other agreed deliverables.
• Use Company-approved tools, repositories, and development environments where required.
• Protect source code, credentials, API keys, and confidential technical information.
• Correct reasonable defects where the submitted work does not meet the agreed requirements.
• Obtain approval before making significant changes to project scope or technology.
• Hand over the agreed deliverables and documentation when the assignment is completed.`
    : `B. Telecaller
The Telecaller agrees to:
• Contact potential clients using Company-approved methods and contact information.
• Explain the Company's products and services accurately and professionally.
• Identify potential customers and understand their requirements.
• Follow up with interested clients and maintain accurate records.
• Update the Company on enquiries, follow-ups, and successful conversions.
• Communicate respectfully with prospective customers.
• Avoid false promises, unauthorized discounts, misleading statements, or unapproved commitments.
• Protect customer contact information and other confidential business data.
• Follow the Company's approved calling scripts, sales process, and communication guidelines.
• Report successful conversions with the necessary supporting records.`
}

5. PAYMENT TERMS AND COMPENSATION
${
  isDev
    ? `A. Software Developer — Project & Milestone-Based Compensation
• The Software Developer will be assigned development tasks, technical modules, and deliverables through written project task sheets or sprint allocations.
• Technical specifications, acceptance criteria, timelines, and milestone fees will be confirmed in writing prior to commencing work on each assigned scope.
• Payment will be released after the Developer completes and submits the agreed deliverables and the Company approves them against the agreed acceptance criteria.
• The Company will review submitted work within a reasonable period and communicate any issues that require correction.
• If the work does not meet agreed specifications, the Developer will receive a reasonable opportunity to rectify the defects.
• The Company will release the agreed payment within the payment schedule confirmed in writing upon milestone acceptance.
• Additional features, significant scope additions, or out-of-scope work require written approval and may involve additional compensation.
• The Developer must hand over all agreed source code, repositories, commit history, and technical documentation as part of the assignment.
• The Company will not require unpaid additional work beyond the agreed scope as a condition of accepting original deliverables.`
    : `B. Telecaller — ₹150 Per Successful Client Conversion
• The Telecaller will receive ₹150 for each successfully converted client.
• A successful conversion means a new client who agrees to purchase the Company's product or service and completes the agreed transaction requirement, such as making the required initial payment.
• The Company and Telecaller will confirm the conversion criteria in writing before calling activities begin.
• The Telecaller must maintain accurate records of client names, contact details where lawfully collected, conversion status, and supporting transaction references.
• The Company will verify the reported conversions before calculating the commission.
• Duplicate leads, existing clients, test enquiries, and unverified conversions will not qualify unless specifically approved in writing.
• No commission is earned merely because a person answers a call or expresses interest. The agreed successful-conversion criteria must be met.
• The Company will pay verified commissions according to the agreed payment schedule.
• Commission Per Successful Conversion: ₹${details.commissionPerConversion || 150}
• Commission Payment Schedule: Bi-weekly / Monthly upon reconciliation
• Approved Conversion Criteria: Verified paid onboarding verified via bank UTR or gateway`
}

6. CONFIDENTIALITY AND NON-DISCLOSURE
The Freelancer must protect all non-public information relating to Fusion Engine Technology, including:
• Source code, software architecture, databases, and technical documentation.
• Customer details, prospective customer leads, and contact lists.
• Business plans, pricing, proposals, and sales information.
• Passwords, API keys, access tokens, and account credentials.
• Unreleased products, designs, and internal documents.
• Any other information that is confidential by its nature or identified as confidential.
The Freelancer must not disclose, sell, publish, misuse, or share confidential information with unauthorized persons.
Company information may be used only for performing the assigned services.
These obligations do not apply to information that is lawfully public, independently developed without using confidential information, or lawfully received without a confidentiality restriction.
Where disclosure is legally required, the Freelancer will notify the Company in advance where legally permitted.
Confidentiality obligations continue after the engagement ends for as long as the information remains confidential under applicable law.

7. INTELLECTUAL PROPERTY AND OWNERSHIP
Subject to applicable law and the terms of the assignment, work specifically created for the Company will be perpetually and irrevocably assigned to Fusion Engine Technology worldwide after payment of the agreed fees for that work (in accordance with the Indian Copyright Act, 1957).
This includes source code, software modules, UI/UX designs, documentation, and technical reports.

8. DATA SECURITY AND COMPANY ACCESS
The Freelancer agrees to keep Company passwords and credentials secure, use Company systems and accounts only for authorized purposes, never share access credentials with unauthorized persons, and report suspected data leaks or security incidents promptly.

9. PROFESSIONAL CONDUCT
The Freelancer must communicate respectfully with the Company, team members, and customers; provide reasonable progress updates; inform the Company promptly about delays, blockers, or other issues; and avoid fraud, harassment, misleading statements, and unauthorized commitments.

10. PORTFOLIO AND PUBLICITY
The Freelancer must not publish confidential Company information, customer details, source code, internal screenshots, or unreleased product information in a portfolio, on social media, or elsewhere without prior written permission.

11. INDEPENDENT FREELANCER RELATIONSHIP
The Freelancer is engaged as an independent service provider and not as an employee, partner, or agent of the Company. The engagement does not guarantee permanent employment, employee benefits, a minimum amount of work, or future assignments.

12. TERMINATION OF ENGAGEMENT
Either party may terminate the engagement by providing seven (7) days' written notice, unless another period is agreed in writing.
The Company may suspend access or terminate the engagement in response to serious misconduct, fraud, material breach, or a security incident, subject to applicable law.
Upon termination, the Freelancer must hand over agreed deliverables and project documentation. Approved outstanding payments for accepted work and eligible verified conversions must be settled according to the agreed payment terms.

13. DISPUTE RESOLUTION
Both parties will first attempt to resolve disagreements through good-faith discussion.
If a dispute cannot be resolved amicably, it will be handled under the laws of India by a competent court with jurisdiction in Tamil Nadu, India.

14. AGREEMENT AND ACCEPTANCE
Both parties confirm that they have read and understood this Agreement and voluntarily accept its terms under the Information Technology Act, 2000.
`.trim();
}

