# GoodSeeds

GoodSeeds is a lightweight, fun-to-use application for tracking and sharing your houseplants. 

Check out the live site here: [GoodSeeds](https://goodseeds-by-gnamma.herokuapp.com/)
![goodseeds gif](/goodseeds_readme_gif.gif)

# Technologies Used

## Back end

The back end was built using JavaScript and a postgreSQL database. Sequelize was the ORM used to interact with the database and Express was the framework used to manage the API routes. 

## Front end 

The front end was built using JavaScript with Pug HTML templates. Styling was implemented using vanilla CSS. 

## Deployment

This app was deployed to Heroku using the Heroku CLI.

# Features

GoodSeeds allows users to:
* Create an account
* Log in and log out
* Create and delete Plants
* Create and delete Shelves
* Edit their own Shelves by adding or removing Plants
* Create, edit, and delete Reviews for Plants
* Leave Comments on their own or others' Shelves 

# Key Components

## User Authorization

For extra security, user passwords are hashed using bcrypt before being stored in the database. When a user logs in, the entered password is hashed and compared against the stored encrypted password. A user can upload a profile image when creating their account. 

## Viewing and Creating Plants

Users can scroll through Plants already in the database, search for specific Plants, and add a Plant to the database if the one they are looking for does not exist. When adding a new Plant, the user can upload an image using a simple input powered by AWS S3. 

## Reviewing Plants
Users can review Plants in order to capture their thoughts, excite others, and build up a cumulative Plant rating over time that others can use to assess new Plants they discover. Reviews can be edited and deleted only by the User who wrote them.

## Building a Plant Shelf
Users can create a new plant shelf at the click of a button. Then it's easy to add Plants to that shelf from any Plant page. Users can remove a Plant from their shelf by clicking a button, which requests confirmation before deleting.

## Interacting with Other Users' Shelves
Users can view any other Users' Shelves and leave comments on them without causing the page to refresh, thanks to AJAX.

#Wiki

For more details, please see our Wiki pages:
* [API Documentation](https://github.com/taylorbhogan/goodseeds/wiki/API-Documentation)
* [Database Schema](https://github.com/taylorbhogan/goodseeds/wiki/Database-Schema)
* [Feature List](https://github.com/taylorbhogan/goodseeds/wiki/Feature-List)
* [Frontend Routes](https://github.com/taylorbhogan/goodseeds/wiki/Frontend-Routes)
* [User Stories](https://github.com/taylorbhogan/goodseeds/wiki/User-Stories)

# To-Dos

While we are excited to present GoodSeeds as it exists today, there's more we'd like to accomplish:
* Allow a User to create private Reviews on their Plants
* Improve styling for better accessibility and screen responsiveness
* Implement Plant Tags to improve searchability
