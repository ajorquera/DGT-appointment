# CRON LIFE

This repo will contain serverless functions for different purposes

## Driver's licence appointment
In Spain there is a system that works through appointments to get your driver's licence. The problem is that once the appointments are full, the system says "Please come back later to check for new appointments". This system is fucking annoying. I've been checking everyday and every single time it says I need to come back later to check. Soooo as a programmer that I am, I decided to build a cron job on top of google cloud, using Google Scheduler, Google Functions and Cloud Build. Serverless with CI/CD

All of this for $0. 

The cron job just checks every 2-3 hours if there is an appointment available. Once it has a slot, it will send me an email. 

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