export default function CoursesLoading() {
  return (
    <main className="min-h-dvh bg-background">
      <section className="border-b border-ink/20 bg-paper">
        <div className="page-shell py-18">
          <div className="skeleton h-4 w-44" />
          <div className="skeleton mt-8 h-24 w-full max-w-4xl" />
        </div>
      </section>
      <section className="page-shell grid gap-6 py-18 md:grid-cols-2">
        {[0, 1, 2].map((item) => (
          <div className="skeleton h-96" key={item} />
        ))}
      </section>
    </main>
  );
}
