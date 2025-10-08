"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: ''
  });

  // Cleanup on unmount
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
        // Handle specific error cases
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
        setEmail(''); // Clear the form on success
        
        // Redirect to verify-request page
        window.location.href = '/auth/verify-request';
      }
    } catch (error) {
      setFormState({
        status: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  }

  const isLoading = formState.status === 'loading';

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <div className="space-y-2">
        <div className="relative">
          <input
            className={`w-full rounded border p-2 ${
              formState.status === 'error' ? 'border-red-500' : 
              formState.status === 'success' ? 'border-green-500' : 'border-gray-300'
            }`}
            type="email"
            placeholder="you@example.com"
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
              className={`mt-1 text-sm ${
                formState.status === 'error' ? 'text-red-600' :
                formState.status === 'success' ? 'text-green-600' : 'text-gray-600'
              }`}
              role="status"
              aria-live="polite"
            >
              {formState.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded py-2 transition-colors ${
          isLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
        } text-white disabled:opacity-50`}
        aria-busy={isLoading}
      >
        {isLoading ? "Sending..." : "Email me a link"}
      </button>
    </form>
  );
}
