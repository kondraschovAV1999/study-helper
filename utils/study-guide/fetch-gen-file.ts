import { createClient } from "../supabase/server";

export async function fetchGenFileInfo(id: string) {
  const supabase = await createClient();
  let { data, error } = await supabase.rpc("get_gen_file", {
    p_study_guide_id: id,
  });
  if (error) throw new Error(error.message);
  
  if (!data || data.length === 0) {
    throw new Error("No data returned from get_gen_file");
  }
  return data[0];
}
