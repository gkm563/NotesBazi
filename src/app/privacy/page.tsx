export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Last updated: April 21, 2026</p>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p>
            Welcome to NotesBazi. We value your privacy and are committed to protecting your personal data. 
            This policy explains how we collect and use information when you use our platform for United Institute of Technology, Prayagraj.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, and profile details provided during signup.</li>
            <li><strong>Content:</strong> Any academic resources (PDF, DOCX) you upload to the platform.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with the platform (downloads, views, searches).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. How We Use Data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain the NotesBazi service.</li>
            <li>Enable you to share and download academic resources.</li>
            <li>Personalize your experience and dashboard.</li>
            <li>Improve our platform using AI-driven insights (summaries, keywords).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Data Storage</h2>
          <p>
            Your data is securely stored using Supabase (PostgreSQL and Cloud Storage). 
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your data at any time through your user dashboard or by contacting us.
          </p>
        </section>
      </div>
    </main>
  );
}
