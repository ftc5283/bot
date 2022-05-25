cd /
apt-get update
apt-get upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs nano
npm install --global yarn

adduser node
usermod -aG sudo node
usermod -aG gpio node

git clone https://github.com/ftc5283/bot.git app

cd /app
yarn install

ln -s /app/bot.service /lib/systemd/system/bot.service
cp /app/config.example.yml /app/config.yml

chown -R node:node /app

runuser -l node -c 'nano /app/config.yml'

systemctl daemon-reload
systemctl enable bot
systemctl start bot