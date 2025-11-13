import { AccountSetupForm } from "@/components/account-setup";

export default function AccountSetupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AccountSetupForm />
      </div>
    </div>
  )
}