

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."quiz_type" AS ENUM (
    'multiple-choice',
    'true-false',
    'free-response'
);


ALTER TYPE "public"."quiz_type" OWNER TO "postgres";


CREATE TYPE "public"."set_type" AS ENUM (
    'flashcard',
    'quiz'
);


ALTER TYPE "public"."set_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."set_type" IS 'Define the type of the set';



CREATE OR REPLACE FUNCTION "public"."create_default_folders"("user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$DECLARE
  root_id uuid;
  myfolders_id uuid;
  recents_id uuid;
  study_id uuid;
  quizzes_id uuid;
  flashcards_id uuid;
BEGIN
  -- Step 1: Create the root folder and get its ID
  INSERT INTO folder (created_at, updated_at)
  VALUES (now(), now())
  RETURNING id INTO root_id;

  -- Root folder references itself for simplicity of search
  INSERT INTO folder_in_folder (user_id, parent_id, folder_name, folder_id)
  VALUES (
    user_id,
    '00000000-0000-0000-0000-000000000000',
    'Root',
    root_id
  );

  -- Step 2: Create 4 subfolders and capture their IDs
  INSERT INTO folder (created_at, updated_at) VALUES (now(), now()) RETURNING id INTO myfolders_id;
  INSERT INTO folder (created_at, updated_at) VALUES (now(), now()) RETURNING id INTO recents_id;
  INSERT INTO folder (created_at, updated_at) VALUES (now(), now()) RETURNING id INTO study_id;
  INSERT INTO folder (created_at, updated_at) VALUES (now(), now()) RETURNING id INTO quizzes_id;
  INSERT INTO folder (created_at, updated_at) VALUES (now(), now()) RETURNING id INTO flashcards_id;

  -- Step 3: Insert subfolders in folder_in_folder referencing root
  INSERT INTO folder_in_folder (user_id, parent_id, folder_name, folder_id)
  VALUES
    (user_id, root_id, 'My Folders', myfolders_id),
    (user_id, root_id, 'Recents', recents_id),
    (user_id, root_id, 'Study Guides', study_id),
    (user_id, root_id, 'Quizzes', quizzes_id),
    (user_id, root_id, 'Flashcards', flashcards_id);

END;$$;


ALTER FUNCTION "public"."create_default_folders"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_file"("p_file_id" "uuid", "p_is_ai_generated" boolean, "p_user_id" "uuid", "p_file_name" "text", "p_folder_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$declare
  created_file_id uuid;
begin
  insert into
    public.file (file_id, "isAIgenerated")
  values
    (p_file_id, p_is_ai_generated)
  returning
    id into created_file_id;

  insert into
    public.file_in_folder (file_id, user_id, file_name, folder_id)
  values
    (created_file_id, p_user_id, p_file_name, p_folder_id);

  return created_file_id;
end;$$;


ALTER FUNCTION "public"."create_file"("p_file_id" "uuid", "p_is_ai_generated" boolean, "p_user_id" "uuid", "p_file_name" "text", "p_folder_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_flashcard_set"("set_title" "text", "flashcards" "jsonb"[], "p_folder_id" "uuid", "p_study_guide_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$declare new_set_id UUID;

fc JSONB;

curr_user_id UUID;

s_type set_type := 'flashcards';

begin curr_user_id := fetch_current_user_id ();

if curr_user_id is null then raise exception 'Unauthorized: user must be authenticated';

end if;

if p_folder_id is null then p_folder_id := get_folder_id_under_root ('Flashcards');

end if;

insert into
  "set" (title, user_id, folder_id, study_guide_id, type)
values
  (
    set_title,
    curr_user_id,
    p_folder_id,
    p_study_guide_id,
    s_type
  )
returning
  id into new_set_id;

FOREACH fc in ARRAY flashcards LOOP
insert into
  flashcard (set_id, question, answer)
values
  (new_set_id, fc ->> 'question', fc ->> 'answer');

end LOOP;

RETURN new_set_id;

end;$$;


ALTER FUNCTION "public"."create_flashcard_set"("set_title" "text", "flashcards" "jsonb"[], "p_folder_id" "uuid", "p_study_guide_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."folder_in_folder" (
    "user_id" "uuid" NOT NULL,
    "parent_id" "uuid" DEFAULT '00000000-0000-0000-0000-000000000000'::"uuid" NOT NULL,
    "folder_name" "text" NOT NULL,
    "folder_id" "uuid" NOT NULL
);


ALTER TABLE "public"."folder_in_folder" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_folder"("parent_id" "uuid", "folder_name" "text") RETURNS "public"."folder_in_folder"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  folder_id UUID;
  user_id UUID;
  result folder_in_folder;
BEGIN
  -- Insert new folder and get its ID
  INSERT INTO folder (created_at, updated_at)
  VALUES (now(), now())
  RETURNING id INTO folder_id;

  -- Get current user ID
  SELECT id INTO user_id
  FROM "user" AS u
  WHERE u.auth_user_id = auth.uid();

  -- If user not found, raise error
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Cannot find user';
  END IF;

  -- Default parent_id if not provided
  IF parent_id IS NULL THEN
    parent_id := '00000000-0000-0000-0000-000000000000';
  END IF;

  -- Insert into folder_in_folder and return the result
  INSERT INTO folder_in_folder (user_id, parent_id, folder_name, folder_id)
  VALUES (user_id, parent_id, folder_name, folder_id)
  RETURNING * INTO result;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."create_folder"("parent_id" "uuid", "folder_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_study_guide"("folder_id" "uuid", "title" "text", "orig_file_id" "uuid", "orig_file_name" "text", "gen_file_id" "uuid", "gen_file_name" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$declare
  user_id uuid := fetch_current_user_id();
  orig_file uuid;
  gen_file uuid;
begin
  -- Check if user is authenticated
  if user_id is null then
    raise exception 'Unauthorized: user must be authenticated';
  end if;
  
  -- By default add to the recents folder
  if folder_id is null then
    folder_id := get_folder_id_under_root('Recents');
  end if;

 -- Create files records
  orig_file := create_file(orig_file_id, false, user_id, orig_file_name, folder_id);
  gen_file :=  create_file(gen_file_id, true, user_id, gen_file_name, folder_id);

  -- Create the study guide record
  insert into study_guide (user_id, orig_file_id, gen_file_id, folder_id, title)
  values (user_id, orig_file, gen_file, folder_id, title);
end;$$;


ALTER FUNCTION "public"."create_study_guide"("folder_id" "uuid", "title" "text", "orig_file_id" "uuid", "orig_file_name" "text", "gen_file_id" "uuid", "gen_file_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fetch_current_user_id"() RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result UUID;
BEGIN
  SELECT id INTO result
  FROM "user" AS u
  WHERE u.auth_user_id = auth.uid(); 

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."fetch_current_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_folder_id_under_root"("target_folder_name" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  root_folder_id uuid;
  folder_id uuid;
  curr_user_id uuid;
begin
  -- Get Root folder ID for current user
  curr_user_id := fetch_current_user_id();
  select f.folder_id into root_folder_id
  from folder_in_folder as f
  where f.user_id = curr_user_id and f.folder_name = 'Root';

  if root_folder_id is null then
    raise exception 'Root folder not found for user %', auth.uid();
  end if;

  -- Get the target folder under Root
  select f.folder_id into folder_id
  from folder_in_folder as f
  where f.user_id = curr_user_id
    and f.folder_name = target_folder_name
    and f.parent_id = root_folder_id;

  if folder_id is null then
    raise exception '% folder not found under Root for user %', target_folder_name, auth.uid();
  end if;

  return folder_id;
end;
$$;


ALTER FUNCTION "public"."get_folder_id_under_root"("target_folder_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_gen_file"("p_study_guide_id" "uuid") RETURNS TABLE("name" "text", "bucket" "text")
    LANGUAGE "plpgsql"
    AS $$BEGIN
  RETURN QUERY
  SELECT
    so1.name as name,
    so1.bucket_id as bucket
  FROM
    study_guide sg
  LEFT JOIN
    file f1 ON sg.gen_file_id = f1.id
  LEFT JOIN
    storage.objects so1 ON f1.file_id = so1.id
  WHERE
    sg.id = p_study_guide_id;
END;$$;


ALTER FUNCTION "public"."get_gen_file"("p_study_guide_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_orig_file"("p_study_guide_id" "uuid") RETURNS TABLE("name" "text", "bucket" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    so1.name as name,
    so1.bucket_id as bucket
  FROM 
    study_guide sg
  LEFT JOIN 
    file f1 ON sg.orig_file_id = f1.id
  LEFT JOIN 
    storage.objects so1 ON f1.file_id = so1.id
  WHERE
    sg.id = p_study_guide_id;
END;
$$;


ALTER FUNCTION "public"."get_orig_file"("p_study_guide_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$declare 
user_id uuid;
begin
insert into
  public.user (auth_user_id, f_name, l_name, dob)
values
  (
    new.id,
    new.raw_user_meta_data ->> 'f_name',
    new.raw_user_meta_data ->> 'l_name',
    (new.raw_user_meta_data ->> 'dob')::date
  )
  RETURNING id INTO user_id;

perform public.create_default_folders(user_id);
return new;

end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "isAIgenerated" boolean DEFAULT false NOT NULL,
    "file_id" "uuid" NOT NULL
);


ALTER TABLE "public"."file" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_in_folder" (
    "file_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "file_name" "text" NOT NULL,
    "folder_id" "uuid" NOT NULL
);


ALTER TABLE "public"."file_in_folder" OWNER TO "postgres";


COMMENT ON COLUMN "public"."file_in_folder"."user_id" IS 'Reference to user table';



CREATE TABLE IF NOT EXISTS "public"."flashcard" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone,
    "set_id" "uuid" NOT NULL,
    "answer" "json" NOT NULL,
    "question" "json" NOT NULL
);


ALTER TABLE "public"."flashcard" OWNER TO "postgres";


ALTER TABLE "public"."flashcard" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."flashcard_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."folder" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."folder" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone,
    "answer" "json" NOT NULL,
    "question" "json" NOT NULL,
    "type" "public"."quiz_type" DEFAULT 'true-false'::"public"."quiz_type" NOT NULL,
    "study_guide_id" "uuid"
);


ALTER TABLE "public"."quiz" OWNER TO "postgres";


ALTER TABLE "public"."quiz" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quiz_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."set" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone,
    "user_id" "uuid" NOT NULL,
    "folder_id" "uuid" NOT NULL,
    "study_guide_id" "uuid",
    "title" "text" NOT NULL,
    "type" "public"."set_type" DEFAULT 'flashcard'::"public"."set_type" NOT NULL
);


ALTER TABLE "public"."set" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."study_guide" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "orig_file_id" "uuid",
    "gen_file_id" "uuid",
    "folder_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "key_points" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone
);


ALTER TABLE "public"."study_guide" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "f_name" "text",
    "l_name" "text",
    "auth_user_id" "uuid" NOT NULL,
    "dob" "date"
);


ALTER TABLE "public"."user" OWNER TO "postgres";


COMMENT ON COLUMN "public"."user"."f_name" IS 'First name';



COMMENT ON COLUMN "public"."user"."l_name" IS 'Last name';



COMMENT ON COLUMN "public"."user"."auth_user_id" IS 'Reference to the supabase auth table';



COMMENT ON COLUMN "public"."user"."dob" IS 'Date of birth';



ALTER TABLE ONLY "public"."file_in_folder"
    ADD CONSTRAINT "file_in_folder_pkey" PRIMARY KEY ("user_id", "file_name", "folder_id");



ALTER TABLE ONLY "public"."file"
    ADD CONSTRAINT "file_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."flashcard"
    ADD CONSTRAINT "flashcard_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "flashcard_set_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."folder_in_folder"
    ADD CONSTRAINT "folder_in_folder_pkey" PRIMARY KEY ("user_id", "parent_id", "folder_name");



ALTER TABLE ONLY "public"."folder"
    ADD CONSTRAINT "folder_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quiz"
    ADD CONSTRAINT "quiz_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "sh_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."study_guide"
    ADD CONSTRAINT "study_guide_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "users_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."file"
    ADD CONSTRAINT "file_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "storage"."objects"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."file_in_folder"
    ADD CONSTRAINT "file_in_folder_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."file_in_folder"
    ADD CONSTRAINT "file_in_folder_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."file_in_folder"
    ADD CONSTRAINT "file_in_folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "flashcard_set_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flashcard"
    ADD CONSTRAINT "flashcard_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."set"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "flashcard_set_study_guide_id_fkey" FOREIGN KEY ("study_guide_id") REFERENCES "public"."study_guide"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."set"
    ADD CONSTRAINT "flashcard_set_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."folder_in_folder"
    ADD CONSTRAINT "folder_in_folder_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."folder_in_folder"
    ADD CONSTRAINT "folder_in_folder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."folder_in_folder"
    ADD CONSTRAINT "folder_in_folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz"
    ADD CONSTRAINT "quiz_study_guide_id_fkey" FOREIGN KEY ("study_guide_id") REFERENCES "public"."study_guide"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "sh_users_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."study_guide"
    ADD CONSTRAINT "study_guide_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."study_guide"
    ADD CONSTRAINT "study_guide_gen_file_id_fkey" FOREIGN KEY ("gen_file_id") REFERENCES "public"."file"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."study_guide"
    ADD CONSTRAINT "study_guide_orig_file_id_fkey" FOREIGN KEY ("orig_file_id") REFERENCES "public"."file"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."study_guide"
    ADD CONSTRAINT "study_guide_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable users to view their own data only" ON "public"."user" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "auth_user_id"));



ALTER TABLE "public"."file" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."file_in_folder" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "file_in_folder_rls" ON "public"."file_in_folder" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user" "u"
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."id" = "file_in_folder"."user_id")))));



