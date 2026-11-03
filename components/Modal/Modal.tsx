"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useId, useRef, type ReactElement, type ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  trigger?: ReactElement;
  size?: "sm" | "md" | "lg" | "xl";
  closeLabel?: string;
  closeOnOutsideClick?: boolean;
}

const widths = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  trigger,
  size = "md",
  closeLabel = "Fermer la fenêtre",
  closeOnOutsideClick = true,
}: ModalProps) {
  const descriptionId = useId();
  const previousFocus = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={description ? descriptionId : undefined}
          onOpenAutoFocus={() => {
            previousFocus.current = document.activeElement instanceof HTMLElement
              ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            // Radix restaure le focus sur son Trigger ; sinon, utiliser l’élément d’origine.
            if (!trigger && previousFocus.current?.isConnected) {
              event.preventDefault();
              previousFocus.current.focus();
            }
          }}
          onPointerDownOutside={(event) => {
            if (!closeOnOutsideClick) event.preventDefault();
          }}
          className={`modal-content fixed left-1/2 top-1/2 z-[101] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/60 outline-none ${widths[size]}`}
        >
          <header className="shrink-0 border-b border-white/10 px-5 py-5 pr-16 sm:px-6 sm:pr-16">
            <Dialog.Title className="text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description id={descriptionId} className="mt-2 text-sm leading-relaxed text-zinc-400">
                {description}
              </Dialog.Description>
            )}
          </header>

          <Dialog.Close asChild>
            <button type="button" aria-label={closeLabel}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
              <X size={20} aria-hidden="true" />
            </button>
          </Dialog.Close>

          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {children}
          </div>

          {footer && (
            <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
              {footer}
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
