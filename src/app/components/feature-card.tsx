export function FeatureCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }){
  return (
    <div className="p-6 bg-card rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-md text-primary">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}