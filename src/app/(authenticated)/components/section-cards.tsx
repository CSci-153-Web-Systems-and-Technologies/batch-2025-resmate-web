import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File } from "lucide-react";

type SectionCardProps = {
  cardDescription: string;
  count: number;
}

export function SectionCards({
  cardDescription,
  count 
}: SectionCardProps ) {
  return (
    <Card className="@container-card bg-white">
      <CardHeader>
        <CardDescription className="text-lg">{cardDescription}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {count}
        </CardTitle>
        <CardAction>
          <File />
        </CardAction>
      </CardHeader>
    </Card>
  )
}