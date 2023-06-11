<h1>Monolithic to distributed systems</h1>

<h3>Description</h3>
This project is a transformation of a monolithic React app into a microservices-based application. The backend of the application was redesigned, introducing three microservices: customer, shopping, and products. The backend architecture follows a three-layered approach, consisting of the API layer for request validation, the service layer for business logic handling, and the repository layer for data operations. The project also includes a CI/CD pipeline that runs tests, deploys changes to a QA environment, and finally to AWS. Dockerization has been implemented to ensure consistency and ease of deployment.


<h3>Approach</h3>
The project involved three different approaches:

1: Simple HTTP Requests:

- Changes made in different services were communicated through HTTP requests.
- Services were notified of updates by proxying the changes.

2: Nginx Reverse Proxy:

- Nginx was used as a reverse proxy to handle requests between the three services: customer, products, and shopping.
- Services were able to subscribe and publish to a message broker, enabling communication between them.

3: gRPC Implementation:

- A gRPC connection was established between the products and shopping services.
- The shopping service requested details of specific products from the products service.
- The message broker was maintained for communication between the customer and shopping services.


<h3>Installation</h3>
To run the project locally, follow these steps:

Clone the repository: git clone <repository-url>
1. Navigate to the project directory: cd project-directory
2. Install dependencies: npm install
3. Build the project: npm run build
4. Start the application: npm start
Usage
Once the project is running, you can access the application through the provided URL. The frontend interface allows users to interact with the microservices-based app, utilizing the functionalities of the customer, shopping, and products services.


<h3>Technologies Used</h3>
 - React
 - Node.js
 - Docker
 - Nginx
 - gRPC
 - Message Broker (RabbitMQ)
 - CI/CD Pipeline
 - MongoDB
 -AWS


<h3>Contributors</h3>
Mohammad Dawood Nazer