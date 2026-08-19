/**
 * Hand-maintained mirror of the schema in `supabase/migrations`.
 *
 * Regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
 *
 * Kept minimal on purpose: the app reads rows through the typed models in
 * `src/types/models.ts`, so only the table row shapes are needed here.
 */
import type {
  Payment,
  Profile,
  Property,
  PropertyContact,
  Report,
  ReportDifference,
  ReportMedia,
  ReportObservation,
  ReportQuestion,
  ReportUncheckedArea,
  VerifierProfile,
  Visit,
  VisitEvent,
  VisitPriority,
} from '@/types/models';

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<Profile>;
      verifier_profiles: Table<VerifierProfile>;
      properties: Table<Property>;
      property_contacts: Table<PropertyContact>;
      visits: Table<Visit>;
      visit_priorities: Table<VisitPriority>;
      visit_events: Table<VisitEvent>;
      reports: Table<Report>;
      report_observations: Table<ReportObservation>;
      report_differences: Table<ReportDifference>;
      report_questions: Table<ReportQuestion>;
      report_unchecked_areas: Table<ReportUncheckedArea>;
      report_media: Table<ReportMedia>;
      payments: Table<Payment>;
      device_tokens: Table<{
        id: string;
        user_id: string;
        platform: string;
        token: string;
        created_at: string;
        updated_at: string;
      }>;
    };
    Views: {
      verifier_public_cards: {
        Row: {
          user_id: string;
          first_name: string;
          last_initial: string;
          avatar_url: string | null;
          identity_verified: boolean;
          languages: string[];
          bio: string | null;
          completed_visits: number;
          average_rating: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      submit_report: {
        Args: { p_report_id: string };
        Returns: undefined;
      };
      verifier_check_in: {
        Args: { p_visit_id: string };
        Returns: undefined;
      };
      verifier_check_out: {
        Args: { p_visit_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
