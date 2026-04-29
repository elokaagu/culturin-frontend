-- Videos added in 013 were seeded with null playback_id; use the same demo Mux asset as 009/showcase so stream + rails play inline.

update public.cms_videos
set playback_id = 'Hf9691bovUrlcAHV2CIqHm1uwUGmZJAg00tUvz2geu8s'
where playback_id is null
  and slug in (
    'demo-film-jordan-desert-road',
    'demo-film-bourdain-market-bite',
    'demo-film-cape-town-scenic-drive',
    'demo-film-sicily-first-trip',
    'demo-film-lagos-coastline-night',
    'demo-film-barcelona-golden-alleys'
  );
