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
    <Link href={href}>
      <Card className="group h-full transition-colors hover:border-primary/50 hover:bg-primary/[0.02]">
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">{title}</h3>
          <p className="mb-4 flex-1 text-sm text-muted-foreground">{description}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
