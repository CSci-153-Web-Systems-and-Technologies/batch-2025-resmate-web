import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export function AccountSetupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Complete Your Account Setup</CardTitle>
        <CardDescription>
          Enter additional details to finalize your account setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
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
              <Input id="role" name="role" type="text" required/>
            </Field>
            <Field>
              <FieldLabel htmlFor="department">Department</FieldLabel>
              <Input id="department" name="department" type="text" required/>
            </Field>
            <Field>
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}