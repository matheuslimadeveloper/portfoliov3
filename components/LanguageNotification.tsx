import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageNotification = () => {
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenNotification = localStorage.getItem('hasSeenLanguageNotification');
      if (!hasSeenNotification) {
        // Show notification after preloader (4 seconds)
        const timer = setTimeout(() => {
          setOpen(true);
        }, 4500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenLanguageNotification', 'true');
    }
    setOpen(false);
  };

  const handleSwitchLanguage = () => {
    toggleLanguage();
    handleClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            {language === 'en' ? 'Language / Idioma' : 'Idioma / Language'}
          </AlertDialogTitle>
          <div className="text-sm text-muted-foreground space-y-2">
            {language === 'en' ? (
              <>
                <div>This portfolio is available in English and Portuguese.</div>
                <div>You can change the language anytime using the toggle button at the top of the page.</div>
              </>
            ) : (
              <>
                <div>Este portfólio está disponível em Inglês e Português.</div>
                <div>Você pode mudar o idioma a qualquer momento usando o botão no topo da página.</div>
              </>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSwitchLanguage}
            className="w-full sm:w-auto"
          >
            {language === 'en' ? 'Switch to PT 🇧🇷' : 'Mudar para EN 🇺🇸'}
          </Button>
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            {language === 'en' ? 'Continue in English' : 'Continuar em Português'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LanguageNotification;
