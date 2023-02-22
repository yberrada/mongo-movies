# Node.js - Workshop Demo App
The goal of this lab is to get you familiar with some of the MongoDB Atlas features and the MongoDB Node.js Driver.

# Table of Contents
1. [Introduction & Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Exercise 1: Setup Atlas Cluster](#exercise-1-setup-atlas-cluster)
4. [Exercise 2: Query Optimization](#exercise-2-query-optimization)
5. [Exercise 3: Data archival](#exercise-3-data-archival)
6. [Exercise 4: Federated Queries](#exercise-4-Federated-Queries)
7. [Exercise 5: Add a Search feature](#exercise-5-add-a-search-feature)
8. [Exercise 6: Create a Node.js Microservice](#exercise-6-create-a-nodejs-microservice)
9. [Exercise 7: Add Data Capture](#exercise-7-add-data-capture)


# Architecture
*The following is a high level architecture diagram of the application we're going to work on today.* 
<br />

![alt text](./public/architectureDiagram.png) 

# Prerequisites 
### Step 1 - Install Node.JS:
Use the following link to download and install Node.js: 
>https://nodejs.org/en/download/
### Step 2 - Clone Github Repo
We're going to start by setting up our project. First, create a folder for the workshop content:
```
mkdir mongodb-workshop
cd mongodb-workshop
```
Now, clone the git repo:
```
git clone https://github.com/yberrada/mongo-movies.git
```
Open the project in your favorite IDE and update your connection string in the db.js file: 
```
./mongodb-workshop/mongo-movies/server/db.js
```

Now, run the code to see the application in action
```
cd mongo-movies
npm install
npm run dev
```
*The application should now be running on your local machine. To check out the app, visit localhost @ port 3000: http://localhost:3000*
*Notice that the frontend runs in the port 3000 while the backend service run on port 8000.*

### Step 3: Explore the app
As you have might have figured out by now, the application is working -  it is basically a mini netflix Clone! </br>
*This lab will consists of a series of exercices that will enhance the application performance and introduce new features to it.*

# Exercise 1: Setup Atlas Cluster

### Step 1: Access MongoDB Atlas cluster  
*Skip this exercise if you already have a MongoDB Atlas Cluster*
- Login to the attendee portal: https://www.atlas-labs.cloud/
- Gain access to your dedicated cluster by clicking on <b>Atlas Cluster</b> in the top left corner.
- The e-mail will be prepopulated, leave it as is and use the following password to login:
>  *AtlasW0rskop!*

Great! We now need to setup the security around Atlas. By default, Atlas cluters are not reachable from the internet. We also need to configure *Authentication* and *Authorization*!
### Step 2: Setup your cluster's security
- Click on Database Access in the left sidebar, and click on:
> ADD NEW DATABASE USER.
- Set the authentication Method to Password (uses SCRAM) and give your user a: 
> Username & Password  </br>
- Assign the user one of the available built-in roles that allows a user to read and write from all databases.

Let's now configure the network security. As this is a workshop we will be whitelisting all IPs to access our cluster instead of opting for a VPC peering or a Private endpoint for more complex deployments. 
- Click on network Access on the left side bar and click on:
>ADD IP ADDRESS. 
- Allow access from anywhere. 

Awesome. So far we have gained access to a MongoDB Atlas Cluster and we have configured the Security.

# Exercise 2: Query Optimization
Let's start by optimizing the welcome page. At this time, the query powering the welcome page searches randomly for 10 movies. 

You need to come up with a query that returns the 10 movies that are PG rated: `{rated : "PG"}` and their release date is between 2000 and 2016 `{rated : "PG", year:{$gt: 2000, $lt: 2016}}` while sorting by title `{title: 1}`.

Make sure to update the query in the `./server/movies.js` file.

<!-- 
### MIGHT BE DELETED! Optimize it even more
Does<b>2016: Obama's America</b> show first on the list? Great job so far! Now, notice that the query is not supported by any index... Go into the dev tools and see the latency of the request...We should be able to optimize that...
Ask:
Create an index on your movies collection to support the query of the landing/welcome page.*  -->
# Exercise 3: Data archival
Based on the results of the analytics team, 95% of the customers only search for movies that were released in the past 7 years. Therefore, as a cost optimization measure we would like to archive movies older than 7 years old. Archiving can be a complicated process. Thankfully, MongoDB Atlas comes with an archival service that we can leverage. We will use *Atlas Online Archive* to archive all the movies that were realeased before 2016.
- Navigate to the movies collection and click on the Online Archive Tab
- Click on Configure Online Archive
- Click on Next and enter the namespace where the movies are stored (*The namespace would be the db.collection -> sample_mflix.movies* ).
- Under the archiving rule, select custom criteria and come up with the query that return movies that were released before 2016. Note, the movie documents have a field called `year`. Write a basic MQL query in the custom criteria input box. The query should look like this: `{"year": {"$lt": 2016}}` 
- Enter the most common fields that queries on archived documents will contain. These will be used to partition your archived data for optimal query performance.In our scenario, this is the `rated` field. 
- Click on next and launch the archival process.

*If successful, you should not be able to find any movies with a year value prior to 2016 in your database.*

# Exercise 4: Federated Queries
Go back to the app,  and verify if the <b>2016: Obama's America</b> is still showing up first. If you have properly archived your data, the movie should not be there (It was released in 2012). That's a problem. Yes, we wanted to archive the old movies, however, we would still like to offer them as one of the options for our viewers. Thankfully, we can leverage *Atlas Data Federation* which enables us to use one MongoDB connection to query both data in our live cluster and the data that was archived. All we have to do is update our connection string in the code.  
- Go to the Data Services Tab. 
- Under the cluster view, Click on Connect
- Select Connect your application
- Make sure to select the *Connect to Cluster and Online Archive"* and copy the connection string. 
- Make sure to update the query in the `./server/db.js` file.

Now again, refresh the app. You should see <b>2016: Obama's America</b> on top of the list. 

# Exercise 5: Add a Search feature
As we further enhance our application, we received a request from the business to provide our users the option to search for a movie. The application needs to have a search bar where our customers can search for a <b>*movie name*, a *genre*, or for an *actor* </b>. Of course, the search should be typo tolerant(*fuzzy matching*). The frontend was already built for you. However, the search bar (found in the search tab of the UI) should be powered by a rest API. To add the search functionality, we will need to: 
1. Build a full-text search index. Typically, we'd need a search engine but Atlas has a Search feature that we will be leveraging. 
2. Create the microservice to expose the functionality as an API

We'll start by building the index: 
- Go to the Atlas UI and  navigate to ‘Collections’
- Enter the Search Tab
- Click on Create a Search Index
- Select Visual Editor as the Configuration Method 
- Click on Next 
- Fill in the details for the index:
- Index Name: default
- Database:sample_mflix, 
- Collection: movies, 
- Click Next
- Click on the ‘Create Search Index’ button
- Wait until your index status turns to ‘ACTIVE’
- Test it in the aggregation pipeline builder. 
- Leverage the $search aggregation pipeline stage.
- Export the pipeline to NodeJS syntax. 

Now that our index is ready, let's write the NodeJS microservice to serve the frontend requests for search.  
# Exercise 6: Create a Node.js Microservice 
> The microservice will serve our application's search requests

The frontend sends a `GET` request to the following endpoint: http:///localhost:8001/search, it passes the search term as a query string in the following format: `http://localhost:8001/search?search="`

- Create a file in the server folder and call it `search.js`
- Start by importing the required modules:
```
const express = require("express");
const cors = require("cors");
var client = require('./db');
const app = express();
const { MongoClient } = require("mongodb"); //MongoDB Node.js driver

```
- Now, you need to create a client connection to MongoDB using the Node.js driver.
``` 
const uri ="mongodb+srv://admin:admin@cluster1.fof1o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const movies = client.db("sample_mflix").collection("movies")
```
- Using express, create a `GET` route to serve the requests:
```
app.get("/search", async (req, res) => {
    const searchQuery = [
        {
            '$search': {
                'index': 'default_index',
                'text': {
                    'query': req.query.search,
                    'path': 'title',
                    'fuzzy': {}
                }
            }
        }
    ]
    const result = await movies.aggregate(searchQuery).toArray();
    res.send(result);
});
```
- Run your application on port `8001`:
```
app.listen(8001, () => {
    console.log(`Server is running on port 8001.`);
});
```

You're now ready to test your search functionality. If you have configured the search index properly, the UI search bar should output relevant result. Try searching for **ghstbuters**, this should return the movie **Ghostbusters**

# Exercise 7: Add Data Capture
This is the last exercise of the workshop. At this point, we want to keep track of every user that adds a movie to our database. For that, we can create an Atlas function and configure a trigger to create a document for each user that has added/inserted a new movie to our database. 

- In the Atlas UI, click on App Services.
- Create a new App
- And in the left side bar, click on functions. We're going to define a function that adds a document everytime it is ran.
- Click on Create function, give it a name and go the function editor tab.
- Use the following code to define your function and make sure you have update your name in the user field of the document
```
exports = async function(arg){
  var conn = context.services.get("mongodb-atlas").db("workshop").collection("users");

  var insertResult;
  try {
   insertResult = await conn.insertOne({"user": "", "status": "completed"})
  } catch(err) {
    console.log("Error occurred while executing insert:", err.message);

    return { error: err.message };
  }
  return { result: insertResult };
};
```
- Awesome. We have defined the function. Now what?
- We can now configure triggers to run the function every time there's an insert in our database. 
- Click on Add trigger.
- Select the cluster, database, collection name and make sure to select the **insert** Operation Type.
- Click on Save.

We're now ready to test our setup. 
- Navigate to your movies collection and manually insert a document. 
- If configured properly, you should see a new collection in your db called users in which there's a document that was inserted by the Atlas functions. 

Congratulations on completing the lab!
