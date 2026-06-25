"use client";

import { Trash2 } from "lucide-react";

import { deleteCourseAction } from "@/app/admin/(protected)/courses/actions";
import { Button } from "@/components/ui/button";

type DeleteCourseDialogProps = {
  courseId: string;
  courseTitle: string;
};

export function DeleteCourseDialog({
  courseId,
  courseTitle,
}: DeleteCourseDialogProps) {
  return (
    <form
      action={deleteCourseAction.bind(null, courseId)}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete "${courseTitle}"? This cannot be undone.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <Button size="sm" type="submit" variant="ghost">
        <Trash2 aria-hidden="true" size={14} />
        Delete
      </Button>
    </form>
  );
}

