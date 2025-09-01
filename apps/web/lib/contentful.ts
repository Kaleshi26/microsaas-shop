export async function getHome() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_DELIVERY_TOKEN;
  if (!space || !token) return { title: 'MicroSaaS Shop', body: 'Welcome!' };
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${space}/environments/master/entries?content_type=home`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  const item = data.items?.[0];
  return { title: item?.fields?.title || 'MicroSaaS Shop', body: item?.fields?.body || 'Welcome!' };
}