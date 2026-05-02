#!/bin/bash
cd /home/z/my-project
while true; do
  npx next dev -p 3000 2>&1
  echo "Server died at $(date), restarting in 3s..." >> /home/z/my-project/restart.log
  sleep 3
done
