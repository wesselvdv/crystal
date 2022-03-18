select __forums_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"uuid" as "id0",
    (ids.value->>1)::"bool" as "id1"
  from json_array_elements($1::json) with ordinality as ids
) as __forums_identifiers__,
lateral (
  select
    __forums_random_user__."username" as "0",
    __forums_random_user__."gravatar_url" as "1",
    __forums_unique_author_count__.__forums_unique_author_count__::text as "2",
    (select json_agg(_) from (
      select
        __forums_featured_messages__."body" as "0"
      from app_public.forums_featured_messages(__users_most_recent_forum__) as __forums_featured_messages__
      where (
        true /* authorization checks */
      )
    ) _) as "3",
    __users_most_recent_forum__."id" as "4",
    __forums__."id" as "5",
    __forums_identifiers__.idx as "6"
  from app_public.forums as __forums__
  left outer join app_public.forums_random_user(__forums__) as __forums_random_user__
  on TRUE
  left outer join app_public.users_most_recent_forum(__forums_random_user__) as __users_most_recent_forum__
  on TRUE
  left outer join app_public.forums_unique_author_count(__users_most_recent_forum__, __forums_identifiers__."id1") as __forums_unique_author_count__
  on TRUE
  where
    (
      true /* authorization checks */
    ) and (
      __forums__."id" = __forums_identifiers__."id0"
    )
  order by __forums__."id" asc
) as __forums_result__