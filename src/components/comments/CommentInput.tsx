import { PostData } from "@/lib/types";
import { FormEvent, useState } from "react";
import { useSubmitCommentMutation } from "./mutations";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizontal } from "lucide-react";

interface CommentInputProps {
  post: PostData;
}

export function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input) return;
    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => {
          setInput("");
        },
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a comment"
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizontal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}
