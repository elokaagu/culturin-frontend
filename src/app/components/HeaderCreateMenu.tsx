"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Zap } from "lucide-react";
import { Link } from "next-view-transitions";
import { useTransitionRouter } from "next-view-transitions";

import { useStudioRole } from "@/app/components/useStudioRole";
import { getCreateMenuLinks } from "@/lib/createMenuLinks";

const studioShellClass =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-neutral-200/90 bg-neutral-100/90 p-0.5 shadow-sm dark:border-white/[0.08] dark:bg-[#141414]";

const studioIconLinkClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 transition hover:bg-white hover:text-neutral-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white";

const createTriggerClass =
  "inline-flex h-8 items-center gap-1 rounded-full bg-white px-3.5 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-black/5 transition hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:bg-white dark:text-neutral-950 dark:ring-white/20 dark:hover:bg-neutral-100";

const menuContentClass =
  "z-[1250] min-w-[min(calc(100vw-2rem),20rem)] overflow-hidden rounded-2xl border border-neutral-200/95 bg-white p-1.5 shadow-xl shadow-neutral-900/10 data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:slide-in-from-top-1 dark:border-white/[0.08] dark:bg-[#161616] dark:shadow-black/40";

const itemClass =
  "flex cursor-pointer select-none items-start gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors data-[highlighted]:bg-neutral-100 data-[state=open]:bg-neutral-100 dark:data-[highlighted]:bg-white/[0.06] dark:data-[state=open]:bg-white/[0.06]";

const itemTitleClass = "text-sm font-semibold text-neutral-900 dark:text-white";
const itemDescClass = "mt-0.5 text-xs leading-snug text-neutral-500 dark:text-white/55";

export function HeaderCreateMenu() {
  const router = useTransitionRouter();
  const role = useStudioRole();

  const isAdmin = role.authenticated && role.isAdmin;
  const links = getCreateMenuLinks(isAdmin);

  const workspaceHref = !role.authenticated
    ? "/login?next=/creator"
    : role.isAdmin
      ? "/studio"
      : "/creator";

  const workspaceLabel = role.loading
    ? "Workspace"
    : role.isAdmin
      ? "Open Studio workspace"
      : "Open Creator workspace";

  return (
    <div className={studioShellClass}>
      <Link href={workspaceHref} className={studioIconLinkClass} aria-label={workspaceLabel} title={workspaceLabel}>
        <Zap className="h-4 w-4" strokeWidth={2.25} aria-hidden />
      </Link>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className={createTriggerClass} aria-haspopup="menu">
            Create
            <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={2.5} aria-hidden />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={menuContentClass}
            sideOffset={10}
            align="end"
            collisionPadding={16}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="border-b border-neutral-200/80 px-3 pb-2 pt-1.5 dark:border-white/[0.06]">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-white/45">
                Create on Culturin
              </p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-white/50">
                Publish content and lists your audience can save and return to.
              </p>
            </div>
            <div className="max-h-[min(70dvh,24rem)] overflow-y-auto py-1">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenu.Item
                    key={`${item.href}-${item.title}`}
                    className={itemClass}
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push(item.href);
                    }}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200/90 bg-neutral-50 text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/85">
                      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={itemTitleClass}>{item.title}</span>
                      <p className={itemDescClass}>{item.description}</p>
                    </span>
                  </DropdownMenu.Item>
                );
              })}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
