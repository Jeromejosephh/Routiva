"use client";
import { useState } from 'react';

export default function SettingsForm({ user }: { user: any }) {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

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
