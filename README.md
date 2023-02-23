# Node.js - Workshop Demo App
The goal of this lab is to get you familiar with some of the MongoDB Atlas features and the MongoDB Node.js Driver.

# Table of Contents
1. [Introduction & Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Exercise 1: Setup Atlas Cluster](#exercise-1-setup-atlas-cluster)
4. [Exercise 2: Query Optimization](#exercise-2-CRUD-operation-filtering)
5. [Exercise 3: Data archival](#exercise-3-data-archival)
6. [Exercise 4: Federated Queries](#exercise-4-Federated-Queries)
7. [Exercise 5: Add a Search feature](#exercise-5-add-a-search-feature)
8. [Exercise 6: Create a Node.js Microservice](#exercise-6-create-a-nodejs-microservice)
9. [Exercise 7: Add Data Capture](#exercise-7-add-data-capture)


# Architecture
*The following is a high level architecture diagram of the application we're going to work on today.* 
<br />

![alt text](./public/readme/architectureDiagram.png) 

# Prerequisites 
### Step 1 - Install Node.JS:
Use the following link to download and install Node.js: https://nodejs.org/en/download/

---

# Exercise 1: Setup Atlas Cluster & App

### Step 1: Access MongoDB Atlas cluster  
*Skip this step if you already have a MongoDB Atlas Cluster - Make sure the Atlas Cluster is at least an **M10** instance.*
- Login to the attendee portal: https://www.atlas-labs.cloud/
- Gain access to your dedicated cluster by clicking on <b>Atlas Cluster</b> in the top left corner.
- The e-mail will be prepopulated.To login use the following password: "***AtlasW0rskop!*** "


>Great! We now need to setup the security around Atlas. By default, Atlas cluters are not reachable from the internet. Therefore, we will have to configure Network Security and User Authentication and Authorization

### Step 2: Setup your cluster's security
- Click on **Database Access** in the left sidebar, and click on: **ADD NEW DATABASE USER**.
![alt text](./public/readme/db_config.png) 

- Set the authentication Method to Password (uses SCRAM) and give your user a: **Username & Password**
- Assign the user one of the available built-in roles that allows a user to be an Atlas Cluster Admin.

Let's now configure the network security. As this is a workshop we will be whitelisting all IPs to access our cluster instead of opting for a VPC peering or a Private endpoint for more complex deployments. 
- Click on **Network Access** on the left side bar and click on: **ADD IP ADDRESS**. 
![alt text](./public/readme/network_config.png) 

- Select **ALLOW ACCESS FROM ANYWHERE** and click on **Confirm**. 

>Awesome. So far we have gained access to a MongoDB Atlas Cluster and we have configured the Security.

### Step 3 - Clone Github Repo
We're going to start by setting up our project. Start by creating a folder for the workshop content. 
- Execute the commands below in your terminal: 
  ```
  mkdir mongodb-workshop
  cd mongodb-workshop
  ```
- Now, clone the git repo:
  ```
  git clone https://github.com/yberrada/mongo-movies.git
  ```
- Open the project in your favorite IDE and update your connection string in the`./mongodb-workshop/mongo-movies/server/db.js`. To do so:
  - Go to the **Data Services** Tab. 
  - Under the cluster view, Click on **Connect**
  - Select **Connect your application**
  - Copy the connection string. 
  - Update your db.js file.

- Now, run the code to see the application in action
  ```
  cd mongo-movies
  npm install
  npm run dev
  ```
> The application should now be running on your local machine. To check out the app, visit localhost @ port 3000: http://localhost:3000 
Notice that the frontend uses port 3000 while the backend service is listenning on port 8000.

### Step 4: Explore the app
As you have might have figured out by now, the application is working -  it is basically a mini netflix Clone! </br>
![alt text](./public/readme/ui-1.png) 

Feel free to check out the Home page and the Search tab. 
>This lab will consists of a series of exercices that will introduce new features to the application.

---

# Exercise 2: CRUD Operation & Filtering
We will start by customizing the welcome page. At this time, the query powering the welcome page searches randomly for 16 movies. 

You need to update the exisiting to query so that it starts querying for movies that are PG rated: `{rated : "PG"}` and their release date is between 2000 and 2016 `{rated : "PG", year:{$gt: 2000, $lt: 2016}}` while sorting by title `{title: 1}`.

- Update the query in the `./server/movies.js` file.

> After a page refresh and if you're successful, you should see  <b>2016: Obama's America</b> as the movie in the top left corner of the home page.  

![alt text](./public/readme/ui-2.png) 

---
# Exercise 3: Data archival
Based on the results of the analytics team, 95% of the customers only search for movies that were released in the past 7 years. Therefore, as a cost optimization measure we would like to archive movies older than 7 years old. Archiving can be a complicated process. Thankfully, MongoDB Atlas comes with an archival service that we can leverage. We will use *Atlas Online Archive* to archive all the movies that were realeased before 2016.
- Go back to the Atlas UI
- Navigate to the movies collection
- For efficiency purposes, create an Index on the `year` field by clicking on **Indexes**
- Click on **Create Index** 
- In the Index definition, speficy the fields to be indexed: `{"year": 1}`
- Now that the Index is ready, click on the **Online Archive** Tab
- Click on Configure Online Archive
- Click on Next and enter the namespace where the movies are stored `sample_mflix.movies`.
- Under the archiving rule, select **custom criteria** and come up with the query that return movies that were released before 2016. Note, the movie documents have a field called `year`. Write a basic MQL query in the custom criteria input box. The query should look like this: `{"year": {"$lte": 2016}}` 
- Enter the most common fields that queries on archived documents will contain. These will be used to partition your archived data for optimal query performance.In our scenario, assume that it is the `rated` field. 
- Click on next and launch the archival process.

>If successful, you should not be able to find any movies with a year value prior to 2016 in your database.

---
# Exercise 4: Federated Queries
Go back to the app,  and verify if the <b>2016: Obama's America</b> is still showing up first. If you have properly archived your data, the movie should not be there (It was released in 2012). That's a problem. Yes, we wanted to archive the old movies, however, we would still like to offer them as one of the options for our viewers. Thankfully, we can leverage *Atlas Data Federation* which enables us to use one MongoDB connection to query both data in our live cluster and the data that was archived. All we have to do is update our connection string in the code.  
- Go to the **Data Services** Tab. 
- Under the cluster view, Click on **Connect**
- Select **Connect your application**
- Make sure to select the **Connect to Cluster and Online Archive** and copy the connection string. 
- Make sure to update the connection string in the `./server/db.js` file.

> If you refresh the app, you should see <b>2016: Obama's America</b> on top of the list.

---
# Exercise 5: Add a Search feature
As we further enhance our application, we received a request from the business to provide our users the option to search for a movie. The application needs to have a search bar where our customers can search for a ***movie name***, a ***genre***, or for an ***actor*** . Of course, the search should be typo tolerant(**fuzzy match**). The frontend was already built for you. However, the search bar (found in the search tab of the UI) should be powered by a rest API. To add the search functionality, we will need to: 
1. Build a full-text search index. Typically, we'd need a search engine but Atlas has a Search feature that we will be leveraging. 
2. Create the microservice to expose the functionality as an API

We'll start by building the index: 
- Go to the Atlas UI and navigate to ‘**Browse Collections**’
- Enter the '**Search**' Tab
- Click on '**Create a Search Index**'
- Select '**Visual Editor**' as the Configuration Method 
- Click on **Next** 
- Fill in the details for the index:
  - Index Name: **default**
  - Database: **sample_mflix**, 
  - Collection: **movies**, 
  - Click **Next**
- Click on the ‘**Create Search Index**’

We now can test our Search Index through the aggregation pipeline builder. 
- Go back to ‘**Browse Collections**’ and select the '**sample-mflix.movies**' collection.
- Click on the '**Aggregation**' tab 
- Select the '**$search**' aggregation pipeline stage in the dropdown menu.
- Try running the following query in the search stage:  
```
{
  index: 'default',
  text: {
    query: 'Storteler',
    path: 'title',
    fuzzy:{}
  }
}
```
> The search stage should match a movie titled: *The Storyteller*. Notice that our query string is *Storteler*.

- Export the pipeline to NodeJS syntax.
- Make sure to save the pipeline code in your text editor. 
<!-- - Wait until your index status turns to ‘**ACTIVE**’ -->


> Now that our index is ready, let's write the NodeJS microservice to serve the frontend requests for search.  

---
# Exercise 6: Create a Node.js Microservice 
> The microservice will serve our application's search requests

The frontend sends a `GET` request to the following endpoint: http:///localhost:8001/search, it passes the search term as a query string in the following format: `http://localhost:8001/search?search="`

- Create a file in the server folder and call it `server.js`
- Start by importing the required modules:
```
const express = require("express");
const cors = require("cors");
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
app.use(cors());
app.get("/search", async (req, res) => {
    const searchQuery = <InsertSearchPipeline> //This should be the Search pipeline you exported in Excercise 5 
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

You're now ready to test your search functionality. If you have configured the search index properly, the UI search bar should output relevant result. Try searching for **Arbian**, this should return multiple movies with **Arabian** in the title. 

---

# Exercise 7: Add Data Capture
This is the last exercise of the workshop. At this point, we want to keep track of every user that adds a movie to our database. For that, we can create an Atlas function and configure a trigger to create a document for each user that has added/inserted a new movie to our database. 


- Go to the Atlas UI and navigate to ‘**Browse Collections**’
- Enter the '**Search**' Tab
- Click on '**Create a Search Index**'
- Select '**Visual Editor**' as the Configuration Method 


- In the Atlas UI, click on the '**App Services**' tab.
- Create a new App
- And in the left side bar, click on '**functions**'. 
> We're going to define a function that adds a document everytime it is ran.
- Click on Create function, give it a name and go the function editor tab.
- Use the following code to define your function and make sureto update your name in the user field of the document
```
exports = async function(arg){
  var conn = context.services.get("mongodb-atlas").db("workshop").collection("users");

  var insertResult;
  try {
   insertResult = await conn.insertOne({"user": "YourName", "status": "completed"})
  } catch(err) {
    console.log("Error occurred while executing insert:", err.message);

    return { error: err.message };
  }
  return { result: insertResult };
};
```
Awesome. We have defined the function. Now what? We can now configure triggers to run the function every time there's an insert in our database. 
- Click on '**Add trigger**'.
- Select the right *cluster, database, collection name* and make sure to select the **INSERT** Operation Type.
- Click on Save.

We're now ready to test our setup. 

- Navigate to your movies collection and manually insert a document. 
- If configured properly, you should see a new collection in your db called users in which there's a document that was inserted by the Atlas functions. 

>Congratulations on completing the lab!
