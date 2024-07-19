import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "./tooltip";

type ButtonIconProps = {
  onClick: () => void;
  title: string;
};
export function ButtonIcon({ onClick, title }: ButtonIconProps) {
  return (
    <Button
      className="m-4"
      title={title}
      variant="outline"
      size="default"
      onClick={onClick}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
