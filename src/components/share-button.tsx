"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  className?: string;
  variant?: "outline" | "default" | "ghost";
  size?: "sm" | "default" | "lg" | "icon";
  showLabel?: boolean;
}

export function ShareButton({ 
  className, 
  variant = "outline", 
  size = "sm",
  showLabel = true 
}: ShareButtonProps) {
  const handleShare = async () => {
    try {
      const shareData = {
        title: "Check out this resource on NotesBazi!",
        text: "Hey, I found this helpful study material on NotesBazi. Check it out!",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleShare}
      className={cn("rounded-xl transition-all active:scale-95", className)}
    >
      <Share2 size={16} className={cn(showLabel ? "mr-2" : "")} />
      {showLabel && "Share"}
    </Button>
  );
}
