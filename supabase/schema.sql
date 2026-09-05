-- Contact form submissions
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Allow anyone (using the anon/publishable key) to submit the contact form.
create policy "Allow public inserts"
  on public.contact_submissions
  for insert
  to anon
  with check (true);
