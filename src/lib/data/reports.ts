import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ReportInput } from "@/lib/validation";

export async function createReport(reporterId: string, input: ReportInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    reporter_id: reporterId,
    post_id: input.postId ?? null,
    reported_user_id: input.reportedUserId ?? null,
    reason: input.reason,
    details: input.details ?? null,
  });

  if (error) throw new Error(error.message);
}
