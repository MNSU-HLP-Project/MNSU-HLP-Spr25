import { cn } from "@/lib/utils";

export function DashboardHeader({ heading, text, children, className }) {
  return (
    <div className={cn("flex items-center justify-between px-2 mb-6", className)}>
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
