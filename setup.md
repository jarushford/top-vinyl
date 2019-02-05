# Setup

These setup instructions assume you have Postgres installed and `nodemon` installed globally.

```
Fork this repo and then clone from your own forked copy

git clone https://github.com/jarushford/top-vinyl.git

cd top-vinyl

git remote add upstream https://github.com/jarushford/top-vinyl (this is the remote you will rebase from)

npm install
```

Next you will need to set up databases for the development and test environments. These should be called `vinyl` and `vinyltest` as seen in the `knexfile.js`. Make sure Postgres is running and run the following commands in your terminal.

```
psql

CREATE DATABASE vinyl;

CREATE DATABASE vinyltest;

\q
```

Then you will need to seed the development database by running the following:

```
knex migrate:latest

knex seed:run
```

Now you should be able to run `npm start` to run locally!

Once this is up and running you can also run `npm test` to run the test suite and `npm run lint` to run the linter.
