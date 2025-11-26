// src/components/ui/Modal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'glass';
}

const Modal = ({ isOpen, onClose, title, children, variant = 'default' }: ModalProps) => {
  const cardClasses = variant === 'glass' 
    ? 'glass-card shadow-elevated w-full max-w-lg p-6 relative'
    : 'bg-card rounded-xl shadow-xl w-full max-w-lg p-6 relative border border-border';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={cardClasses}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <header className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-text">{title}</h2>
              <Button variant="ghost" onClick={onClose} className="p-1 rounded-full">
                <X className="w-5 h-5 text-text-muted" />
              </Button>
            </header>
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
