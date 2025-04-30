import Link from "next/link";
import { ReactNode } from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithToolTip from "./UserLinkWithToolTip";

interface LinkifyProps {
  children: ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkWithToolTip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithToolTip>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link
          key={key}
          className="text-primary hover:underline"
          href={`/hashtags/${match.slice(1)}`}
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
