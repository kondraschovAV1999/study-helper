"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
    if (error.code === '23505') {
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
    if (error.code === '23505') {
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

export async function deleteFolder(
  folder_id: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("folder")
    .delete()
    .eq("id", folder_id);

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
