select
  (select json_agg(_._) from (
    select json_build_array(
      __forums_messages_list_set__."body",
      __forums_messages_list_set__."featured"::text,
      __forums_messages_list_set_idx__::text
    ) as _
    from app_public.forums_messages_list_set(__forums__) with ordinality as __forums_messages_list_set_tmp__ (arr, __forums_messages_list_set_idx__) cross join lateral unnest (__forums_messages_list_set_tmp__.arr) as __forums_messages_list_set__
    where (
      true /* authorization checks */
    )
  ) _) as "0"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc