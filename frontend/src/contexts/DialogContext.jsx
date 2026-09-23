import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, LogOut } from 'lucide-react';

const DialogContext = createContext();

export function useDialog() {
  return useContext(DialogContext);
}

export function DialogProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm' | 'prompt'
    title: '',
    message: '',
    iconType: 'info', // 'info' | 'success' | 'warning' | 'error'
    defaultValue: '',
    confirmText: 'OK',
    cancelText: 'Batal',
  });

  const [promptValue, setPromptValue] = useState('');
  
  // Use refs to store the promise resolvers
  const resolveRef = useRef(null);

  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    // Wait for animation to finish before clearing
    setTimeout(() => {
      setPromptValue('');
      resolveRef.current = null;
    }, 300);
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState.type === 'prompt') {
      resolveRef.current?.(promptValue);
    } else {
      resolveRef.current?.(true);
    }
    closeDialog();
  }, [dialogState.type, promptValue, closeDialog]);

  const handleCancel = useCallback(() => {
    if (dialogState.type === 'prompt') {
      resolveRef.current?.(null);
    } else {
      resolveRef.current?.(false);
    }
    closeDialog();
  }, [dialogState.type, closeDialog]);

  const showAlert = useCallback(({ title, message, type = 'info' }) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialogState({
        isOpen: true,
        type: 'alert',
        title,
        message,
        iconType: type,
        confirmText: 'OK'
      });
    });
  }, []);

  const showConfirm = useCallback(({ title, message, type = 'warning', confirmText = 'Lanjut', cancelText = 'Batal' }) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialogState({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        iconType: type,
        confirmText,
        cancelText
      });
    });
  }, []);

  const showPrompt = useCallback(({ title, message, defaultValue = '', confirmText = 'Simpan', cancelText = 'Batal' }) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setPromptValue(defaultValue);
      setDialogState({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        iconType: 'info',
        defaultValue,
        confirmText,
        cancelText
      });
    });
  }, []);

  // Keyboard support for Enter and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!dialogState.isOpen) return;
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && dialogState.type !== 'prompt') {
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogState.isOpen, handleConfirm, handleCancel]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      
      {dialogState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div 
            className="bg-[var(--bg-card)] border-t sm:border border-[var(--border-color)] rounded-t-[32px] sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-sm overflow-hidden animate-drawer-up pb-[env(safe-area-inset-bottom)] sm:pb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar for mobile bottom sheet */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-4 mb-2 sm:hidden"></div>
            
            <div className="p-6 pt-2 sm:pt-6 text-center">
              <div className="flex flex-col items-center gap-4">
                {dialogState.iconType === 'info' && <div className="text-blue-600"><Info size={40} strokeWidth={1.5} /></div>}
                {dialogState.iconType === 'success' && <div className="text-emerald-600"><CheckCircle size={40} strokeWidth={1.5} /></div>}
                {dialogState.iconType === 'warning' && <div className="text-orange-600"><AlertTriangle size={40} strokeWidth={1.5} /></div>}
                {dialogState.iconType === 'error' && <div className="text-red-600"><XCircle size={40} strokeWidth={1.5} /></div>}
                {dialogState.iconType === 'logout' && <div className="text-[var(--text-primary)]"><LogOut size={40} strokeWidth={1.5} /></div>}
                
                <div className="w-full">
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight">{dialogState.title}</h3>
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed break-words px-4">
                    {dialogState.message}
                  </p>
                  
                  {dialogState.type === 'prompt' && (
                    <div className="mt-5">
                      <input
                        type="text"
                        autoFocus
                        value={promptValue}
                        onChange={(e) => setPromptValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirm();
                        }}
                        className="form-control !min-h-12 !py-2 text-center"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex w-full gap-3">
                {(dialogState.type === 'confirm' || dialogState.type === 'prompt') && (
                  <button 
                    onClick={handleCancel}
                    className="flex-1 py-3 text-sm font-bold text-[var(--text-primary)] bg-white dark:bg-[#1a1a1a] border border-[var(--border-color)] rounded-2xl transition-colors active:scale-95"
                  >
                    {dialogState.cancelText}
                  </button>
                )}
                <button 
                  onClick={handleConfirm}
                  className={`flex-1 py-3 text-sm font-bold text-white rounded-2xl transition-transform active:scale-95 shadow-sm ${
                    dialogState.iconType === 'error' || dialogState.iconType === 'logout' ? 'bg-red-600 hover:bg-red-700' :
                    dialogState.iconType === 'warning' ? 'bg-orange-600 hover:bg-orange-700' :
                    dialogState.iconType === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    'bg-[var(--primary-500)] hover:brightness-110'
                  }`}
                >
                  {dialogState.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
