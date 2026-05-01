# Supabase Setup Guide

## 1. Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New project"
3. Choose a name (e.g., "casa-nova") and a strong database password
4. Wait for the project to finish provisioning (~2 minutes)

## 2. Get Credentials

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxx.supabase.co`)
   - **anon public** key (long JWT string)

## 3. Run SQL

Go to **SQL Editor** in the Supabase dashboard and run:

```sql
-- Create reservas table
CREATE TABLE reservas (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  presente_id     TEXT        NOT NULL UNIQUE,
  nome_convidado  TEXT        NOT NULL,
  whatsapp        TEXT        NOT NULL,
  cor_escolhida   TEXT        NOT NULL
    CHECK (cor_escolhida IN ('cinza-claro', 'inox', 'off-white')),
  reservado_em    TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reservas"
  ON reservas FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reservas"
  ON reservas FOR INSERT WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE reservas;
```

## 4. Update config.js

Open `config.js` and replace the `supabase` block with your real credentials:

```js
supabase: {
  url:     "https://xxxxxxxxxxx.supabase.co",   // ← your Project URL
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // ← your anon key
},
```

## 5. Verify Connection

Open `index.html` in a browser, open DevTools console and run:

```js
const { data, error } = await supabaseClient.from('reservas').select('*')
console.log(data, error)
```

Expected: `[]` (empty array) and `null` error.

## 6. Commit and push

```bash
git add config.js
git commit -m "feat: add Supabase credentials"
git push
```
