'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function VerifyOtp() {

  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('reset_email');

    if (!email) {
      router.push('/mechanic/login');
    }
  }, []);

  const handleVerify = async () => {

    setLoading(true);
    setError('');

    const email = localStorage.getItem('reset_email');

    const res = await fetch('/api/v1/mechanic/verify-reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    // Save OTP for reset
    localStorage.setItem('reset_otp', otp);

    router.push('/mechanic/reset-password');
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">

      <div className="surface-card p-5 shadow-3 border-round w-full lg:w-4">

        <h2 className="text-center mb-4">Verify OTP</h2>

        {error && <Message severity="error" text={error} />}

        <InputText
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          className="w-full bg-white text-black mb-3"
        />

        <Button
          label="Verify OTP"
          loading={loading}
          onClick={handleVerify}
          className="w-full"
        />

      </div>

    </div>
  );
}
