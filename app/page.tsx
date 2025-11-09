import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar Placeholder */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-900">Family Car Wash</div>
        <div className="space-x-6 text-sm font-medium">
          <Link href="#how-it-works" className="hover:text-blue-600">How it Works</Link>
          <Link href="#pricing" className="hover:text-blue-600">Pricing</Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Member Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Premium Car Care at <span className="text-blue-600">Your Doorstep.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            You relax. We wash. Join the hundreds of local families who never wait at a car wash again.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link href="#pricing" className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition">
              See Plans & Pricing
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 bg-white text-blue-900 text-lg font-semibold rounded-lg border border-slate-200 hover:border-blue-400 transition">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Features Grid */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="text-slate-600 mt-4">Simple, consistent, and hassle-free.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-3">Subscribe Online</h3>
            <p className="text-slate-600">Choose your plan and tell us about your vehicles in our secure dashboard.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-3">We Visit Bi-Weekly</h3>
            <p className="text-slate-600">Our trusted crew arrives on your scheduled day. No need to be home.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-3">Enjoy Your Drive</h3>
            <p className="text-slate-600">Always drive a clean car without ever lifting a finger.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Based on your model) */}
      <section id="pricing" className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 mt-4">Pause or cancel anytime from your dashboard.</p>
          </div>

          <div className="max-w-md mx-auto bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 text-center bg-blue-50 border-b">
              <h3 className="text-2xl font-bold text-blue-900">The Family Plan</h3>
              <div className="mt-4 flex justify-center items-baseline">
                <span className="text-5xl font-extrabold">$249</span>
                <span className="ml-2 text-slate-500">/month</span>
              </div>
              <p className="mt-2 text-blue-600 font-medium">+ $100/mo per additional car</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Bi-weekly visits (2 per month)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Exterior hand wash & dry
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Interior vacuum & wipe down
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Wheel & tire detailing
                </li>
              </ul>
              <button className="mt-8 w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}