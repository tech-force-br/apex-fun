export default function Home() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium tracking-[0.22em] text-accent uppercase">
        ApexFun
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        Teach Apex fundamentals with little theory and many small, checked
        exercises.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        Students type real Apex. The site runs it. Nobody needs a Salesforce
        org.
      </p>
    </main>
  );
}
