Evidence and reproduction steps
-------------------------------
1. Copy server/.env.example to server/.env and set values (JWT_SECRET at minimum).
2. Start MongoDB (mongod).
3. cd server && npm install
4. node seedUsers.js  # creates employee1 & employee2
5. node server.js     # starts API
6. cd client && npm install && npm start
7. Login at http://localhost:3000 using seeded credentials (employee1@company.com / Password123)
8. Perform a transfer to see log entries in server/logs/combined.log
9. Run tests: cd server && npm test (creates jest output)
10. Push to GitHub and enable CircleCI using server/.circleci/config.yml. Set SONAR_TOKEN in CircleCI project env vars to enable sonar scan.
