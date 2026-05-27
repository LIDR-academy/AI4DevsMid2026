import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Kanban Pipeline',
      description: 'Organize candidates through customizable interview stages. Drag, drop, and move seamlessly.',
      icon: '▬'
    },
    {
      title: 'Smart Candidate Profiles',
      description: 'Complete candidate data with education, work experience, CV uploads, and interview history.',
      icon: '▬'
    },
    {
      title: 'Interview Flow Management',
      description: 'Configure position-specific interview processes with multiple stages and interview types.',
      icon: '▬'
    },
    {
      title: 'Real-time Position Tracking',
      description: 'View all positions, candidate counts, and pipeline progress at a glance.',
      icon: '▬'
    }
  ];

  const benefits = [
    { text: 'Faster hiring cycles with organized pipelines' },
    { text: 'Never lose candidate information—centralized and searchable' },
    { text: 'Clear visibility into interview stages and progress' },
    { text: 'Customizable workflows for every position and team' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-arimo">
      {/* Navigation */}
      <nav className="border-b-2 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-12 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold font-hanken tracking-tight">LTI</div>
          <button
            onClick={() => navigate('/positions')}
            className="px-6 py-2 bg-yellow-300 border-2 border-black font-bold font-hanken text-sm hover:bg-black hover:text-yellow-300 transition-none"
          >
            DASHBOARD
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b-2 border-black bg-white px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-hanken text-7xl font-black leading-tight tracking-tight mb-8" style={{ fontSize: '72px', lineHeight: '72px' }}>
            Recruitment<br />Management<br />Built for Speed
          </h1>
          <p className="text-xl font-arimo text-gray-700 mb-12 max-w-2xl leading-relaxed">
            LTI is the applicant tracking system built on brutalist principles. No fluff. No confusion. Just a transparent, efficient platform for managing your hiring pipeline.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/positions')}
              className="px-8 py-4 bg-yellow-300 border-2 border-black font-bold font-hanken text-base hover:bg-black hover:text-yellow-300 transition-none"
            >
              GET STARTED
            </button>
            <button
              className="px-8 py-4 bg-white border-2 border-black font-bold font-hanken text-base hover:bg-black hover:text-white transition-none"
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b-2 border-black bg-gray-100 px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-hanken text-5xl font-black mb-16 tracking-tight" style={{ fontSize: '48px' }}>
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="border-2 border-black bg-white p-8">
                <div className="text-4xl font-hanken mb-4 text-gray-900">{feature.icon}</div>
                <h3 className="font-hanken font-bold text-xl mb-4 tracking-tight">{feature.title}</h3>
                <p className="font-arimo text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-b-2 border-black bg-white px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-hanken text-5xl font-black mb-16 tracking-tight" style={{ fontSize: '48px' }}>
            Why LTI
          </h2>
          <div className="space-y-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-6 border-b-2 border-black pb-6">
                <div className="text-3xl font-hanken font-black text-gray-400">■</div>
                <p className="font-arimo text-lg text-gray-800">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b-2 border-black bg-gray-100 px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-hanken text-5xl font-black mb-16 tracking-tight" style={{ fontSize: '48px' }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Create Positions', desc: 'Define interview flows and stages for each role' },
              { step: '02', title: 'Add Candidates', desc: 'Upload CVs and candidate information' },
              { step: '03', title: 'Manage Pipeline', desc: 'Move candidates through interview stages' },
              { step: '04', title: 'Track Progress', desc: 'Monitor hiring metrics and timelines' }
            ].map((item, idx) => (
              <div key={idx} className="border-2 border-black bg-white p-6">
                <div className="font-space text-sm font-bold text-gray-600 mb-3">{item.step}</div>
                <h3 className="font-hanken font-bold text-lg mb-2">{item.title}</h3>
                <p className="font-arimo text-sm text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-hanken text-6xl font-black mb-6 tracking-tight" style={{ fontSize: '48px' }}>
            Ready to Transform Your Hiring?
          </h2>
          <p className="font-arimo text-lg mb-12 text-gray-200 leading-relaxed">
            LTI brings clarity and efficiency to your recruitment process. No distractions. No confusion. Just results.
          </p>
          <button
            onClick={() => navigate('/positions')}
            className="px-8 py-4 bg-yellow-300 border-2 border-yellow-300 font-bold font-hanken text-black text-base hover:bg-white transition-none"
          >
            START USING LTI TODAY
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b-2 border-black pb-12 mb-8">
            <div>
              <h3 className="font-hanken font-bold mb-4 tracking-tight">Product</h3>
              <ul className="space-y-2 font-arimo text-sm text-gray-700">
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:underline">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-hanken font-bold mb-4 tracking-tight">Company</h3>
              <ul className="space-y-2 font-arimo text-sm text-gray-700">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-hanken font-bold mb-4 tracking-tight">Legal</h3>
              <ul className="space-y-2 font-arimo text-sm text-gray-700">
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Terms</a></li>
                <li><a href="#" className="hover:underline">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-hanken font-bold mb-4 tracking-tight">Follow</h3>
              <ul className="space-y-2 font-arimo text-sm text-gray-700">
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">LinkedIn</a></li>
                <li><a href="#" className="hover:underline">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center font-arimo text-sm text-gray-600">
            <p>© 2026 LTI. All rights reserved.</p>
            <p className="font-space">Built with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
