import { PostData } from "@/lib/types";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DeletePostDialog } from "./DeletePostDialog";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}

export function PostMoreButton({ post, className }: PostMoreButtonProps) {
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
            <DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
    );
}
