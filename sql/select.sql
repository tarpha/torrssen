SELECT no
     , regexp_replace(title, '/(\.torrent|\.mkv|\.mp4|\.tp|\.ts)/', '', 'ig') AS title
     , link
     , regexp_replace(rss_title, '/(\.torrent|\.mkv|\.mp4|\.tp|\.ts|360p|720p|1080p)/', '', 'ig') AS rss_title
     , rss_episode
     , rss_season
     , rss_quality
     , rss_release_group
     , 0 AS tid
     , '' AS target
FROM  "RSS"
WHERE  title LIKE concat('%', $1::text, '%')
ORDER BY no DESC
OFFSET $2 LIMIT $3
