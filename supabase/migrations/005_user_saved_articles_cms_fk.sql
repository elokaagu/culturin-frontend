-- Saved guides use cms_blogs.id (UUID as text) or static showcase article ids (non-UUID strings).
-- Legacy FK pointed at public.articles, which is not populated for CMS/showcase content.

alter table public.user_saved_articles
  drop constraint if exists user_saved_articles_article_id_fkey;

alter table public.user_saved_articles
  alter column article_id type text using article_id::text;

-- Optional: index for "list saves for user" / lookups by article
create index if not exists user_saved_articles_user_id_idx on public.user_saved_articles (user_id);
create index if not exists user_saved_articles_article_id_idx on public.user_saved_articles (article_id);
