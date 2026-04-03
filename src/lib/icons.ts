import * as LucideIcons from "lucide-react";

export function getIcon(name: string) {
  return (LucideIcons as any)[name] || LucideIcons.Package;
}
