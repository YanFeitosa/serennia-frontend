// src/pages/auth/EmailConfirmed.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { request } from '../../lib/request';

const EmailConfirmed = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando seu email...');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // The magic link from Supabase automatically sets up the session
        // We need to wait for Supabase to process the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Session check:', { session: !!session, error: sessionError });

        if (sessionError) {
          console.error('Session error:', sessionError);
        }

        if (session?.user) {
          console.log('User is authenticated, activating collaborator...');
          
          // User is authenticated, try to activate collaborator
          try {
            const response = await request('/auth/activate-collaborator', {
              method: 'POST',
            });
            console.log('Activation response:', response);
            setStatus('success');
            setMessage('Seu email foi confirmado e sua conta está ativa!');
          } catch (activateError: any) {
            console.log('Activation error (might be already active):', activateError);
            // Even if activation fails (already active), the email was confirmed
            setStatus('success');
            setMessage('Seu email foi confirmado! Você já pode fazer login.');
          }
          
          // Sign out so user can login fresh with their password
          await supabase.auth.signOut();
        } else {
          // No session yet - wait for Supabase to process the hash
          // This can happen if we loaded before Supabase finished
          console.log('No session found, checking for hash parameters...');
          
          // Check if there's a hash in the URL (Supabase uses hash for tokens)
          const hash = window.location.hash;
          if (hash && hash.includes('access_token')) {
            console.log('Found tokens in URL, waiting for Supabase to process...');
            // Wait a bit more and retry
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData?.session?.user) {
              console.log('Session found on retry, activating...');
              try {
                await request('/auth/activate-collaborator', { method: 'POST' });
              } catch (e) {
                console.log('Activation on retry failed (might be already active)');
              }
              await supabase.auth.signOut();
              setStatus('success');
              setMessage('Seu email foi confirmado! Você já pode fazer login.');
              return;
            }
          }
          
          // Still no session - might be an old link or already processed
          setStatus('success');
          setMessage('Verificação concluída! Você já pode fazer login com sua senha.');
        }
      } catch (err) {
        console.error('Email confirmation error:', err);
        setStatus('error');
        setMessage('Ocorreu um erro ao confirmar seu email. Tente fazer login normalmente.');
      }
    };

    // Listen for auth state changes (Supabase processes the hash asynchronously)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in via auth state change, activating...');
        try {
          await request('/auth/activate-collaborator', { method: 'POST' });
          setStatus('success');
          setMessage('Seu email foi confirmado e sua conta está ativa!');
        } catch (e) {
          console.log('Activation failed (might be already active)');
          setStatus('success');
          setMessage('Seu email foi confirmado! Você já pode fazer login.');
        }
        // Sign out so user can login fresh
        await supabase.auth.signOut();
      }
    });

    // Start the confirmation process
    const timer = setTimeout(confirmEmail, 500);
    
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(124, 58, 237, 0.2)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
          style={{ background: 'rgba(59, 130, 246, 0.2)', animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div 
          className="p-8 rounded-2xl border border-white/10 backdrop-blur-xl text-center"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        >
          {/* Logo */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Serennia
          </h1>

          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <Loader2 className="w-16 h-16 mx-auto text-purple-400 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 mx-auto text-red-400" />
            )}
          </div>

          {/* Message */}
          <p className={`text-lg mb-8 ${
            status === 'success' ? 'text-green-300' : 
            status === 'error' ? 'text-red-300' : 
            'text-gray-300'
          }`}>
            {message}
          </p>

          {/* Actions */}
          {status !== 'loading' && (
            <Button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Ir para o Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmed;
