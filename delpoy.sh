pnpm run build
ssh root@81.163.30.249 rm -rf/var/www/frontend/demo1/index.html
ssh root@81.163.30.249 rm -rf/var/www/frontend/demo1/assets

scp -r dist/* root@81.163.30.249:/var/www/frontend/demo1/