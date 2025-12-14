'use client';

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { completeUserProfile, logout } from "@/lib/auth/actions/auth";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  )
}

function LogoutButton(props: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} variant="secondary" type="button" disabled={pending}>
      {pending ? 'Logging out...' : 'Logout'}
    </Button>
  )
}

export function AccountSetupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [role, setRole] = useState<'student' | 'adviser'>('student'); 

  const handleSubmit = async (formData: FormData) => {
    const firstName = formData.get('firstname') as string;
    const lastName = formData.get('lastname') as string;
    const roleVal = formData.get('role') as string;
    const department = formData.get('department') as string;

    const thesisTitle = formData.get('thesisTitle') as string | null;
    const thesisDescription = formData.get('thesisDescription') as string | null;

    if(!firstName || !lastName || !roleVal || !department || firstName.trim() === '' || lastName.trim() === '' || roleVal.trim() === '' || department.trim() === '') {
      return;
    }

    if (roleVal === 'student') {
      if (!thesisTitle || !thesisDescription ||
          thesisTitle.trim() === '' || thesisDescription.trim() === '') {
        return;
      }
    }

    const result = await completeUserProfile(formData);

    if(result?.error) {
      console.error('Error completing user profile:', result.error);
    }
  }

  const handleLogout = async () => {
    await logout();
  }
  
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Complete Your Account Setup</CardTitle>
        <CardDescription>
          Enter additional details to finalize your account setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstname">Firstname</FieldLabel>
              <Input id="firstname" name="firstname" type="text" required/>
            </Field>
            <Field>
              <FieldLabel htmlFor="lastname">Lastname</FieldLabel>
              <Input id="lastname" name="lastname" type="text" required/>
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <select
                id="role"
                name="role"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'adviser')}
              >
                <option value="student">Student</option>
                <option value="adviser">Adviser</option>
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="department">Department</FieldLabel>
              <select
                id="department"
                name="department"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue="dcst"
              >
                <option value="dcst">Department of Computer Science and Technology</option>
                <option value="dce">Department of Civil Engineering</option>
              </select>
            </Field>

            {role === 'student' && (
              <>
                <Field>
                  <FieldLabel htmlFor="thesisTitle">Thesis Title</FieldLabel>
                  <Input id="thesisTitle" name="thesisTitle" type="text" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="thesisDescription">Thesis Description</FieldLabel>
                  <Textarea
                    id="thesisDescription"
                    name="thesisDescription"
                    rows={4}
                    required
                  />
                </Field>
              </>
            )}
            
            <SubmitButton />
            <LogoutButton onClick={() => handleLogout()} />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}