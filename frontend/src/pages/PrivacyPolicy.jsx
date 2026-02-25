import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../assets/Logo2.png';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#F4F4F5] text-[#2D2D2D] font-sans">
            <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-30">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <ArrowLeft size={20} className="text-gray-500" />
                        <span className="font-bold text-gray-500">Back to ClanForge</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-extrabold tracking-tight">Clan<span className="text-[#FF6F00]">Forge</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-black text-[#2D2D2D] tracking-tighter mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 font-medium mb-10">Last Updated: January 2026</p>

                    <div className="space-y-6 text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl">
                        <p>At ClanForge, accessible from our application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ClanForge and how we use it.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">1. Information We Collect</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Information:</strong> Name, Email Address.</li>
                            <li><strong>Profile Details:</strong> Bio, Portfolio URL, LinkedIn URL, GitHub URL, and Phone Number (Optional).</li>
                            <li><strong>Authentication Data:</strong> Google OAuth tokens.</li>
                        </ul>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">2. How We Use Your Information</h3>
                        <p>We use the information we collect to operate our website, verify your identity via OTP or Google Sign-In, and facilitate collaboration between clan members.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">3. How We Share Your Information</h3>
                        <p>Your Name, Avatar, Bio, and Social Links are visible to other logged-in users when you join a squad. We do not sell your personal data to third parties.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">4. Data Security</h3>
                        <p>We implement appropriate security measures to protect against unauthorized access. Passwords are not stored (we use passwordless/OAuth flows), and verification tokens are short-lived.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">5. Contact Us</h3>
                        <p>If you have questions, contact us at: <a href="mailto:clanforge.offical@gmail.com" className="text-[#FF6F00] font-bold hover:underline">clanforge.offical@gmail.com</a></p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
