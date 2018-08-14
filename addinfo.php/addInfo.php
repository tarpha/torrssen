<?php
	/**
	 * 기존 RSS feed에 tvdb(https://www.thetvdb.com/)정보를 넣어줍니다.
	 *
	 * Usage: http://<ADDRESS>:<PORT>/<PATH>/addInfo.php?rss=<RSS URL>&<RSS PARAM 1>=<VALUE>&<RSS PARAM 2>=<VALUE>....
	 *
	 * Input:
	 *   - rss: RSS feed 주소 (http://localhost/rss.php)
	 *   - *  : rss를 제외한 모든 입력값을 RSS 주소로 넘겨줍니다.
	 * Output:
	 *   - TVDB 정보가 추가된 RSS feed
	 *       추가된 Field:
	 *         - tvdb_id: tvdb ID
	 *         - tvdb_series_name: tvdb에서 제공하는 시리즈 제목(한글)
	 *         - rss_title: 정제된 형식의 순수 시리즈 제목
	 *         - rss_en_name:
	 *             tvdb에서 제공하는 시리즈 영문 제목에 에피소드, 릴그룹, 화질(720p)을 조합
	 *             (ABC Show.E01.180628.72op-NEXT
	 *             for TRAKT(https://trakt.tv/)
	 *         - rss_season : title에서 추출한 season 정보 (기본값 1)
	 *         - rss_episode: title에서 추출한 episode 정보 (기본값 1)
	 *
	 * Pre:
	 *   - Tvdb client 설치(https://github.com/adrenth/thetvdb2):
	 *       composer require adrenth/thetvdb2 명령 실행 (composer 설치 필요)
	 *       addInfo.php와 동일 경로에서 위 명령을 실행하여 설치
	 *   - Redis 설치 :
	 *       Tvdb API 응답 시간이 느리므로 성능 향상을 위해 설치
	 *       Redis를 사용하지 않을 경우 관련 로직 제거($redis)
	 *       php에 redis 설정 추가.
	 *       phpredis 설치(https://github.com/phpredis/phpredis)
	 *       DB 및 File로 대체 가능. (SQLITE 등)
	 */
	require __DIR__ .'/vendor/autoload.php';

	header("Content-Type: application/xml; charset=UTF-8");

	//Tvdb client
	$client = new \Adrenth\Thetvdb\Client();

	//https://www.thetvdb.com/member/api
	//tvdb에 가입하여 API Key를 발급받는다.
	$apiKey = $_SERVER['TVDB_API_KEY'];
	$username = $_SERVER['TVDB_USER_NAME'];
	$userKey = $_SERVER['TVDB_USER_KEY'];

	//Obtain a Tvdb token
	$token = $client->authentication()->login($apiKey, $username, $userKey);
	$client->setToken($token);

	//Redis
	$redis = new Redis();
	$redis->connect($_SERVER['REDIS_HOST']);

	//PostgreSQL
	$dbconn = pg_connect(
		" host=".$_SERVER['POSTGRE_HOST'].
		" port=".$_SERVER['POSTGRE_PORT'].
		" dbname=trpres ".
		" user=".$_SERVER['POSTGRE_USER'].
		" password=".$_SERVER['POSTGRE_PASS']
	);

	$query =
		'INSERT INTO "RSS" '.
		'(title, link, page, category, rss_episode, rss_season, rss_title, rss_quality, rss_release_group, tvdb_id, tvdb_series_name, rss_en_name, description, creator) '.
		'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \'addInfo\')';
	$result = pg_prepare($dbconn, "rss_insert", $query);

	//Params
	$rss = $_GET['rss'];
	$url = $rss;

	$is_first = true;

	//rss를 제외한 모든 입력값을 넘겨준다.
	foreach($_GET as $key => $value)
	{
		if($key == 'rss') continue;

		if($is_first) {
			$url = $url.'?';
			$is_first = false;
		} else {
			$url = $url.'&';
		}
		$url = $url.$key.'='.$value;
	}

	$content = file_get_contents($url);

	$node = new SimpleXMLElement($content);

	foreach($node->channel->item as $item) {
		//Extract episode from title
		$episode = null;
		$title_episode = null;
		if(preg_match('/e(\d{2,})[~-]e{0,1}(\d{2,})/i', $item->title, $matches) === 0) {
			preg_match('/e(\d{2,})/i', $item->title, $matches);
			//$episode = str_ireplace('e', '', $matches[0]);
			$episode = $matches[1] ? $matches[1] : '01';
			$title_episode = 'E'.$episode;
		} else {
			//$episode = preg_replace('/e/i', '', $matches[0]);
			//$episode = preg_replace('/~/', '-', $episode);
			$episode = $matches[1].'-'.$matches[2];
			$title_episode = 'E'.$matches[1].'-E'.$matches[2];
			//$title_episode = preg_replace('/(\d{2,})[~-](\d{2,})/', 'E${1}-E${2}', $episode);
		}
		//Add to RSS Field (rss_episode)
		$item->addChild('rss_episode', $episode);

		//Extract season from title
		if(preg_match('/s(\d{1,})/i', $item->title, $matches) === 0) {
			preg_match('/시즌(\d{1,})/', $item->title, $matches);
			//$season = str_replace('시즌', '', $matches[0]);
		} //else {
			//$season = str_ireplace('s', '', $matches[0]);
		//}
		$season = $matches[1] ? $matches[1] : '01';
		//Add to RSS Field (rss_season)
		$item->addChild('rss_season', $season);

		//Extract title
		preg_match('/.*(?=\.e\d{2,})/i', $item->title, $matches);

		//Replace title (불필요한 값 제거)
		$title = $matches[0] ? $matches[0] : $item->title;
		$title = preg_replace('/\[*(jtbc|tvN|MBN|KBS|MBC|SBS|olive|mnet|on\s*style|ocn)\]*\s*/i', '', $title);
		$title = preg_replace('/[\[\]+]/', '', $title);
		//remove unicode whitespace
		$title = preg_replace('/^\p{Z}+|\p{Z}+$/u', '', $title);
		//Add to RSS Field (rss_title)
		$item->addChild('rss_title', $title);

		//Extract File Info except title
		//preg_match('/\.e\d{2,}.*/i', $item->title, $matches);
		//$file_info = $matches[0];

		preg_match('/\d{3,4}p/i', $item->title, $matches);
		$quality = $matches[0];
		$item->addChild('rss_quality', $quality);

		$release_group = 'OTHERS';
		if (stripos($item->title, 'next') !== false) {
			$release_group = 'NEXT';
		} else if(stripos($item->title, 'once') !== false) {
			$release_group = 'Once';
		} else if(stripos($item->title, 'Chaos') !== false) {
			$release_group = 'Chaos';
		} else if(stripos($item->title, 'Hel') !== false) {
			$release_group = 'Hel';
		}
		$item->addChild('rss_release_group', $release_group);

		preg_match('/\d{6,8}/', $item->title, $matches);
		$tdate = $matches[0] ? $matches[0].'.' : '';

		$file_info = '.'.$title_episode.'.'.$tdate.$quality.'-'.$release_group;

		//Redis Key (addInfo:시리즈 제목)
		$key = 'addInfo:'.$title;
		//Redis에서 시리즈 제목에 해당되는 tvdb_id 값을 가져온다.
		$value = $redis->get($key.':tvdb_id');

		//Redis에 값이 없을 경우
		if($value === false) {
			try {
				//Tvdb에서 정보를 가져와서 넣어준다.
				$client->setLanguage('ko');
				$series = $client->search()->seriesByName($title)->getData()[0];
				$item->addChild('tvdb_id', $series->getId());
				$item->addChild('tvdb_series_name', $series->getSeriesName());

				//Redis에 가져온 정보를 넣어준다.
				$redis->set($key.':tvdb_id', $series->getId());
				$redis->set($key.':tvdb_series_name', $series->getSeriesName());
				$item->addChild('rss_kr_name', $series->getSeriesName().$file_info);

				//영문 시리즈명을 가져와서 넣어준다.
				$client->setLanguage('en');
				$series = $client->series()->get($series->getId());
				$en_name = $series->getSeriesName();
				$en_name = $en_name ? $en_name : $title;
				$item->addChild('rss_en_name', $en_name.$file_info);

				//Redis에 가져온 정보를 넣어준다.
				$redis->set($key.':rss_en_name', $en_name);
			} catch(Exception $e) {
				//Tvdb에 정보가 없을 경우 기본 값을 세팅한다.
				$item->addChild('tvdb_id', 0);
				$item->addChild('tvdb_series_name', $title);
				$item->addChild('rss_en_name', $title.$file_info);

				//Redis에 기본 값을 넣어준다. (불필요한 재검색 방지)
				$redis->set($key.':tvdb_id', 0);
				$redis->set($key.':tvdb_series_name', $title);
				$redis->set($key.':rss_en_name', $title);
			}
			//Redis Key의 폐기일시를 하루로 한다. (하루 뒤에 정보 사라짐. 갱신된 정보를 반영하기 위하여)
			//$expire = strtotime("+1 day", time());
			$expire = 60*60*24;
			$redis->setTimeout($key.':tvdb_id', $expire);
			$redis->setTimeout($key.':tvdb_series_name', $expire);
			$redis->setTimeout($key.':rss_en_name', $expire);
		} else {
			//Redis에 값이 있을 경우 이를 넣어준다.
			$item->addChild('tvdb_id', $redis->get($key.':tvdb_id'));
			$item->addChild('tvdb_series_name', $redis->get($key.':tvdb_series_name'));
			$item->addChild('rss_en_name', $redis->get($key.':rss_en_name').$file_info);
			$item->addChild('rss_kr_name', $redis->get($key.':tvdb_series_name').$file_info);
			//잘못된 키 값이 들어간 경우 아래 명령어로 키 삭제
			//$redis->unlink($key.':tvdb_id', $key.':tvdb_series_name', $key.':rss_en_name');
		}

		$result = pg_query($dbconn, 'SELECT 1 FROM "RSS" WHERE link = \''.$item->link.'\'');

		if(pg_num_rows($result) == 0) {
			$result = pg_execute($dbconn, "rss_insert", array(
				$item->title,
				$item->link,
				$item->page,
				$item->category,
				$item->rss_episode,
				$item->rss_season,
				$item->rss_title,
				$item->rss_quality,
				$item->rss_release_group,
				$item->tvdb_id,
				$item->tvdb_series_name,
				$item->rss_en_name,
				$item->description
			));
		}

	}

	$redis->close();
	pg_close($dbconn);

	echo $node->saveXML();
?>
