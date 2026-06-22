import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags?: string[];
}

export function ToolCard({ href, icon: Icon, title, description, tags }: ToolCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-base font-semibold tracking-tight text-card-foreground">{title}</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
