import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed recently (e.g. this session)
    if (sessionStorage.getItem('pwaPromptDismissed')) {
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-3 bg-[#0A0F0C]/95 border border-[#D4AF37]/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl w-[calc(100vw-32px)] sm:w-auto">
      <Download className="w-5 h-5 sm:w-4 sm:h-4 text-[#D4AF37] flex-shrink-0" />
      <span className="text-xs text-[#E0E7E1] flex-1 truncate">Install Madinah Ki Tamanna?</span>
      <button 
        onClick={handleInstall} 
        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:scale-105 transition-transform flex-shrink-0"
      >
        Install
      </button>
      <button 
        onClick={handleDismiss} 
        className="text-[#E0E7E1]/50 hover:text-[#E0E7E1] p-1 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