CREATE POLICY "file_rls" ON "public"."file" TO "authenticated" USING (true);



ALTER TABLE "public"."flashcard" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "flashcard_rls" ON "public"."flashcard" TO "authenticated" USING (true);



ALTER TABLE "public"."folder" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."folder_in_folder" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "folder_in_folder_rls" ON "public"."folder_in_folder" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user" "u"
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."id" = "folder_in_folder"."user_id")))));



CREATE POLICY "folder_rls" ON "public"."folder" TO "authenticated" USING (true);



ALTER TABLE "public"."quiz" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "quiz_rls" ON "public"."quiz" TO "authenticated" USING (true);



ALTER TABLE "public"."set" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "set_rls" ON "public"."set" TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."study_guide" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "study_guide_rls" ON "public"."study_guide" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user" "u"
  WHERE (("u"."auth_user_id" = "auth"."uid"()) AND ("u"."id" = "study_guide"."user_id")))));



ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON SCHEMA "public" TO "vachanabk";
GRANT ALL ON SCHEMA "public" TO "kated";
GRANT ALL ON SCHEMA "public" TO "andreik";
GRANT ALL ON SCHEMA "public" TO "aravinds";
GRANT ALL ON SCHEMA "public" TO "pablor";




















































































































































































GRANT ALL ON FUNCTION "public"."create_default_folders"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_default_folders"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_default_folders"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_file"("p_file_id" "uuid", "p_is_ai_generated" boolean, "p_user_id" "uuid", "p_file_name" "text", "p_folder_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_file"("p_file_id" "uuid", "p_is_ai_generated" boolean, "p_user_id" "uuid", "p_file_name" "text", "p_folder_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_file"("p_file_id" "uuid", "p_is_ai_generated" boolean, "p_user_id" "uuid", "p_file_name" "text", "p_folder_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_flashcard_set"("set_title" "text", "flashcards" "jsonb"[], "p_folder_id" "uuid", "p_study_guide_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_flashcard_set"("set_title" "text", "flashcards" "jsonb"[], "p_folder_id" "uuid", "p_study_guide_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_flashcard_set"("set_title" "text", "flashcards" "jsonb"[], "p_folder_id" "uuid", "p_study_guide_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."folder_in_folder" TO "anon";
GRANT ALL ON TABLE "public"."folder_in_folder" TO "authenticated";
GRANT ALL ON TABLE "public"."folder_in_folder" TO "service_role";
GRANT SELECT ON TABLE "public"."folder_in_folder" TO "vachanabk";
GRANT SELECT ON TABLE "public"."folder_in_folder" TO "kated";
GRANT SELECT ON TABLE "public"."folder_in_folder" TO "andreik";
GRANT SELECT ON TABLE "public"."folder_in_folder" TO "aravinds";
GRANT SELECT ON TABLE "public"."folder_in_folder" TO "pablor";



