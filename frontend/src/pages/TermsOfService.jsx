import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../assets/Logo2.png';

const TermsOfService = () => {
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
                    <h1 className="text-3xl md:text-5xl font-black text-[#2D2D2D] tracking-tighter mb-4">Terms of Service</h1>
                    <p className="text-gray-400 font-medium mb-10">Last Updated: January 2026</p>

                    <div className="space-y-6 text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl">
                        <p>Welcome to ClanForge! By accessing this website we assume you accept these terms and conditions. Do not continue to use ClanForge if you do not agree to take all of the terms and conditions stated on this page.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">1. Description of Service</h3>
                        <p>ClanForge is a platform designed to help students and developers find teammates ("Clans") for hackathons, sports, and events.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">2. User Accounts</h3>
                        <p>You must provide accurate and complete information when creating an account. We reserve the right to terminate accounts that violate our policies (e.g., spam, harassment).</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">3. Google OAuth</h3>
                        <p>Our service uses Google Sign-In. By using this feature, you agree to be bound by Google's Terms of Service and Privacy Policy.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">4. Limitation of Liability</h3>
                        <p>In no event shall ClanForge, nor its developers, be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>

                        <h3 className="text-xl font-black text-[#2D2D2D] mt-8">5. Governing Law</h3>
                        <p>These Terms shall be governed and construed in accordance with the laws of India.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsOfService;
