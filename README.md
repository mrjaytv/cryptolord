# cryptolord

## Communication Protocols

Our group is currently in active communication via Slack, Discord, Zoom, Google Docs and Git.

## Overview of Scripts

This project currently has several working scripts. First, **MongooseAxios.js** has a function 
```getData(coinid:string, currency: string)```
that first checks our mongoDB instance for data relating to the requested coin and in the requested currency and if it finds the data, returns it. If it does not find the data, MongooseAxios will then send a GET request to CoinGecko API and store the response in the mongoDB and return it to the user.

The second script is **dataExploration.ipynb** which is a JuypterNotebook file that pulls sample testing data from the mongoDB instance, performs some preprocessing and implements a neural network model. This work is mostly a proof of concept since the current data schema in the database has changed and we still need to implement "Data Windowing" which is splicing the data into "window" sections that will be used for final training and testing.