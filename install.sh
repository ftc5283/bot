cd /
apt-get update
apt-get upgrade -y
apt-get install -y curl nano sudo git build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install --global yarn

adduser -disabled-password --gecos "" node
usermod -aG sudo node

git clone https://github.com/ftc5283/bot.git app

cd /app
yarn install

ln -s /app/bot.service /etc/systemd/system
cp /app/config.example.yml /app/config.yml

chown -R node:node /app

runuser -l node -c 'nano /app/config.yml'

systemctl daemon-reload
systemctl enable bot
systemctl start bot
