import React from 'react';
import { Modal } from '../UI';

export const PrivacyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy" maxWidth="max-w-3xl">
      <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed overflow-y-auto max-h-[60vh] p-1">
        <p><strong>Last Updated: January 2026</strong></p>
        <p>At ClanForge, accessible from our application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ClanForge and how we use it.</p>
        
        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">1. Information We Collect</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Personal Information:</strong> Name, Email Address.</li>
          <li><strong>Profile Details:</strong> Bio, Portfolio URL, LinkedIn URL, GitHub URL, and Phone Number (Optional).</li>
          <li><strong>Authentication Data:</strong> Google OAuth tokens.</li>
        </ul>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">2. How We Use Your Information</h3>
        <p>We use the information we collect to operate our website, verify your identity via OTP or Google Sign-In, and facilitate collaboration between clan members.</p>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">3. How We Share Your Information</h3>
        <p>Your Name, Avatar, Bio, and Social Links are visible to other logged-in users when you join a squad. We do not sell your personal data to third parties.</p>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">4. Data Security</h3>
        <p>We implement appropriate security measures to protect against unauthorized access. Passwords are not stored (we use passwordless/OAuth flows), and verification tokens are short-lived.</p>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">5. Contact Us</h3>
        <p>If you have questions, contact us at: <a href="mailto:clanforge.official@gmail.com" className="text-[#FF6F00] font-bold">clanforge.official@gmail.com</a></p>
      </div>
    </Modal>
  );
};

export const TermsModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service" maxWidth="max-w-3xl">
      <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed overflow-y-auto max-h-[60vh] p-1">
        <p><strong>Last Updated: January 2026</strong></p>
        <p>Welcome to ClanForge! By accessing this website we assume you accept these terms and conditions. Do not continue to use ClanForge if you do not agree to take all of the terms and conditions stated on this page.</p>
        
        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">1. Description of Service</h3>
        <p>ClanForge is a platform designed to help students and developers find teammates ("Clans") for hackathons, sports, and events.</p>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">2. User Accounts</h3>
        <p>You must provide accurate and complete information when creating an account. We reserve the right to terminate accounts that violate our policies (e.g., spam, harassment).</p>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">3. Google OAuth</h3>
        <p>Our service uses Google Sign-In. By using this feature, you agree to be bound by Google's Terms of Service and Privacy Policy.</p>

        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">4. Limitation of Liability</h3>
        <p>In no event shall ClanForge, nor its developers, be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>
        <h3 className="text-lg font-black text-[#2D2D2D] mt-6">5. Governing Law</h3>
        <p>These Terms shall be governed and construed in accordance with the laws of India.</p>
      </div>
    </Modal>
  );
};