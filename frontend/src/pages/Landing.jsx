import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, BookOpen, Users, Zap, Trophy, ChevronDown } from 'lucide-react'

const Landing = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CodeIIT
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">
              Sign In
            </Link>
          </div>
          <Link to="/login" className="md:hidden px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 border border-purple-400/50 rounded-full">
            <span className="text-purple-300 text-sm font-medium flex items-center gap-2">
              <Zap size={16} /> Master Coding from Anywhere
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Learn to Code Like an{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              IITian
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Interactive tutorials, real-time coding challenges, and a community of learners. Master DSA, Web Development, and more with industry experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Start Learning Free <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-purple-400/50 rounded-lg font-semibold hover:bg-purple-500/10 transition inline-flex items-center justify-center gap-2"
            >
              Explore Features <ChevronDown size={20} />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400">Problems</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">50K+</div>
              <div className="text-sm text-gray-400">Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">100+</div>
              <div className="text-sm text-gray-400">Tutorials</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            Why Choose <span className="text-purple-400">CodeIIT</span>?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 rounded-2xl hover:border-purple-400/50 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Code2 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Code Editor</h3>
              <p className="text-gray-300">
                Write, execute, and debug code instantly with support for multiple languages. See your output in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-2xl hover:border-cyan-400/50 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Structured Curriculum</h3>
              <p className="text-gray-300">
                Beginner to advanced tracks. From basics to advanced DSA, Web Dev, and competitive programming.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/20 rounded-2xl hover:border-pink-400/50 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-gray-300">
                Ask questions, share solutions, and learn from a vibrant community of passionate developers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-2xl hover:border-blue-400/50 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Gamified Learning</h3>
              <p className="text-gray-300">
                Earn badges, track progress, and compete with others. Make learning fun and rewarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Choose a Course', desc: 'Pick from our curated curriculum' },
              { num: '02', title: 'Learn & Practice', desc: 'Complete interactive tutorials and challenges' },
              { num: '03', title: 'Build Projects', desc: 'Apply skills to real-world projects' }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-bold text-purple-400/20 mb-4">{step.num}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-20 -right-4 w-8 h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            Simple, Transparent <span className="text-purple-400">Pricing</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { plan: 'Starter', price: 'Free', features: ['Basic tutorials', '5 problems/day', 'Community access'] },
              { plan: 'Pro', price: '$9.99', features: ['All tutorials', 'Unlimited problems', 'Priority support', 'Live sessions'], highlight: true },
              { plan: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Team collaboration', 'Custom content', 'Dedicated support'] }
            ].map((pricing, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl border transition ${
                  pricing.highlight
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 transform md:scale-105'
                    : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-400/20 hover:border-purple-400/50'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{pricing.plan}</h3>
                <div className="text-4xl font-bold mb-6">{pricing.price}</div>
                <ul className="space-y-4 mb-8">
                  {pricing.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition ${
                  pricing.highlight
                    ? 'bg-white text-purple-600 hover:shadow-lg'
                    : 'border border-purple-400 hover:bg-purple-500/10'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers learning from industry experts
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 border-t border-purple-400/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-purple-400">CodeIIT</h4>
              <p className="text-gray-400">Learn to code like an IITian</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Discord</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Forum</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-400/20 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CodeIIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
