# Character-Creator

https://character-management-eed.herokuapp.com/

*currently only works on google chrome*

This application is a database storage application for users to store customizable character data for personal use or other users critique.

Technologies: html, css, bootstrap, pure, react.js, javascript, firebase


The application uses firebase user authentication to let a user create an account with an email, password and unique username. *In the future, we want to use firebase to add other ways for users to log in.*


![Login](/screenshots/Management-Login.PNG)

After the user logs in or registers an account, they are brought to the home page, where they can decide what they want to do. There is also a home and log out button at the top of the screen.

![Home](/screenshots/Management-Home.PNG)


When the user wants to create a new character, there are given a form to fill out and three default properties. For a character to be submitted, at least one property must be filled out. What's special about this form is that the user can add unique properties for their characters that would be added to the form. A character can be made public or private depending on the user and it affects if other users can see these characters or not. *Some properties are reserved.* Submitting the character adds it to the firebase database.

![NewChar](/screenshots/Management-Create.PNG)
![Created](/screenshots/Management-NewProp.PNG)


The user can see all their characters after clicking the "Your Characters" button. Here the user will see their characters and chracteristics. Users can even leave comments on your own characters to have notes for their private characters or ask for specific feedback from other users.

![YourChar](/screenshots/Management-YourChars.PNG)
![SelfComment](/screenshots/Management-SelfComment.PNG)


When looking at public characters, only characters that were defined public by their creators are displayed. Here, users can view and comment on characters of their choosing.

![Public](/screenshots/Management-Public.PNG)
![Comment](/screenshots/Management-Comment.PNG)


If you ever wanted to change something about your character based on new ideas or others' input, when viewing your characters, you can click edit for the character you want to update. The edit form uses the create form and fills in the data from the character being edited. You can then fill out this form the same way as if you were creating a character.

![Edit](/screenshots/Management-Edit.PNG)
