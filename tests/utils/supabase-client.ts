import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.test") });
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
