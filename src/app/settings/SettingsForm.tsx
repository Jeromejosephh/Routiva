"use client";
import { useState } from 'react';

type User = { name?: string; email?: string };

export default function SettingsForm({ user }: { user: User }) {
  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');

  return (
    <form onSubmit={(e) => { e.preventDefault(); alert('Save not implemented'); }}>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
