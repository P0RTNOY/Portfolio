import { GraduationCap } from "lucide-react";

import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Course } from "@/lib/courses";

type CoursesGridProps = {
  courses: Course[];
};

export function CoursesGrid({ courses }: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <EmptyState
        description="Course records will appear here after they are added from the admin dashboard."
        icon={GraduationCap}
        title="No courses yet"
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}
    </div>
  );
}

