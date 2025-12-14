'use client';

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { completeUserProfile } from "@/lib/auth/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  )
}

export function AccountSetupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const handleSubmit = async (formData: FormData) => {
    const firstName = formData.get('firstname') as string;
    const lastName = formData.get('lastname') as string;
    const role = formData.get('role') as string;
    const department = formData.get('department') as string;

    if(!firstName || !lastName || !role || !department || firstName.trim() === '' || lastName.trim() === '' || role.trim() === '' || department.trim() === '') {
      return;
    }

    const result = await completeUserProfile(formData);

    if(result?.error) {
      console.error('Error completing user profile:', result.error);
    }
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
                defaultValue="student"
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
            
            <SubmitButton />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}