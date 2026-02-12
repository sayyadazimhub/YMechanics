'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function ForgotPassword() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await fetch('/api/v1/mechanic/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    // Save email for next steps
    localStorage.setItem('reset_email', email);

    setSuccess('OTP sent to your email');

    setTimeout(() => {
      router.push('/mechanic/verify-reset-otp');
    }, 1000);
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">

      <div className="surface-card p-5 shadow-3 border-round w-full lg:w-4">

        <h2 className="text-center mb-4">Forgot Password</h2>

        {error && <Message severity="error" text={error} />}
        {success && <Message severity="success" text={success} />}

        <InputText
          placeholder="Enter Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-white text-black mb-3"
        />

        <Button
          label="Send OTP"
          loading={loading}
          onClick={handleSubmit}
          className="w-full"
        />

      </div>

    </div>
  );
}
