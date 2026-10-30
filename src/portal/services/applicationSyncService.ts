import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { JobApplication } from '../types';

export const mapRowToApplication = (row: any): JobApplication => ({
  id: row.id,
  referenceCode: row.reference_code,
  roleId: row.role_id,
  roleTitle: row.role_title,
  department: row.department,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone || '',
  city: row.city || '',
  portfolioUrl: row.portfolio_url || undefined,
  expectedCompensation: row.expected_compensation || undefined,
  experienceSummary: row.experience_summary || '',
  resumeFileName: row.resume_file_name || undefined,
  status: row.status,
  adminNotes: row.admin_notes || undefined,
  submittedAt: row.submitted_at,
  reviewedAt: row.reviewed_at || undefined,
  reviewedBy: row.reviewed_by || undefined,
  lastEmailSentAt: row.last_email_sent_at || undefined,
  lastEmailType: row.last_email_type || undefined,
  agreementSignedAt: row.agreement_signed_at || undefined,
  agreementSignature: row.agreement_signature || undefined,
  agreementSignerIp: row.agreement_signer_ip || undefined,
  agreementTermsAccepted: Boolean(row.agreement_terms_accepted),
  agreementAffirmationWord: row.agreement_affirmation_word || undefined,
  agreementStatus: row.agreement_status || 'pending',
  agreementRejectedAt: row.agreement_rejected_at || undefined,
  agreementRejectionReason: row.agreement_rejection_reason || undefined,
  agreementDocumentText: row.agreement_document_text || undefined,
});

export const mapApplicationToRow = (app: JobApplication): any => ({
  id: app.id,
  reference_code: app.referenceCode,
  role_id: app.roleId,
  role_title: app.roleTitle,
  department: app.department,
  full_name: app.fullName,
  email: app.email,
  phone: app.phone || null,
  city: app.city || null,
  portfolio_url: app.portfolioUrl || null,
  expected_compensation: app.expectedCompensation || null,
  experience_summary: app.experienceSummary || null,
  resume_file_name: app.resumeFileName || null,
  status: app.status || 'New',
  admin_notes: app.adminNotes || null,
  submitted_at: app.submittedAt || new Date().toISOString(),
  reviewed_at: app.reviewedAt || null,
  reviewed_by: app.reviewedBy || null,
  last_email_sent_at: app.lastEmailSentAt || null,
  last_email_type: app.lastEmailType || null,
  agreement_signed_at: app.agreementSignedAt || null,
  agreement_signature: app.agreementSignature || null,
  agreement_signer_ip: app.agreementSignerIp || null,
  agreement_terms_accepted: Boolean(app.agreementTermsAccepted),
  agreement_affirmation_word: app.agreementAffirmationWord || null,
  agreement_status: app.agreementStatus || 'pending',
  agreement_rejected_at: app.agreementRejectedAt || null,
  agreement_rejection_reason: app.agreementRejectionReason || null,
  agreement_rejection_notes: null,
  agreement_document_text: app.agreementDocumentText || null,
  updated_at: new Date().toISOString(),
});

/**
 * Fetch all candidate applications from Supabase with safe fallback
 */
export async function fetchApplicationsFromSupabase(): Promise<JobApplication[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('job_applications' as any)
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch applications notice:', error.message);
      return null;
    }
    if (!data) return [];
    return (data as any[]).map(mapRowToApplication);
  } catch (err) {
    console.warn('Supabase fetch applications network error:', err);
    return null;
  }
}

/**
 * Save new candidate application to Supabase
 */
export async function saveApplicationToSupabase(app: JobApplication): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const row = mapApplicationToRow(app);
    const { error } = await supabase
      .from('job_applications' as any)
      .upsert(row, { onConflict: 'reference_code' });

    if (error) {
      console.warn('Supabase save application error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save application network error:', err);
    return false;
  }
}

/**
 * Update candidate application in Supabase (e.g. status, signed agreement)
 */
export async function updateApplicationInSupabase(
  refOrId: string,
  updates: Partial<JobApplication>
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const partialRow: any = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) partialRow.status = updates.status;
    if (updates.adminNotes !== undefined) partialRow.admin_notes = updates.adminNotes;
    if (updates.reviewedAt !== undefined) partialRow.reviewed_at = updates.reviewedAt;
    if (updates.reviewedBy !== undefined) partialRow.reviewed_by = updates.reviewedBy;
    if (updates.lastEmailSentAt !== undefined) partialRow.last_email_sent_at = updates.lastEmailSentAt;
    if (updates.lastEmailType !== undefined) partialRow.last_email_type = updates.lastEmailType;
    if (updates.agreementSignedAt !== undefined) partialRow.agreement_signed_at = updates.agreementSignedAt;
    if (updates.agreementSignature !== undefined) partialRow.agreement_signature = updates.agreementSignature;
    if (updates.agreementSignerIp !== undefined) partialRow.agreement_signer_ip = updates.agreementSignerIp;
    if (updates.agreementTermsAccepted !== undefined) partialRow.agreement_terms_accepted = updates.agreementTermsAccepted;
    if (updates.agreementAffirmationWord !== undefined) partialRow.agreement_affirmation_word = updates.agreementAffirmationWord;
    if (updates.agreementStatus !== undefined) partialRow.agreement_status = updates.agreementStatus;
    if (updates.agreementRejectedAt !== undefined) partialRow.agreement_rejected_at = updates.agreementRejectedAt;
    if (updates.agreementRejectionReason !== undefined) partialRow.agreement_rejection_reason = updates.agreementRejectionReason;
    if (updates.agreementDocumentText !== undefined) partialRow.agreement_document_text = updates.agreementDocumentText;

    const { error } = await supabase
      .from('job_applications' as any)
      .update(partialRow)
      .or(`id.eq.${refOrId},reference_code.eq.${refOrId}`);

    if (error) {
      console.warn('Supabase update application error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update application network error:', err);
    return false;
  }
}

/**
 * Delete candidate application from Supabase
 */
export async function deleteApplicationFromSupabase(refOrId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('job_applications' as any)
      .delete()
      .or(`id.eq.${refOrId},reference_code.eq.${refOrId}`);

    if (error) {
      console.warn('Supabase delete application error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete application network error:', err);
    return false;
  }
}

