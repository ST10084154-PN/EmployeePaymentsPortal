# Employee International Payments Portal 

This package contains a finalized Employee Payments Portal with:
- Registration disabled (users pre-created via a seed script)
- Password hashing & salting (bcrypt with 14 rounds)
- Login lockout after failed attempts and login reset after passed attempt
- Input sanitization and validation (express-validator, mongo-sanitize, xss-clean)
- Helmet + CSP + rate limiting
- Logging (winston) to server/logs/combined.log
- Jest+Supertest test shown in server/tests
- Postman collection under docs/
- CircleCI example for DevSecOps + SonarQube scan
- Sonar properties and instructions in docs/evidence.md

## Quickstart (local)
1. Copy server/.env. -> server/.env and set values (JWT_SECRET is required) can generate one using this cmd node -e "console.log(require('crypto').randomBytes(32).toString('hex'))", save this code string
2. Start MongoDB (mongod)
3. cd server && npm install
4. node seedUsers.js
5. node server.js
6. cd ../client && npm install && npm start
7. Open http://localhost:3000 and login with employee1@company.com / Password123

"# EmployeePaymentsPortal" 
