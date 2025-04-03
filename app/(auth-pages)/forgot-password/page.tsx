import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="w-full max-w-md"> 
      <div className="bg-card rounded-lg shadow-sm border p-8">
        <form className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-m text-muted-foreground mt-2">
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="block text-base font-medium mb-2">Email</Label>
              <Input 
                name="email" 
                placeholder="Enter your email address" 
                required 
                className="w-full bg-secondary border rounded-lg p-4 text-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <SubmitButton 
              formAction={forgotPasswordAction}
              className="w-full"
              pendingText="Sending link..."
            >
              Reset Password
            </SubmitButton>

            <FormMessage message={searchParams} />
          </div>
          
          {/* Link to login page */}
          <p className="text-center text-m text-muted-foreground">
            Remember your password?{" "}
            <Link 
              href="/login" 
              className="text-primary underline hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
      
      {/* SMTP message moved inside card for better visual grouping */}
      <div className="mt-6">
        <SmtpMessage />
      </div>
    </div>
  );
}
