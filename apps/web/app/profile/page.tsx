// apps/web/app/profile/page.tsx

import { getSession } from '@auth0/nextjs-auth0';
export default async function Profile() {
  const session = await getSession();
  if (!session) return <a href="/api/auth/login">Login</a>;
  return (
    <div>
      <h2 className="text-2xl font-semibold">Profile</h2>
      <pre className="bg-gray-100 p-4 rounded mt-4">{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
}