"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HowItWorks() {
  const features = [
    {
      title: "Anonymous Reporting",
      description: "Users can submit crime reports without revealing their identity, ensuring their safety and privacy.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "Email Verification",
      description: "Secure email verification system with OTP codes to ensure legitimate user accounts.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Role-Based Access",
      description: "Separate user and admin roles with distinct permissions and access levels.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "AI-Powered Analysis",
      description: "Advanced AI analysis of incident images to extract contextual information.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Location Tracking",
      description: "Precise location detection using Mapbox for accurate incident reporting.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive dashboard for administrators to manage reports and track incidents.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
  ];

  const authFlow = [
    {
      step: 1,
      title: "User Registration",
      description: "Users sign up with email, name, and password. Regular users receive a real OTP via email, while admin users use default OTP 111111."
    },
    {
      step: 2,
      title: "Email Verification",
      description: "Users verify their accounts using the OTP received via email (or 111111 for admins)."
    },
    {
      step: 3,
      title: "Role-Based Login",
      description: "Users log in with their verified credentials. Admins are redirected to the dashboard, regular users to the homepage."
    }
  ];

  const reportingFlow = [
    {
      step: 1,
      title: "Incident Submission",
      description: "Users submit detailed incident reports with location, type, description, and optional images."
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Uploaded images are analyzed by Google Gemini AI to extract contextual information."
    },
    {
      step: 3,
      title: "Admin Review",
      description: "Administrators review and manage reports through the comprehensive dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative px-6 pt-32 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 text-sm text-sky-400 backdrop-blur-sm shadow-md mb-6"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How It Works
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-transparent mb-6"
            >
              SafeReport System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-neutral-400 max-w-3xl mx-auto"
            >
              A comprehensive anonymous crime reporting platform with advanced security features, 
              AI-powered analysis, and role-based access control.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user privacy to create a secure reporting environment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-sky-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Authentication Flow */}
      <div className="px-6 py-20 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Authentication Flow</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Secure user authentication with role-based access control
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {authFlow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-500 font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reporting Flow */}
      <div className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Reporting Process</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              From incident submission to administrative review
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reportingFlow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="px-6 py-20 bg-neutral-900/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Built with modern technologies for security, scalability, and performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Frontend Technologies</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Next.js 14</h4>
                    <p className="text-neutral-400 text-sm">App Router for modern React development</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">TypeScript</h4>
                    <p className="text-neutral-400 text-sm">Type-safe development for reliability</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Tailwind CSS</h4>
                    <p className="text-neutral-400 text-sm">Utility-first CSS framework for responsive design</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Framer Motion</h4>
                    <p className="text-neutral-400 text-sm">Smooth animations and transitions</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Backend Technologies</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">NextAuth.js</h4>
                    <p className="text-neutral-400 text-sm">Secure authentication with JWT sessions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Prisma ORM</h4>
                    <p className="text-neutral-400 text-sm">Type-safe database client with PostgreSQL</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Google Gemini AI</h4>
                    <p className="text-neutral-400 text-sm">AI-powered image analysis for incident context</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Nodemailer</h4>
                    <p className="text-neutral-400 text-sm">Email delivery for OTP verification</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security Features</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Comprehensive security measures to protect user privacy and data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">User Privacy</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Anonymous Reporting</h4>
                    <p className="text-neutral-400 text-sm">User identity is never revealed in reports</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Encrypted Storage</h4>
                    <p className="text-neutral-400 text-sm">Sensitive data is securely hashed and stored</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Role-Based Access</h4>
                    <p className="text-neutral-400 text-sm">Separate user and admin data with distinct permissions</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Authentication Security</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">OTP Verification</h4>
                    <p className="text-neutral-400 text-sm">Email verification with time-limited codes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Password Hashing</h4>
                    <p className="text-neutral-400 text-sm">bcrypt with 12 rounds for secure password storage</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-bold">Session Management</h4>
                    <p className="text-neutral-400 text-sm">JWT-based sessions with 30-day expiration</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join our platform to help create safer communities through anonymous crime reporting
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/user/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </Link>
              <Link href="/submit-report">
                <button className="px-8 py-3 bg-neutral-800 border border-white/10 rounded-lg font-medium hover:bg-neutral-700 transition-colors">
                  Submit Report
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}