import { CommentData } from "@/lib/types";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export function CommentMoreButton({ comment, className }: CommentMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  return (
  <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash className="size-4"/>
              Delete
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteCommentDialog comment={comment} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog comment={comment} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
    );
}
