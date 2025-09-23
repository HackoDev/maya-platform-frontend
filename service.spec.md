Let's implement vacancies api client basing on existing example @authApiClient.ts . It should be extended from base api client class and uses this CRUD definition:

1. List Endpoint:
curl -X 'GET' \
  'http://127.0.0.1:8000/api/web/vacancies?limit=100&offset=0' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sbMtAGEoXuczEGEGP3MLrXwcdLmvHc'

{
  "items": [
    {
      "id": "396e7584-038b-4695-9e73-ba996f65c0de",
      "title": "Создать рекламное видео для гномов",
      "description": "Сложно сказать что я хочу, но делать надо",
      "is_active": true,
      "author": {
        "email": "eugene.hatsko@m.thelightech.com",
        "first_name": "Eugene",
        "last_name": "Hatsko",
        "avatar": "/media/avatars/2_uBzTnrM.jpg",
        "whatsapp": "+79188915730",
        "phone": "+79188915730",
        "telegram": "HackoDev"
      },
      "created_timestamp": "2025-09-22T22:38:41.439Z",
      "updated_timestamp": "2025-09-22T22:38:41.439Z"
    },
    {
      "id": "34a9feac-4b64-46a9-9ef0-dc5c9540c69c",
      "title": "Хочу создать AI бота, который постит прикольные фотки",
      "description": "Давай вперед!",
      "is_active": true,
      "author": {
        "email": "eugene.hatsko@m.thelightech.com",
        "first_name": "Eugene",
        "last_name": "Hatsko",
        "avatar": "/media/avatars/2_uBzTnrM.jpg",
        "whatsapp": "+79188915730",
        "phone": "+79188915730",
        "telegram": "HackoDev"
      },
      "created_timestamp": "2025-09-22T22:38:12.824Z",
      "updated_timestamp": "2025-09-22T22:38:12.824Z"
    }
  ],
  "count": 2
}

2. Create Endpoint:
curl -X 'POST' \
  'http://127.0.0.1:8000/api/web/vacancies' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sbMtAGEoXuczEGEGP3MLrXwcdLmvHc' \
  -H 'Content-Type: application/json' \
  -d '{
      "title": "Создать рекламное видео для персов",
      "description": "Сложно сказать что я хочу, но делать надо",
      "is_active": true
    }'

{
  "id": "34a9feac-4b64-46a9-9ef0-dc5c9540c69c",
  "title": "Хочу создать AI бота, который постит прикольные фотки",
  "description": "Давай вперед!",
  "is_active": true,
  "author": {
    "email": "eugene.xxx@m.xxx.com",
    "first_name": "Eugene",
    "last_name": "Hatsko",
    "avatar": "/media/avatars/2_uBzTnrM.jpg",
    "whatsapp": "+xxxx",
    "phone": "+xxxx",
    "telegram": "HackoDev"
  },
  "created_timestamp": "2025-09-22T22:38:12.824Z",
  "updated_timestamp": "2025-09-22T22:38:12.824Z"
}

3. Retrieve endpoint:
curl -X 'GET' \
  'http://127.0.0.1:8000/api/web/vacancies/add00782-883b-4553-ad78-d3e0bbad0829' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sbMtAGEoXuczEGEGP3MLrXwcdLmvHc'

{
  "id": "34a9feac-4b64-46a9-9ef0-dc5c9540c69c",
  "title": "Хочу создать AI бота, который постит прикольные фотки",
  "description": "Давай вперед!",
  "is_active": true,
  "author": {
    "email": "eugene.xxx@m.xxx.com",
    "first_name": "Eugene",
    "last_name": "Hatsko",
    "avatar": "/media/avatars/2_uBzTnrM.jpg",
    "whatsapp": "+xxxx",
    "phone": "+xxxx",
    "telegram": "HackoDev"
  },
  "created_timestamp": "2025-09-22T22:38:12.824Z",
  "updated_timestamp": "2025-09-22T22:38:12.824Z"
}

4. Update endpoint:
curl -X 'PATCH' \
  'http://127.0.0.1:8000/api/web/vacancies/add00782-883b-4553-ad78-d3e0bbad0829' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sbMtAGEoXuczEGEGP3MLrXwcdLmvHc' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "string",
  "description": "string",
  "isActive": true
}'

{
  "id": "34a9feac-4b64-46a9-9ef0-dc5c9540c69c",
  "title": "Хочу создать AI бота, который постит прикольные фотки",
  "description": "Давай вперед!",
  "is_active": true,
  "author": {
    "email": "eugene.xxx@m.xxx.com",
    "first_name": "Eugene",
    "last_name": "Hatsko",
    "avatar": "/media/avatars/2_uBzTnrM.jpg",
    "whatsapp": "+xxxx",
    "phone": "+xxxx",
    "telegram": "HackoDev"
  },
  "created_timestamp": "2025-09-22T22:38:12.824Z",
  "updated_timestamp": "2025-09-22T22:38:12.824Z"
}


5. Delete endpoint:
curl -X 'DELETE' \
  'http://127.0.0.1:8000/api/web/vacancies/add00782-883b-4553-ad78-d3e0bbad0829' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sbMtAGEoXuczEGEGP3MLrXwcdLmvHc'

{
  "message": "Vacancy deleted successfully"
}

6. My Vacancies endpoint:
curl -X 'GET' \
  'http://127.0.0.1:8000/api/web/vacancies/my-vacancies?is_active=true&limit=100&offset=0' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sbMtAGEoXuczEGEGP3MLrXwcdLmvHc'

{
  "items": [
    {
      "id": "396e7584-038b-4695-9e73-ba996f65c0de",
      "title": "Создать рекламное видео для гномов",
      "description": "Сложно сказать что я хочу, но делать надо",
      "is_active": true,
      "author": {
        "email": "eugene.hatsko@m.thelightech.com",
        "first_name": "Eugene",
        "last_name": "Hatsko",
        "avatar": "/media/avatars/2_uBzTnrM.jpg",
        "whatsapp": "+79188915730",
        "phone": "+79188915730",
        "telegram": "HackoDev"
      },
      "created_timestamp": "2025-09-22T22:38:41.439Z",
      "updated_timestamp": "2025-09-22T22:38:41.439Z"
    },
    {
      "id": "34a9feac-4b64-46a9-9ef0-dc5c9540c69c",
      "title": "Хочу создать AI бота, который постит прикольные фотки",
      "description": "Давай вперед!",
      "is_active": true,
      "author": {
        "email": "eugene.hatsko@m.thelightech.com",
        "first_name": "Eugene",
        "last_name": "Hatsko",
        "avatar": "/media/avatars/2_uBzTnrM.jpg",
        "whatsapp": "+79188915730",
        "phone": "+79188915730",
        "telegram": "HackoDev"
      },
      "created_timestamp": "2025-09-22T22:38:12.824Z",
      "updated_timestamp": "2025-09-22T22:38:12.824Z"
    }
  ],
  "count": 2
}

We also should update Vacancy model in 