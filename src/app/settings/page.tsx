import { requireUser } from '@/lib/auth-helpers';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const user = await requireUser('/settings');

  return (
    <div>
      <h1>Settings</h1>
      <SettingsForm user={user as any} />
    </div>
  );
}
