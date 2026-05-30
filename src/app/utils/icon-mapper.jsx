import * as LucideIcons from "lucide-react";

export function DynamicIcon({ name, className }) {
  // Attempt to grab the icon from lucide-react by name
  const IconComponent = LucideIcons[name];

  // Fallback to 'HelpCircle' if the name doesn't exist (prevents crashing)
  const TargetIcon = IconComponent || LucideIcons.HelpCircle;

  return <TargetIcon className={className} />;
}
