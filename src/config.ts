export const config = {
  authentication_url: 'http://localhost:8082',
  signup_url: 'http://localhost:8082/signup',
  password_url: 'http://localhost:8082/password',
  oauth2_url: 'http://localhost:8082/oauth2',

  user_url: 'http://localhost:8082/users',
  user_rate_url: 'http://localhost:8082/users/rates',
  role_url: 'http://localhost:8082/roles',
  privilege_url: 'http://localhost:8080/privileges',
  audit_log_url: 'http://localhost:8080/audit-logs',
  appreciation_url: 'http://localhost:8082/appreciations/rates',
  appreciation_reply_url:'http://localhost:8082/appreciation-reply',

  article_url: 'http://localhost:8082/articles',
  article_rate_url: 'http://localhost:8082/articles/rates', 

  my_article_url: 'http://localhost:8082/my-articles',
  cinema_url: 'http://localhost:8082/cinemas',
  backoffice_cinema_url: 'http://localhost:8082/backoffice/cinemas',
  cinema_rate_url:'http://localhost:8082/cinemas/rates',
  cinema_rate_comment_url: 'http://localhost:8082/cinemas/comments',
  film_url: 'http://localhost:8082/films',
  backoffice_film_url: 'http://localhost:8082/backoffice/films',
  film_rate_url: 'http://localhost:8082/films/rates',
  film_rate_comment_url: 'http://localhost:8082/films/rates/comment',
  film_category_url: 'http://localhost:8082/films/categories',
  director_url: 'http://localhost:8082/director',
  cast_url: 'http://localhost:8082/cast',
  production_url: 'http://localhost:8082/production',
  country_url: 'http://localhost:8082/country',
  location_url: 'http://localhost:8082/locations',
  backoffice_location_url: 'http://localhost:8082/backoffice/locations',
  location_rate_url: 'http://localhost:8082/locations/rates',
  location_rate_comment_url: 'http://localhost:8082/locations/rates/comment',
  myprofile_url: 'http://localhost:8082/my-profile',
  profile_url: 'http://localhost:8082/users',
  skill_url: 'http://localhost:8082/skills',
  interest_url: 'http://localhost:8082/interests',
  looking_for_url: 'http://localhost:8082/looking-for',
  item_url: 'http://localhost:8082/items',
  item_category_url: 'http://localhost:8082/items/categories',
  brand_url: 'http://localhost:8082/brands',
  my_item_url: 'http://localhost:8082/my-items',
  item_response_url: 'http://localhost:8082/items/responses',
  item_response_comment_url: 'http://localhost:8082/items/responses/comment',
  company_url: 'http://localhost:8082/companies',
  backoffice_company_url: 'http://localhost:8082/backoffice/companies',
  company_categories_url: 'http://localhost:8082/companies/categories',
  company_rate_url:'http://localhost:8082/companies/rates',
  company_search_rate_url:'http://localhost:8082/companies/rates/search',
  company_rate_comment_url: 'http://localhost:8082/companies/rates/comment',

  jobs_url: 'http://localhost:8082/jobs',
  backoffice_job_url: 'http://localhost:8082/backoffice/jobs',
  saved_item:'http://localhost:8082/saved-items',
  saved_location:'http://localhost:8082/locations/save',
  saved_film:'http://localhost:8082/films/save',
  user_follow_url:'http://localhost:8082/users',
  location_follow_url:'http://localhost:8082/locations',
  music_url: 'http://localhost:8082/musics',
  saved_music_url: 'http://localhost:8082/saved-musics',
  saved_listsong_url: 'http://localhost:8082/saved-listsong',
  playlist_url: 'http://localhost:8082/musics/playlist',
  music_author_url: 'http://localhost:8082/musics/author',
  backoffice_music_url: 'http://localhost:8082/backoffice/musics',
  
  backoffice_room_url:'http://localhost:8082/backoffice/rooms',
  room_url:'http://localhost:8082/rooms'
};

export const env = {
  sit: {
    authentication_url: 'http://10.1.0.234:3003'
  },
  deploy: {
    authentication_url: '/server'
  }
};
