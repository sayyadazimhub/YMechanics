'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function LoginPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {

    setLoading(true);
    setError('');

    const res = await fetch('/api/v1/mechanic/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    localStorage.setItem('token', data.data.token);

    router.push('/mechanic/dashboard');
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen surface-900" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>

      <div className="surface-card p-5 shadow-3 border-round w-full lg:w-5">

        <h2 className="text-center font-bold text-2xl mb-5">Mechanic Login</h2>

        {error && <Message severity="error" text={error} />}

        <div className="flex flex-column gap-4 mt-4">

          <InputText
            placeholder="Username"
            value={form.username}
            onChange={e => handleChange('username', e.target.value)}
            className='text-black bg-white'
          />

          <Password
            placeholder="Password"
            value={form.password}
            feedback={false}
            toggleMask
            onChange={e => handleChange('password', e.target.value)}
            inputClassName='w-full text-black'
            className='w-full text-black'
          />
          <Button
            label="Forgot Password?"
            link
            className="text-white p-0 mt-2 self-end"
            onClick={() => router.push('/mechanic/forgot-password')}
          />

          <Button
            className='mt-2'
            label="Login"
            icon="pi pi-sign-in"
            loading={loading}
            onClick={handleSubmit}
          />

        </div>

      </div>

    </div>
  );
}
