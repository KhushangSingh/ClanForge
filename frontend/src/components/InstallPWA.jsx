import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const onClick = (evt) => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
    };

    if (!supportsPWA) {
        return null;
    }

    return (
        <button
            className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-orange-700 transition-all z-50 animate-bounce"
            onClick={onClick}
        >
            <Download size={20} />
            Install App
        </button>
    );
};

export default InstallPWA;
