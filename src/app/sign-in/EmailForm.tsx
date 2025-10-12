"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

//email sign-in form with validation and loading states
export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: ''
  });

  useEffect(() => {
    return () => {
      if (formState.status === 'loading') {
        setFormState({ status: 'idle', message: '' });
      }
    };
  }, [formState.status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formState.status === 'loading') return;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormState({
        status: 'error',
        message: 'Please enter a valid email address'
      });
      return;
    }

    setFormState({ status: 'loading', message: 'Sending login link...' });

    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/dashboard", // relative so it stays same-origin
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = (() => {
          switch (result.error) {
            case "AccessDenied":
              return "This email is not authorized to sign in.";
            case "Verification":
              return "There was a problem sending the verification email.";
            case "EmailSignin":
              return "The sign-in link is no longer valid. Please request a new one.";
            default:
              if (process.env.NODE_ENV !== "production") {
                console.error("Sign-in error:", result.error);
              }
              return "Could not send sign-in email. Please try again.";
          }
        })();

        setFormState({
          status: 'error',
          message: errorMessage
        });
      } else {
        setFormState({
          status: 'success',
          message: 'Check your inbox for the sign-in link.'
        });
        setEmail('');
        window.location.href = '/auth/verify-request';
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setFormState({
        status: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  }

  const isLoading = formState.status === 'loading';

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </label>
        <div className="relative">
          <input
            className={`w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 ${
              formState.status === 'error' 
                ? 'border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10' 
                : formState.status === 'success' 
                ? 'border-green-500 focus:ring-green-500/20 bg-green-50 dark:bg-green-900/10' 
                : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500/20 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formState.status === 'error') {
                setFormState({ status: 'idle', message: '' });
              }
            }}
            required
            aria-label="Email address"
            aria-describedby="email-error"
            aria-invalid={formState.status === 'error'}
            disabled={isLoading}
          />
          {formState.message && (
            <p
              id="email-error"
              className={`mt-2 text-sm flex items-center gap-2 ${
                formState.status === 'error' ? 'text-red-600 dark:text-red-400' :
                formState.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
              }`}
              role="status"
              aria-live="polite"
            >
              {formState.status === 'success' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {formState.status === 'error' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {formState.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 transform ${
          isLoading 
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed scale-100' 
            : 'bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
        } text-white disabled:opacity-50`}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </div>
        ) : (
          "Continue with Email"
        )}
      </button>
    </form>
  );
}
