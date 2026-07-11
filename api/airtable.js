const AT_BASE = 'https://api.airtable.com/v0/appmfStiVB53NEKoY';

export default async function handler(req, res) {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    res.status(500).json({ error: { message: 'AIRTABLE_TOKEN non configurato su Vercel' } });
    return;
  }

  const { table, id, offset } = req.query;
  if (!table) {
    res.status(400).json({ error: { message: 'Parametro table mancante' } });
    return;
  }

  let url = `${AT_BASE}/${encodeURIComponent(table)}`;
  if (id) url += `/${encodeURIComponent(id)}`;
  if (offset) url += `?offset=${encodeURIComponent(offset)}`;

  const headers = { Authorization: `Bearer ${token}` };
  if (req.method === 'POST' || req.method === 'PATCH') headers['Content-Type'] = 'application/json';

  try {
    const atRes = await fetch(url, {
      method: req.method,
      headers,
      body: (req.method === 'POST' || req.method === 'PATCH') ? JSON.stringify(req.body) : undefined,
    });
    const data = await atRes.json();
    res.status(atRes.status).json(data);
  } catch (e) {
    res.status(502).json({ error: { message: 'Errore proxy Airtable: ' + e.message } });
  }
}
