# cscc-itch-butler-uploader
Helper utility application for CSCC Game Development Capstone course uploads to Itch.io (but could be easily tweaked for anyone else)

NOTE: This is currently Windows-only. At such time other platform "batch-file-like" scripts are added, the core 1-3 .bat files should be moved to a platform-specific folder, and the __README_FIRST updated.

This project currently has no dependencies other than Node itself. Planned to stay that way.

I will try to keep the onboard copy of /butler up-to-date also.

## Configuring
There are hard-coded values near the top of `butler-uploader.js` that you can modify based on when the project started and how long it will last.

Then, for each team, the username and gamename should be set accordingly. 

These Itch.io resources should have already been made, and the username set to an Itch Page Admin with a verified email.

## Group Coordinator Usage
You can zip up everything (except maybe package-lock.json) into a self-contained deliverable zip once it has been configured, and deliver to each configured group.

## Team Usage
Please refer to __README_FIRST.txt for user-facing instructions. Everything is boiled into the Node.js script and the clickable batch files.

## Credits / License / Etc.
Originally written by Thomas Allenbaugh 2022-10-14 for use in the Columbus State Community College Game Development Capstone.

Use at your own risk! Node.js and Itch.io Butler / Wharf are covered by their respective licenses. 
