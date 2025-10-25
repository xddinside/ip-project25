Some More Changes:

- Make the CodeFun text and logo redirect to the homepage.

- Add a sign in and login page, instead of having the sign in component hover over.

- Add a login button as well in the header, with redirects to the login and sign in pages respectively

- Empty out the landing page, with only a CTA get started button for now.

- Clicking the get started button should make the user redirect them to the sign in page if they're not logged in, else redirect to a new /challenges route. In the challenges page, show the existing challenges and the create new challege button, etc stuff.

- After the user logs in, redirect them to a /challenges route, where there'll be the quizzes, instead of it being on the home page



- we need to sync the user from clerk into convex, and make sure everything works correctly and is being stored in the db properly.

- make a challenges show up on the header, only if the user is logged in.
