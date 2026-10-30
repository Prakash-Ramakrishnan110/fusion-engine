export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'developer' | 'telecaller';
export type ProjectStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'archived';
export type TaskStatus = 'assigned' | 'in_progress' | 'submitted' | 'changes_requested' | 'approved';
export type VoucherStatus = 'draft' | 'pending_approval' | 'approved' | 'paid' | 'rejected';
export type LeadStage = 'new' | 'contacted' | 'interested' | 'demo' | 'proposal' | 'won' | 'lost';
export type CallOutcome = 'interested' | 'callback_scheduled' | 'demo_requested' | 'not_interested' | 'invalid_number' | 'unreachable';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          role: UserRole;
          department: string;
          phone: string | null;
          is_active: boolean;
          must_change_password: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          full_name: string;
          role?: UserRole;
          department?: string;
          phone?: string | null;
          is_active?: boolean;
          must_change_password?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          role?: UserRole;
          department?: string;
          phone?: string | null;
          is_active?: boolean;
          must_change_password?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      developer_details: {
        Row: {
          id: string;
          profile_id: string;
          skills: string[] | null;
          pan: string | null;
          bank_account_name: string | null;
          bank_account_no: string | null;
          ifsc: string | null;
          upi_id: string | null;
          agreement_doc_path: string | null;
          nda_doc_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          skills?: string[] | null;
          pan?: string | null;
          bank_account_name?: string | null;
          bank_account_no?: string | null;
          ifsc?: string | null;
          upi_id?: string | null;
          agreement_doc_path?: string | null;
          nda_doc_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          skills?: string[] | null;
          pan?: string | null;
          bank_account_name?: string | null;
          bank_account_no?: string | null;
          ifsc?: string | null;
          upi_id?: string | null;
          agreement_doc_path?: string | null;
          nda_doc_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          contact_person: string;
          phone: string;
          email: string | null;
          gst_no: string | null;
          address: string | null;
          source_lead_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person: string;
          phone: string;
          email?: string | null;
          gst_no?: string | null;
          address?: string | null;
          source_lead_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string;
          phone?: string;
          email?: string | null;
          gst_no?: string | null;
          address?: string | null;
          source_lead_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          default_modules: Json;
          default_milestones: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          default_modules?: Json;
          default_milestones?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          default_modules?: Json;
          default_milestones?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          code: string;
          name: string;
          client_id: string | null;
          type: string;
          description: string | null;
          contract_value: number;
          start_date: string;
          end_date: string;
          status: ProjectStatus;
          template_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code?: string;
          name: string;
          client_id?: string | null;
          type?: string;
          description?: string | null;
          contract_value?: number;
          start_date: string;
          end_date: string;
          status?: ProjectStatus;
          template_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          client_id?: string | null;
          type?: string;
          description?: string | null;
          contract_value?: number;
          start_date?: string;
          end_date?: string;
          status?: ProjectStatus;
          template_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_modules: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          budget_weight_pct: number;
          sort_order: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          budget_weight_pct?: number;
          sort_order?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          budget_weight_pct?: number;
          sort_order?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          profile_id: string;
          project_role: string;
          pay_model: string;
          rate: number;
          allocation_pct: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          profile_id: string;
          project_role?: string;
          pay_model?: string;
          rate?: number;
          allocation_pct?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          profile_id?: string;
          project_role?: string;
          pay_model?: string;
          rate?: number;
          allocation_pct?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          percentage: number;
          amount: number;
          due_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          percentage: number;
          amount?: number;
          due_date: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          percentage?: number;
          amount?: number;
          due_date?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          module_id: string | null;
          milestone_id: string | null;
          title: string;
          description: string | null;
          acceptance_criteria: string | null;
          assignee_id: string | null;
          reviewer_id: string | null;
          priority: string;
          estimated_hours: number | null;
          deadline: string;
          status: TaskStatus;
          depends_on: string[] | null;
          payout_amount: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          module_id?: string | null;
          milestone_id?: string | null;
          title: string;
          description?: string | null;
          acceptance_criteria?: string | null;
          assignee_id?: string | null;
          reviewer_id?: string | null;
          priority?: string;
          estimated_hours?: number | null;
          deadline?: string | null;
          status?: TaskStatus;
          depends_on?: string[] | null;
          payout_amount?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          module_id?: string | null;
          milestone_id?: string | null;
          title?: string;
          description?: string | null;
          acceptance_criteria?: string | null;
          assignee_id?: string | null;
          reviewer_id?: string | null;
          priority?: string;
          estimated_hours?: number | null;
          deadline?: string;
          status?: TaskStatus;
          depends_on?: string[] | null;
          payout_amount?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      task_submissions: {
        Row: {
          id: string;
          task_id: string;
          version: number;
          github_pr_url: string;
          commit_hash: string;
          demo_url: string | null;
          tests_passed: number | null;
          tests_total: number | null;
          notes: string | null;
          proof_files: string[] | null;
          submitted_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          version?: number;
          github_pr_url: string;
          commit_hash: string;
          demo_url?: string | null;
          tests_passed?: number | null;
          tests_total?: number | null;
          notes?: string | null;
          proof_files?: string[] | null;
          submitted_by: string;
          created_at?: string;
        };
        Update: { [key: string]: never };
        Relationships: [];
      };
      task_reviews: {
        Row: {
          id: string;
          submission_id: string;
          reviewer_id: string;
          decision: string;
          comments: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          reviewer_id: string;
          decision: string;
          comments: string;
          created_at?: string;
        };
        Update: { [key: string]: never };
        Relationships: [];
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          author_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          author_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          author_id?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      vouchers: {
        Row: {
          id: string;
          voucher_no: string;
          project_id: string;
          milestone_id: string | null;
          payee_id: string;
          gross_amount: number;
          tds_rate: number;
          tds_amount: number;
          net_amount: number;
          status: VoucherStatus;
          utr_reference: string | null;
          payment_mode: string | null;
          paid_on: string | null;
          pdf_path: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          voucher_no: string;
          project_id: string;
          milestone_id?: string | null;
          payee_id: string;
          gross_amount: number;
          tds_rate?: number;
          tds_amount: number;
          net_amount: number;
          status?: VoucherStatus;
          utr_reference?: string | null;
          payment_mode?: string | null;
          paid_on?: string | null;
          pdf_path?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          voucher_no?: string;
          project_id?: string;
          milestone_id?: string | null;
          payee_id?: string;
          gross_amount?: number;
          tds_rate?: number;
          tds_amount?: number;
          net_amount?: number;
          status?: VoucherStatus;
          utr_reference?: string | null;
          payment_mode?: string | null;
          paid_on?: string | null;
          pdf_path?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          project_id: string | null;
          category: string;
          title: string;
          file_path: string;
          uploaded_by: string;
          version: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          category: string;
          title: string;
          file_path: string;
          uploaded_by: string;
          version?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          category?: string;
          title?: string;
          file_path?: string;
          uploaded_by?: string;
          version?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          business_name: string;
          contact_person: string;
          phone: string;
          email: string | null;
          category: string;
          city: string;
          source: string;
          stage: LeadStage;
          score: number;
          assigned_to: string | null;
          locked_by: string | null;
          locked_at: string | null;
          lock_expires_at: string | null;
          decision_maker_confirmed: boolean;
          pain_points: string[] | null;
          next_callback_at: string | null;
          is_dnc: boolean;
          tags: string[] | null;
          converted_client_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          contact_person: string;
          phone: string;
          email?: string | null;
          category?: string;
          city: string;
          source?: string;
          stage?: LeadStage;
          score?: number;
          assigned_to?: string | null;
          locked_by?: string | null;
          locked_at?: string | null;
          lock_expires_at?: string | null;
          decision_maker_confirmed?: boolean;
          pain_points?: string[] | null;
          next_callback_at?: string | null;
          is_dnc?: boolean;
          tags?: string[] | null;
          converted_client_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          contact_person?: string;
          phone?: string;
          email?: string | null;
          category?: string;
          city?: string;
          source?: string;
          stage?: LeadStage;
          score?: number;
          assigned_to?: string | null;
          locked_by?: string | null;
          locked_at?: string | null;
          lock_expires_at?: string | null;
          decision_maker_confirmed?: boolean;
          pain_points?: string[] | null;
          next_callback_at?: string | null;
          is_dnc?: boolean;
          tags?: string[] | null;
          converted_client_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lead_activities: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          type: string;
          outcome: CallOutcome | null;
          notes: string | null;
          duration_sec: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id: string;
          type: string;
          outcome?: CallOutcome | null;
          notes?: string | null;
          duration_sec?: number | null;
          created_at?: string;
        };
        Update: { [key: string]: never };
        Relationships: [];
      };
      qualification_requests: {
        Row: {
          id: string;
          lead_id: string;
          requested_by: string;
          status: string;
          reviewed_by: string | null;
          commission_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          requested_by: string;
          status?: string;
          reviewed_by?: string | null;
          commission_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          requested_by?: string;
          status?: string;
          reviewed_by?: string | null;
          commission_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      commission_rules: {
        Row: {
          id: string;
          trigger: string;
          amount_or_pct: number;
          is_percentage: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          trigger: string;
          amount_or_pct: number;
          is_percentage?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          trigger?: string;
          amount_or_pct?: number;
          is_percentage?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      commissions: {
        Row: {
          id: string;
          telecaller_id: string;
          lead_id: string;
          rule_id: string | null;
          amount: number;
          voucher_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          telecaller_id: string;
          lead_id: string;
          rule_id?: string | null;
          amount: number;
          voucher_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          telecaller_id?: string;
          lead_id?: string;
          rule_id?: string | null;
          amount?: number;
          voucher_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      call_targets: {
        Row: {
          id: string;
          telecaller_id: string;
          date: string;
          target_calls: number;
          target_connects: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          telecaller_id: string;
          date: string;
          target_calls?: number;
          target_connects?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          telecaller_id?: string;
          date?: string;
          target_calls?: number;
          target_connects?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      sales_scripts: {
        Row: {
          id: string;
          title: string;
          body: string;
          type: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          type: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          type?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          link: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          link?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          link?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          project_id: string | null;
          before: Json | null;
          after: Json | null;
          ip: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          project_id?: string | null;
          before?: Json | null;
          after?: Json | null;
          ip?: string | null;
          created_at?: string;
        };
        Update: { [key: string]: never };
        Relationships: [];
      };
      business_types: {
        Row: {
          id: string;
          name: string;
          slug: string;
          default_pain_points: string[] | null;
          is_active: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          default_pain_points?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          default_pain_points?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      call_scripts: {
        Row: {
          id: string;
          business_type_id: string;
          language: string;
          opening: string;
          pitch_30s: string;
          pitch_3min: string;
          probe_questions: string[];
          pain_point_hooks: string[];
          objection_handlers: Record<string, string>;
          closing_cta: string;
          whatsapp_followup: string;
          voicemail_script?: string | null;
          status: 'draft' | 'approved' | 'archived';
          version: number;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_type_id: string;
          language: string;
          opening: string;
          pitch_30s: string;
          pitch_3min: string;
          probe_questions?: string[] | null;
          pain_point_hooks?: string[] | null;
          objection_handlers?: Record<string, string> | Json | null;
          closing_cta: string;
          whatsapp_followup: string;
          voicemail_script?: string | null;
          status?: string;
          version?: number;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_type_id?: string;
          language?: string;
          opening?: string;
          pitch_30s?: string;
          pitch_3min?: string;
          probe_questions?: string[] | null;
          pain_point_hooks?: string[] | null;
          objection_handlers?: Record<string, string> | Json | null;
          closing_cta?: string;
          whatsapp_followup?: string;
          voicemail_script?: string | null;
          status?: string;
          version?: number;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_project_member: {
        Args: { p_project_id: string };
        Returns: boolean;
      };
      is_tech_lead: {
        Args: { p_project_id: string };
        Returns: boolean;
      };
      lock_lead: {
        Args: { p_lead_id: string };
        Returns: Json;
      };
      release_lead: {
        Args: { p_lead_id: string };
        Returns: Json;
      };
      log_call: {
        Args: {
          p_lead_id: string;
          p_outcome: CallOutcome;
          p_pain_points: string[];
          p_decision_maker: boolean;
          p_callback_at?: string;
          p_notes?: string;
          p_duration_sec?: number;
        };
        Returns: Json;
      };
      convert_lead_to_client_project: {
        Args: { p_lead_id: string };
        Returns: Json;
      };
      create_project_from_wizard: {
        Args: { p_payload: Json };
        Returns: Json;
      };
      generate_voucher: {
        Args: {
          p_project_id: string;
          p_payee_id: string;
          p_milestone_id?: string;
          p_gross_amount?: number;
          p_tds_rate?: number;
        };
        Returns: Json;
      };
      dedupe_leads: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      project_status: ProjectStatus;
      task_status: TaskStatus;
      voucher_status: VoucherStatus;
      lead_stage: LeadStage;
      call_outcome: CallOutcome;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
