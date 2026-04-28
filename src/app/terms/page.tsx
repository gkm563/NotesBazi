export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Last updated: April 21, 2026</p>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using NotesBazi, you agree to comply with and be bound by these Terms and Conditions. 
            If you do not agree, please do not use the service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. User Eligibility</h2>
          <p>
            NotesBazi is primarily intended for students and faculty of United Institute of Technology, Prayagraj. 
            You must provide accurate information when creating an account.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Content Guidelines</h2>
          <p>When uploading resources, you agree that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The content is related to academic studies at UIT Prayagraj.</li>
            <li>You have the right to share the content.</li>
            <li>The content does not contain harmful code, offensive material, or copyrighted data that you are not authorized to share.</li>
            <li>You will not upload spam or duplicate content.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Prohibited Activities</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Harass other users through the comment system.</li>
            <li>Attempt to scrape or reverse engineer the platform.</li>
            <li>Use the platform for any illegal activities.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
          <p>
            NotesBazi is provided "as is" without any warranties. 
            We are not responsible for the accuracy or quality of user-uploaded content.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. 
            Continued use of the platform after changes constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </main>
  );
}
