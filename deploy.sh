# /bin/bash
set -e

pnpm run build:prod
ssh root@95.163.230.10 "rm -rf /var/www/frontend/production/*"
scp -r dist/* root@95.163.230.10:/var/www/frontend/production/
ssh root@95.163.230.10 "rm /var/www/frontend/production/stats.html"
