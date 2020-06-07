# Udagram
Udagram is a simple application that allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice

The project is split into three parts:

The Simple Frontend A basic Ionic client web application which consumes the RestAPI Backend.
The RestAPI Backend, a Node-Express server. 
The Image Filtering Microservice. It is a Node-Express application which runs a simple script to process images.

## Setting up the frontend

1. Clone this repository locally.

2. Install dependencies using 

```bash
npm install
```

3. Start your app using

```bash
ionic serve
```

## Setting up the REST API server/ Image Server

1. Clone this repository locally.

2. Install dependencies using 

```bash
npm install
```

3. Start your app using

```bash
npm run dev
```

## Deployed Project URLs

FrontEnd
```bash
http://d3ojcoj6kv7el0.cloudfront.net/
```

REST API
```bash
http://udagram-fdavalos-restapi-dev.us-east-1.elasticbeanstalk.com/
```

Image Serve
```bash
http://udagram-fdavalos-imagefilter-dev.us-east-1.elasticbeanstalk.com/
```

