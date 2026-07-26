export default function CvLoading() {
  return (
    <main className="min-h-dvh bg-background">
      <section className="border-b border-ink/20 bg-paper">
        <div className="page-shell py-18">
          <div className="skeleton h-4 w-40" />
          <div className="skeleton mt-8 h-28 w-full max-w-4xl" />
        </div>
      </section>
      <section className="page-shell py-14">
        <div className="skeleton h-[42rem] w-full" />
      </section>
    </main>
  );
}
