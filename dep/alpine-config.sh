apk add docker
apk add git
apk add npm
service start docker
mkdir /var/ivy
cd /var/ivy || exit
git clone https://github.com/ShiningPikachu/ivy-core.git
git clone https://github.com/ShiningPikachu/ivy-images.git
git clone https://github.com/ShiningPikachu/ivy-node.git

cd ivy-core || exit
npm install -g .

cd .. || exit

cp -r ivy-node/ ivy-images/email
cp -r ivy-node/ ivy-images/baseball-reference
cp -r ivy-node/ ivy-images/odds

chmod +x ivy-core/src/system/build-docker.sh
./ivy-core/src/system/build-docker.sh

