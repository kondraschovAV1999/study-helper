"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FileToTextConverter } from "@/utils/file-converters/file-converter";
import { PdfToTextConverter } from "@/utils/file-converters/pdf-converter";
import { DocsxToTextConverter } from "@/utils/file-converters/docx-converter";
import { PptxToTextConverter } from "@/utils/file-converters/pptx-converter";
import { generateStudyGuide } from "@/utils/ai/generate-study-guide";
import storeFile from "@/utils/file/store-file";

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const birthDay = formData.get("birthDay")?.toString().padStart(2, "0");
  const birthMonth = formData.get("birthMonth")?.toString().padStart(2, "0");
  const birthYear = formData.get("birthYear") as string;
  const dob = new Date(
    `${birthYear}-${birthMonth}-${birthDay}T00:00:00Z`
  ).toISOString();

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        f_name: firstName,
        l_name: lastName,
        dob: dob,
      },
    },
  });

  if (authError) {
    console.error("Auth error:", authError);
    return {
      success: false,
      message: authError.message,
    };
  }

  if (authData.user?.identities?.length === 0) {
    return {
      success: false,
      message: "User with this email address already exists",
    };
  }

  return {
    success: true,
    message:
      "Thanks for signing up! Please check your email for a verification link.",
  };
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Login successful",
  };
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

/**
 * Retrieves the currently authenticated user from Supabase
 *
 * @returns Promise<User | null> - The authenticated user object or null if no user is authenticated
 * @throws Error if there's an error retrieving the user
 */
export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};

const converterMap: Record<string, FileToTextConverter> = {
  "application/pdf": new PdfToTextConverter(),
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    new DocsxToTextConverter(),
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    new PptxToTextConverter(),
};

/**
 * Creates a study guide from an uploaded file
 *
 * @param formData - Form data containing:
 *   - folderId: The ID of the folder to store the files in
 *   - title: The title of the study guide
 *   - file: The file to generate the study guide from
 *
 * @returns Promise<{success: boolean, message: string}>
 *   - success: Whether the operation was successful
 *   - message: A description of the result or error
 *
 * The function:
 * 1. Validates the user is authenticated
 * 2. Converts the uploaded file to text using an appropriate converter
 * 3. Generates an AI study guide from the text
 * 4. Stores both the original and generated files in Supabase storage
 * 5. Creates a study guide record linking the files
 *
 */
export async function createStudyGuide(formData: FormData) {
  const bucketName = "study-guide";
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error("User not authenticated");

    const folderId = formData.get("folderId") as string;
    const title = formData.get("title") as string;
    const formFile = formData.get("file") as File;

    const buffer = Buffer.from(await formFile.arrayBuffer());
    const converter = converterMap[formFile.type];

    if (!converter) throw new Error("Unsupported file type");

    const origFileId = await storeFile(formFile, bucketName, user.id, supabase);

    const text = await converter.convert(buffer);
    const studyGuide = await generateStudyGuide(text);
    const studyGuideString = JSON.stringify(studyGuide);
    const arrayBuffer = new TextEncoder().encode(studyGuideString);
    const genFile = new File([arrayBuffer], `${formFile.name}-ai.json`, {
      type: "application/json",
    });

    const genFileId = await storeFile(genFile, bucketName, user.id, supabase);

    const { error: rpcError } = await supabase.rpc("create_study_guide", {
      orig_file_id: origFileId,
      gen_file_id: genFileId,
      folder_id: folderId,
      title: title,
      orig_file_name: formFile.name,
      gen_file_name: genFile.name,
    });

    if (rpcError) throw new Error(rpcError.message);

    return {
      success: true,
      message: "Study guide created successfully",
    };
  } catch (error) {
    console.error("Error creating study guide:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
