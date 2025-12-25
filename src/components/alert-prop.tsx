import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function AlertProp({ icon, title, description }: { icon?: React.ReactNode; title: string; description: string }) {
  return (
    <Alert>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}