import { SectionCards } from "../components/section-cards"

export default function DashboardPage() {
  const items = [
    {
      cardDescription: 'Documents Submitted',
      count: 5
    },
    {
      cardDescription: 'Pending Reviews',
      count: 3
    },
    {
      cardDescription: 'Approved Documents',
      count: 12
    },
    {
      cardDescription: 'Rejected Documents',
      count: 1
    }
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item) => (
        <SectionCards
          key={item.cardDescription}
          cardDescription={item.cardDescription}
          count={item.count}
        />
      ))}
    </div>
  )
}