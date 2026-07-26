"use client";

import * as React from "react";

export function useActiveSection(sectionIds: string[], enabled = true) {
  const [activeSection, setActiveSection] = React.useState(sectionIds[0] ?? "");

  React.useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visibleSections = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }

        const nextSection = [...visibleSections.entries()].sort(
          (left, right) => right[1] - left[1],
        )[0]?.[0];

        if (nextSection) {
          setActiveSection(nextSection);
        }
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.05, 0.25, 0.5, 0.75],
      },
    );

    for (const sectionId of sectionIds) {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [enabled, sectionIds]);

  return activeSection;
}
