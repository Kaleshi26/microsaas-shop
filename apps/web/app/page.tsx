import { getHome } from '../lib/contentful';

export default async function Home() {
  const content = await getHome().catch(() => ({ title: 'MicroSaaS Shop', body: 'Welcome!' }));
  return (
    <section>
      <h1 className="text-3xl font-bold">{content.title}</h1>
      <p className="mt-2 text-gray-700">{content.body}</p>
    </section>
  );
}