GRANT ALL ON FUNCTION "public"."create_folder"("parent_id" "uuid", "folder_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_folder"("parent_id" "uuid", "folder_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_folder"("parent_id" "uuid", "folder_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_study_guide"("folder_id" "uuid", "title" "text", "orig_file_id" "uuid", "orig_file_name" "text", "gen_file_id" "uuid", "gen_file_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_study_guide"("folder_id" "uuid", "title" "text", "orig_file_id" "uuid", "orig_file_name" "text", "gen_file_id" "uuid", "gen_file_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_study_guide"("folder_id" "uuid", "title" "text", "orig_file_id" "uuid", "orig_file_name" "text", "gen_file_id" "uuid", "gen_file_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."fetch_current_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."fetch_current_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fetch_current_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_folder_id_under_root"("target_folder_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_folder_id_under_root"("target_folder_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_folder_id_under_root"("target_folder_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_gen_file"("p_study_guide_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_gen_file"("p_study_guide_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_gen_file"("p_study_guide_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_orig_file"("p_study_guide_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_orig_file"("p_study_guide_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_orig_file"("p_study_guide_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."file" TO "anon";
GRANT ALL ON TABLE "public"."file" TO "authenticated";
GRANT ALL ON TABLE "public"."file" TO "service_role";
GRANT SELECT ON TABLE "public"."file" TO "vachanabk";
GRANT SELECT ON TABLE "public"."file" TO "kated";
GRANT SELECT ON TABLE "public"."file" TO "andreik";
GRANT SELECT ON TABLE "public"."file" TO "aravinds";
GRANT SELECT ON TABLE "public"."file" TO "pablor";



GRANT ALL ON TABLE "public"."file_in_folder" TO "anon";
GRANT ALL ON TABLE "public"."file_in_folder" TO "authenticated";
GRANT ALL ON TABLE "public"."file_in_folder" TO "service_role";
GRANT SELECT ON TABLE "public"."file_in_folder" TO "vachanabk";
GRANT SELECT ON TABLE "public"."file_in_folder" TO "kated";
GRANT SELECT ON TABLE "public"."file_in_folder" TO "andreik";
GRANT SELECT ON TABLE "public"."file_in_folder" TO "aravinds";
GRANT SELECT ON TABLE "public"."file_in_folder" TO "pablor";



GRANT ALL ON TABLE "public"."flashcard" TO "anon";
GRANT ALL ON TABLE "public"."flashcard" TO "authenticated";
GRANT ALL ON TABLE "public"."flashcard" TO "service_role";
GRANT SELECT ON TABLE "public"."flashcard" TO "vachanabk";
GRANT SELECT ON TABLE "public"."flashcard" TO "kated";
GRANT SELECT ON TABLE "public"."flashcard" TO "andreik";
GRANT SELECT ON TABLE "public"."flashcard" TO "aravinds";
GRANT SELECT ON TABLE "public"."flashcard" TO "pablor";



GRANT ALL ON SEQUENCE "public"."flashcard_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."flashcard_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."flashcard_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."folder" TO "anon";
GRANT ALL ON TABLE "public"."folder" TO "authenticated";
GRANT ALL ON TABLE "public"."folder" TO "service_role";
GRANT SELECT ON TABLE "public"."folder" TO "vachanabk";
GRANT SELECT ON TABLE "public"."folder" TO "kated";
GRANT SELECT ON TABLE "public"."folder" TO "andreik";
GRANT SELECT ON TABLE "public"."folder" TO "aravinds";
GRANT SELECT ON TABLE "public"."folder" TO "pablor";



GRANT ALL ON TABLE "public"."quiz" TO "anon";
GRANT ALL ON TABLE "public"."quiz" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz" TO "service_role";
GRANT SELECT ON TABLE "public"."quiz" TO "vachanabk";
GRANT SELECT ON TABLE "public"."quiz" TO "kated";
GRANT SELECT ON TABLE "public"."quiz" TO "andreik";
GRANT SELECT ON TABLE "public"."quiz" TO "aravinds";
GRANT SELECT ON TABLE "public"."quiz" TO "pablor";



GRANT ALL ON SEQUENCE "public"."quiz_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quiz_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quiz_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."set" TO "anon";
GRANT ALL ON TABLE "public"."set" TO "authenticated";
GRANT ALL ON TABLE "public"."set" TO "service_role";
GRANT SELECT ON TABLE "public"."set" TO "vachanabk";
GRANT SELECT ON TABLE "public"."set" TO "kated";
GRANT SELECT ON TABLE "public"."set" TO "andreik";
GRANT SELECT ON TABLE "public"."set" TO "aravinds";
GRANT SELECT ON TABLE "public"."set" TO "pablor";



GRANT ALL ON TABLE "public"."study_guide" TO "anon";
GRANT ALL ON TABLE "public"."study_guide" TO "authenticated";
GRANT ALL ON TABLE "public"."study_guide" TO "service_role";
GRANT SELECT ON TABLE "public"."study_guide" TO "vachanabk";
GRANT SELECT ON TABLE "public"."study_guide" TO "kated";
GRANT SELECT ON TABLE "public"."study_guide" TO "andreik";
GRANT SELECT ON TABLE "public"."study_guide" TO "aravinds";
GRANT SELECT ON TABLE "public"."study_guide" TO "pablor";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";
GRANT SELECT ON TABLE "public"."user" TO "vachanabk";
GRANT SELECT ON TABLE "public"."user" TO "kated";
GRANT SELECT ON TABLE "public"."user" TO "andreik";
GRANT SELECT ON TABLE "public"."user" TO "aravinds";
GRANT SELECT ON TABLE "public"."user" TO "pablor";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES  TO "vachanabk";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES  TO "kated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES  TO "andreik";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES  TO "aravinds";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES  TO "pablor";






























RESET ALL;
