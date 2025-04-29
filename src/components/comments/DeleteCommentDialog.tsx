import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "./mutations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { LoadingButton } from "../LoadingButton";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export function DeleteCommentDialog({ comment, open, onClose }: DeleteCommentDialogProps) {
  const mutation = useDeleteCommentMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();

    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          
          <LoadingButton
            variant="destructive"
            onClick={() =>
              mutation.mutate(comment.id, {
                onSuccess: () => onClose,
              })
            }
            loading={mutation.isPending}
          >
            
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}