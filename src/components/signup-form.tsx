"use client"

import { signup } from "@/lib/auth/actions/auth"
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
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating account..." : "Create Account"}
    </Button>
  )
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const [error, setError] = useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if(password !== confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match.");
      return;
    }

    if(password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setPasswordMatch(true);
    setError(null);

    try {
      await signup(formData);
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                minLength={8} 
                required 
                className={error && !passwordMatch ? "border-red-500" : ""}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
                id="confirm-password" 
                name="confirm-password" 
                type="password" 
                minLength={8}
                required 
                className={!passwordMatch ? "border-red-500" : ""}
              />
              <FieldDescription className={!passwordMatch ? "text-red-500" : ""}>
                {!passwordMatch ? "Passwords do not match" : "Please confirm your password."}
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <SubmitButton />
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
