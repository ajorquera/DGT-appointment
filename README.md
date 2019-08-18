# CRON LIFE

[![Build Status](https://travis-ci.org/ajorquera/cronLife.svg?branch=master)](https://travis-ci.org/ajorquera/cronLife)

This repo will contain serverless functions for different purposes

## Driver's licence appointment
In Spain there is a system that works through appointments to get your driver's licence. The problem is that once the appointments are full, the system says "Please come back later to check for new appointments". This is fucking annoying. I've been checking everyday and every single time it says I need to come back later to check. Soooo as a programmer that I am, I decided to build a tool on top of google cloud, using Google Scheduler, Google Functions and Cloud Build. Serverless with CI/CD

All of this for $0. :hearts: [Google Cloud](https://cloud.google.com/)

This endpoint helps me with: creating appointments and checking wich offices that are available

[API Documentation](/docs/offices.md)

```
                                ____
                              /      \
Hmmm... Maybe I should       (____/\  )
make this tool available      |___  U (____
for anyone .....              _\L.   |      \     ___
                            / /"""\ /.-'     |   |\  |
                           ( /  _/u     |    \___|_)_|
                            \|  \\      /   / \_(___ __)
                             |   \\    /   /  |  |    |
                             |    )  _/   /   )  |    |
                             _\__/.-'    /___(   |    |
                          _/  __________/     \  |    |
                         //  /  (              ) |    |
                        ( \__|___\    \______ /__|____|
                         \    (___\   |______)_/
                          \   |\   \  \     /
                           \  | \__ )  )___/
                            \  \  )/  /__(
                        ___ |  /_//___|   \_________
                          _/  ( / OUuuu    \
                         `----'(____________)`
```