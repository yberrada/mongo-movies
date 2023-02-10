# Node.js Demo App
The goal of this lab is to get your familiar with some of the MongoDB Atlas features and the MongoDB Node.js Driver.

# Table of Contents
1. [Fork Github repo](#Fork)
2. [Optimize query](#example2)
3. [Add a search bar](#third-example)
4. [Create a Node.js Microservice to serve the search requests](#fourth-examplehttpwwwfourthexamplecom)
4. [Deploy the app](#deploy)
4. [Archive Data](#archive)
5. [Add Data Capture](#CDC)


## Architecture
![alt text](./public/architectureDiagram.png)

## Fork Github repo
1. Fork this git repository and open it in your favorite IDE. 
```
git clone ....
```
Now that you have the project open in your IDE, run the code to see the application in action
```
npm install
npm start
```
The application should now be running on your local machine. To check out the app, visit localhost @ port 3000: localhost:3000

## Setup Security 

## Explore the app
As you have might have figured out by now, the application is working -  it is basically a mini netflix Clone! This lab will consists of a series of exercices that will enhance the application performance and introduce new features to it.

## Optimize query
Let's start by optimizing the welcome page. At this time, the query powering the welcome page searches randomly for 10 movies. 
The business wants us to instead only show the last 10 movies that were added. 
Ask => 
Come up with a query that returns the last 10 movies added to the database and make sure that the movies are PG rated and their release date is no older than 10 years.

Insert new movie and make sure it is listed first in your UI.
### Optimize it even more
Great job so far! Now, notice that the query is not supported by any index... Go into the dev tools and see the latency of the request...We should be able to optimize that...
Ask:
Create an index on your movies collection to support the query of the landing/welcome page. 

## Archive some of the data
Based on the results of the analytics team, 95% of the customers only search for movies that were released in the past 5 years. Therefore, as a cost optimization measure we would like to archive movies older than 5 years old. However, we would like to still have them as queryable. 
Ask => Using Atlas, archive data and update the code to reflect those changes. Check if movies are still in the database and check if they show on the UI.  

## Add a search bar
At this point, we would like to give our users the option to search for a movie... The application needs to have a search bar where our customers can search for a movie name, a genre, or for an actor. Of course, the search should be typo tolerant. 

Add search index

Test it in the aggregation pipeline builder

## Create a Node.js Microservice to serve the search requests
Expose a REST endpoint for search.

## Add CDC and send email
Leverage AWS SNS and send an email to @mongodb.com - whenever a new movie is added.
