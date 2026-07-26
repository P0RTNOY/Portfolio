export default function HomeLoading() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="border-b border-ink/10">
        <div className="page-shell flex min-h-[var(--header-height)] items-center justify-between">
          <div className="skeleton h-9 w-40" />
          <div className="skeleton h-9 w-28" />
        </div>
      </div>
      <main className="page-shell py-18 sm:py-24">
        <div className="skeleton h-4 w-64" />
        <div className="skeleton mt-8 h-20 w-full max-w-5xl sm:h-36" />
        <div className="skeleton mt-4 h-20 w-full max-w-4xl sm:h-28" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div className="skeleton h-32" key={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
