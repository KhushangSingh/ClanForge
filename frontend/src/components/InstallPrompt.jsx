import React, { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [showIosGuide, setShowIosGuide] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Detect if already installed to not show
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleShortcutGuide = () => {
        // For browsers that don't support the prompt (like iOS Safari) or if user wants "Shortcut" specifically
        // We can show a tooltip or modal explaining how to do it manually.
        // Since we can't programmatically "Create Shortcut" distinct from Install, we guide them.
        alert("To create a shortcut manually:\n1. Tap the browser options menu (⋮ or Share icon)\n2. Select 'Add to Home Screen'");
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96"
            >
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/pwa-icon.png" alt="ClanForge" className="w-12 h-12 rounded-xl" />
                            <div>
                                <h4 className="font-bold text-white text-sm">Install ClanForge</h4>
                                <p className="text-xs text-gray-400">Add to home screen for quick access</p>
                            </div>
                        </div>
                        <button onClick={() => setShowPrompt(false)} className="text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                            onClick={handleInstallClick}
                            className="bg-[#FF6F00] hover:bg-[#ff8f00] text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download size={14} />
                            Install App
                        </button>
                        <button
                            onClick={handleShortcutGuide}
                            className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Share size={14} /> // Using Share icon as generic "Action"
                            Create Shortcut
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPrompt;
