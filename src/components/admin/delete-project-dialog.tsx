"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { deleteProjectAction } from "@/app/admin/(protected)/projects/actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

type DeleteProjectDialogProps = {
  projectId: string;
  projectTitle: string;
};

export function DeleteProjectDialog({
  projectId,
  projectTitle,
}: DeleteProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleDelete() {
    setPending(true);

    try {
      await deleteProjectAction(projectId);
    } catch {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
        onClick={() => setOpen(true)}
        size="sm"
        variant="ghost"
      >
        Delete
      </Button>

      <Dialog
        onClose={() => !pending && setOpen(false)}
        open={open}
        title="Delete project"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertTriangle aria-hidden="true" size={20} />
            </div>
            <div>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-zinc-950 dark:text-white">
                  {projectTitle}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              disabled={pending}
              onClick={() => setOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
              disabled={pending}
              onClick={handleDelete}
            >
              {pending ? "Deleting..." : "Delete project"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
