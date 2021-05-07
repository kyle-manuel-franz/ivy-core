sudo yum install docker -y
sudo yum install git -y

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_15.x | sudo -E bash -
sudo yum install -y nodejs

sudo mkdir /var/ivy
cd /var/ivy || exit

sudo git clone https://github.com/ShiningPikachu/ivy-core.git
sudo git clone https://github.com/ShiningPikachu/ivy-images.git
sudo git clone https://github.com/ShiningPikachu/ivy-node.git

cd ivy-core || exit
sudo npm install -g .


cd .. || exit

sudo cp -r ivy-node/ ivy-images/email
sudo cp -r ivy-node/ ivy-images/baseball-reference
sudo cp -r ivy-node/ ivy-images/odds


service start docker

cd /var/ivy/ivy-images || exit
sudo chmod +x scripts/build-all.sh
sudo ./scripts/build-all.sh


sudo chmod +x ivy-core/src/system/build-docker.sh
./ivy-core/src/system/build-docker.sh

cd /var/ivy/ivy-core || exit
sudo npm install

#export IVY_EMAIL_PASSWORD
#export IVY_EMAIL_USER