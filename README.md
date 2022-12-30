# Student Fee Management

# Intro about the way I did
There have 2 MicroServices 
1. Student service to Manage Studens
2. Transaction Service to Manage Fee Collection
3. Api gateWay to Comminicate Between

There have 4 Database Table 
1. Student
2. Tuition
3. Transaction - Fee
4. Recipt 

    1. Create Students 
    2. Create Tuitions
    3. Assign Tuition for students
    4. Create Transaction it will create Receipt data automatically
    5. Get Receipt will gives the data wich to show on Recipt

# Used Technologies and Lanuages
TypeScript
MicroServices
Kafka
Jest for Testing

# DB Dum Link 
https://drive.google.com/drive/folders/12Hd2LhZ6y4BgDCVc0VRz9FlATWLS0BY2?usp=share_link 

# Installation Process

1 . Create a DB with Name "student-fee-management", tables will created when run the services. 

If you want you can Dum the DB with my tested Data.

2. Get in api-Gateway and install node module
    cd api-gateway && npm i

3. open a new terminal tab get in to student-service and install node module
    cd student-service && npm i

3. open a new terminal tab get in to transaction-service and install node module
    cd transaction-service && npm i

4. update the database details on in both transaction-service and student-service,
    under imports TypeOrmModule.

5. Run Kafka Broker, make sure it's runing on localhost:9092, 
    if Not update kafka broker in main.ts file in both transaction-service and student-service, 

6. run all three (api-gateway,transaction-service and student-service) with 'npm run start:dev'

7. api-gateway will run on http://localhost:3000

8. for Swagger http://localhost:3000/api you can find the documentaion.

9. for Postman Json https://drive.google.com/drive/folders/12Hd2LhZ6y4BgDCVc0VRz9FlATWLS0BY2?usp=share_link 

# Unit Testing

Student Service and Transaction Service, controller and services Covered with 80% of Unit Test Coverage

To Run Test cases

1. in Each services terminal run 'npm test:watch'

2. To check the coverage run 'npm run test:cov' and To See the Coverage on brower in each service folder there have folder with name of 'coverage' and in that there will be folder call lcov-report inside there have a index.html open that.


