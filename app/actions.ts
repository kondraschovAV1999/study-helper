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
import { createFlashcardSet } from "@/utils/ai/generate-flashcards";
import storeFile from "@/utils/file/store-file";
import { v4 as uuidv4 } from "uuid";
import deleteFromStorage from "@/utils/file/delete-from-storage";

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
export async function createStudyGuide({
  title,
  folderId,
  formFile,
  inputText,
}: {
  title: string;
  folderId?: string;
  formFile: File | null;
  inputText: string;
}) {
  const bucketName = "study-guides";
  let origFileId;
  let genFileId;
  const supabase = await createClient();
  try {
    if (!formFile && !inputText)
      throw new Error("No file nor text input provided");
    if (formFile && inputText)
      throw new Error("Both file and text input provided");

    const { data: userId, error } = await supabase.rpc("fetch_current_user_id");
    if (error) throw new Error(error.message);

    // if user doesn't specify the folder, by default it's stored in Study Guides folder
    if (!folderId) {
      let { data, error } = await supabase.rpc("get_folder_id_under_root", {
        target_folder_name: "Study Guides",
      });
      if (error) throw new Error(error.message);
      folderId = data;
    }
    let text;
    if (formFile) {
      const buffer = Buffer.from(await formFile.arrayBuffer());
      const converter = converterMap[formFile.type];
      if (!converter) throw new Error("Unsupported file type");
      text = await converter.convert(buffer);
    } else {
      formFile = new File([inputText], `inputText-${uuidv4()}`, {
        type: "text/plain",
      });
      text = inputText;
    }

    origFileId = await storeFile(formFile, bucketName, userId, supabase);
    const studyGuide = await generateStudyGuide(text);
    const studyGuideString = JSON.stringify(studyGuide);
    const arrayBuffer = new TextEncoder().encode(studyGuideString);
    const genFile = new File([arrayBuffer], `${formFile.name}-ai.json`, {
      type: "application/json",
    });

    genFileId = await storeFile(genFile, bucketName, userId, supabase);

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
    // rolling back object creation
    if (origFileId) deleteFromStorage(origFileId, supabase);
    if (genFileId) deleteFromStorage(genFileId, supabase);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Creates a flashcard set from a study guide.
 *
 * This function retrieves the original file associated with the given study guide ID,
 * extracts its content, and generates a flashcard set with the specified title and optional folder ID.
 *
 * @param studyGuideId - The unique identifier of the study guide.
 * @param title - The title of the flashcard set to be created.
 * @param folder_id - (Optional) The ID of the folder where the flashcard set will be stored.
 * @returns A promise that resolves to an object indicating the success or failure of the operation.
 *          On success, the object contains a success flag and a success message.
 *          On failure, the object contains a success flag and an error message.
 *
 */
export async function createFlashcardsFromStudyGuide(
  studyGuideId: string,
  title: string,
  folder_id?: string
) {
  try {
    const supabase = await createClient();
    if (!studyGuideId) throw new Error("Study guide id is absent");

    const { data: fileInfo, error: get_orig_file_err } = (await supabase.rpc(
      "get_orig_file",
      {
        studyGuideId,
      }
    )) as { data: { name: string; bucket: string }; error: any };

    if (get_orig_file_err) throw new Error(get_orig_file_err.message);

    if (!fileInfo)
      throw new Error(
        `Didn't find original file for stugy guide with id=${studyGuideId}`
      );

    const { data: file, error: file_err } = await supabase.storage
      .from(fileInfo.bucket)
      .download(fileInfo.name);

    if (file_err) throw new Error(file_err.message);

    const content = await file.text();
    const data = createFlashcardSet(content, title, folder_id, studyGuideId);

    return {
      success: true,
      message: "Flashcard set was successfully created",
    };
  } catch (error) {
    console.error("Error creating flashcard set from stugy guide:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Creates a flashcard set based on the provided title, file, or text input.
 *
 * @param title - The title of the flashcard set.
 * @param formFile - A file containing the content for the flashcards. Must be null if `inputText` is provided.
 * @param inputText - A string containing the content for the flashcards. Must be empty if `formFile` is provided.
 * @param folder_id - (Optional) The ID of the folder where the flashcard set will be stored.
 * @returns A promise that resolves to an object indicating the success or failure of the operation.
 *          On success: `{ success: true, message: "Flashcard set was successfully created" }`.
 *          On failure: `{ success: false, message: string }` with an error message.
 */
export async function createFlashcards(
  title: string,
  formFile: File | null,
  inputText: string,
  folder_id?: string
) {
  try {
    if (!formFile && !inputText)
      throw new Error("No file nor text input provided");
    if (formFile && inputText)
      throw new Error("Both file and text input provided");

    let text;
    if (formFile) {
      const buffer = Buffer.from(await formFile.arrayBuffer());
      const converter = converterMap[formFile.type];
      if (!converter) throw new Error("Unsupported file type");
      text = await converter.convert(buffer);
    } else {
      text = inputText;
    }
    const result = await createFlashcardSet(text, title, folder_id);

    return {
      success: true,
      message: "Flashcard set was successfully created",
    };
  } catch (error) {
    console.error("Error creating flashcard set", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createFolder(
  folder_name: string,
  parent_id: string = "00000000-0000-0000-0000-000000000000"
) {
  const supabase = await createClient();
  if (parent_id === "00000000-0000-0000-0000-000000000000") {
    const { data, error: err } = await supabase.rpc(
      "get_folder_id_under_root",
      {
        target_folder_name: "My Folders",
      }
    );
    if (err) {
      return {
        success: false,
        message: err.message,
      };
    }
    parent_id = data;
  }

  const { data, error } = await supabase.rpc("create_folder", {
    folder_name,
    parent_id,
  });

  if (error) {
    console.error("Folder creation error: ", error);
    if (error.code === "23505") {
      return {
        success: false,
        message: "A folder with this name already exists",
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Folder was successfully created",
  };
}

export interface Folder {
  id: string;
}

export interface FolderInFolder {
  folder_id: string;
  folders: Folder;
  folder_name: string;
}

export async function fetchSubFolders(
  folder_name: string,
  parent_id: string = "00000000-0000-0000-0000-000000000000"
): Promise<{
  success: boolean;
  message: string;
  content: FolderInFolder[];
}> {
  const supabase = await createClient();
  const { data: user_id, error: err_fetching_user } = await supabase.rpc(
    "fetch_current_user_id"
  );
  if (err_fetching_user) {
    return {
      success: false,
      message: err_fetching_user.message,
      content: [],
    };
  }

  if (parent_id === "00000000-0000-0000-0000-000000000000") {
    const { data, error: err } = await supabase.rpc(
      "get_folder_id_under_root",
      {
        target_folder_name: "My Folders",
      }
    );
    if (err) {
      return {
        success: false,
        content: [],
        message: err.message,
      };
    }
    parent_id = data;
  }

  const { data, error } = await supabase
    .from("folder_in_folder")
    .select("*")
    .eq("user_id", user_id)
    .eq("parent_id", parent_id);

  if (error) {
    return {
      success: false,
      content: [],
      message: error.message,
    };
  }
  return {
    success: true,
    message: "",
    content: data as FolderInFolder[],
  };
}

export async function renameFolder(
  folder_id: string,
  new_name: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("folder_in_folder")
    .update({ folder_name: new_name })
    .eq("folder_id", folder_id);

  if (error) {
    console.error("Folder rename error: ", error);
    if (error.code === "23505") {
      return {
        success: false,
        message: "A folder with this name already exists",
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Folder was successfully renamed",
  };
}

export async function deleteFolder(folder_id: string): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase.from("folder").delete().eq("id", folder_id);

  if (error) {
    console.error("Folder deletion error: ", error);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Folder was successfully deleted",
  };
}

export async function fetchUserFolders() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: user_err,
    } = await supabase.auth.getUser();

    if (user_err) {
      throw new Error("Error fetching user: ", user_err);
    }
    if (!user || user === null) throw new Error("User is not authenticated");

    const { data: my_folders_id, error: err } = await supabase.rpc(
      "get_folder_id_under_root",
      {
        target_folder_name: "My Folders",
      }
    );

    if (err) {
      throw new Error("Error fetching My Folders id: ", err);
    }

    const { data, error } = await supabase
      .from("folder_in_folder")
      .select(
        `
      id: folder_id,
      name: folder_name,
      user (
        user_id: id
      )
    `
      )
      .eq("user.auth_user_id", user.id)
      .eq("parent_id", my_folders_id);

    if (error) {
      throw new Error("Error fetching user's folders: ", error);
    }
    const folders: { id: string; name: string }[] = data.map(
      ({ user, ...rest }) => rest
    );
    return {
      success: true,
      message: "Success",
      content: folders,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      content: [],
    };
  }
}
