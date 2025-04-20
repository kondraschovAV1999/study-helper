import { SupabaseClient } from "@supabase/supabase-js";
export default async function deleteFromStorage(
  obj_id: string,
  supabase: SupabaseClient<any, any, any>
) {
  const { data: object, error } = await supabase
    .from("storage.objects")
    .select("name,bucket_id")
    .eq("id", obj_id)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  const { data, error: err } = await supabase.storage
    .from(object.name)
    .remove([object.name]);

  if (err) {
    console.log(err);
  }
}
