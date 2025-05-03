import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showCloseIcon?: boolean;
}

export const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseIcon = true,
}: ResponsiveModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {showCloseIcon && (
          <DialogClose asChild>
            <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        )}

        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="pt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
