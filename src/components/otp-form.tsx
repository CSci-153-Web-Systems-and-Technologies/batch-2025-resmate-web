'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertProp } from "./alert-prop";
import { createClient } from "@/utils/supabase/client";

export function OTPForm({ email, ...props }: React.ComponentProps<typeof Card> & { email: string }) {
  const router = useRouter();

  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerifyOTP = async () => {
    const trim = code.trim();

    if(trim.length !== 6) {
      // <AlertProp title="Invalid Code" description="Please enter a valid 6-digit code." />
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsVerifying(true)
    setError(null);

    try { 
      const supabase = createClient()

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: trim,
        type: 'signup',
      });

      if (verifyError) {
        setError(verifyError.message || "Failed to verify code. Please try again.")
        return;
      }

      router.push('/setup'); // Redirect to dashboard or desired page upon success
    } catch(e) {
      console.error("Unexpected OTP verification error:", e)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleVerifyOTP();
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <InputOTP 
                maxLength={6} 
                id="otp" 
                required
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
              {error && <AlertProp title="Invalid Code" description={error} />}
            </Field>
            <FieldGroup>
              <Button type="submit" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>

              <Button variant="secondary" type="button" onClick={() => router.push('/login')}>Back to Login</Button>
              <FieldDescription className="text-center">
                Didn&apos;t receive the code? <a href="#">Resend</a>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
