#!/bin/bash
set -e

# Update and install Java (Jenkins requires Java 11 or 17)
sudo apt update -y
sudo apt install -y fontconfig openjdk-17-jdk wget gnupg

# Check Java Version
java --version

# Create Directory to store Slave Deployments
mkdir -p /home/ubuntu/FlaskWebDeploy

#Check Directory Permissions
ls -ld /home/ubuntu/FlaskWebDeploy

# Give Required permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/FlaskWebDeploy
chmod 755 /home/ubuntu/FlaskWebDeploy
chown ubuntu:ubuntu /home/ubuntu/FlaskWebDeploy
