Table of Contents
-----------------

1.  [Introduction](#introduction)
2.  [Architecture Overview](#architectureoverview)
3.  [Backend System Design](#backendsystem)
4.  [Frontend System Design](#frontendsystem)
5.  [Deployment Strategy](#deployment)
6.  [Scaling and Load Balancing](#scalinglb)
7.  [Monitoring and Logging](#monitoring)
8.  [Conclusion](#conclusion)
9.  Future Work: [Security Considerations](#security)

Below is the overview of each section: 
1. Introduction<a name="introduction"></a>
-------------------------------------------

The system design of "What's Happening" uses advanced technologies to deliver a seamless user experience. Built upon a foundation of robust frameworks and cloud services, the application incorporates efficiency and scalability.

2. Architecture Overview<a name="architectureoverview"></a>
-------------------------------------------------------------

The system architecture consists of a high-performance gRPC backend server, a frontend application, a MongoDB database for data storage, Kubernetes for container orchestration, and AWS services for deployment and management.

3. Backend System Design<a name="backendsystem"></a>
-------------------------------------------------------------

The backend server is implemented in Golang and utilizes gRPC communication protocols for efficient microservices interaction. It consists of several microservices responsible for different functionalities such as news summarization, location mapping, and user management. Key components include:

-   gRPC Server: Handles incoming requests from clients and dispatches them to the appropriate microservices for processing.
-   Microservices: Each microservice is responsible for a specific task, such as news summarization or envoy proxy. They communicate with each other using Kubernetes API for seamless interaction.
-   Envoy Proxy: Acts as a gateway for incoming HTTP/1.1 calls, converting them to HTTP/2 for backend processing. This ensures compatibility with browser clients and enhances performance.
-   MongoDB: Provides robust data management capabilities for storing news articles, user information, and other relevant data. CRUD operations are efficiently handled through MongoDB.

4. Frontend System Design<a name="frontendsystem"></a>
---------------------------------------------------------------

The frontend application is built using modern web technologies such as HTML, CSS, and JavaScript in the React framework. It interacts with the backend server via gRPC APIs and presents the summarized news articles and interactive maps to the users. Key components include:

-   Web Server: Serves the frontend application to users and handles incoming HTTP/1.1 requests.
-   Client-side JavaScript: Implements the interactive features of the application, such as displaying news summaries and rendering maps.
-   gRPC APIs: Enable communication between the frontend and backend systems, allowing the frontend to fetch news data and other information from the backend server.

5. Deployment Strategy<a name="deployment"></a>
---------------------------------------------------------

Deployment is orchestrated using Kubernetes, with AWS EKS for production and Minikube for local development. The deployment strategy involves the following steps:

-   Containerization: Each component of the system, including the backend server, frontend application, Envoy proxy, and MongoDB, is containerized using Dockerfile.
-   Kubernetes Deployment: Kubernetes manifests are used to define the desired state of the system, including deployments, services, and pods.
-   StatefulSets for MongoDB: StatefulSets are used to ensure data persistence and reliability for MongoDB. This ensures that data is not lost even if pods are restarted or scaled.
-   Headless Service for MongoDB: A headless service is used to access MongoDB pods directly, facilitating efficient data management.

6. Scaling and Load Balancing<a name="scalinglb"></a>
-----------------------------------------------------------------------

To ensure scalability and efficient resource utilization, the following strategies are employed:

-   Horizontal Scaling: Kubernetes enables horizontal scaling by adding or removing pods based on resource utilization. This ensures that the system can handle varying loads effectively.
-   ClusterIP Services: ClusterIP services are used for backend and Envoy deployments, ensuring that only internal traffic can access these services.
-  <u>In-Development</u>:  Weighted Round Robin Load Balancing: Frontend deployments are load balanced using a Round Robin strategy, distributing incoming requests evenly across multiple pods.

7. Monitoring and Logging<a name="monitoring"></a>
---------------------------------------------------------------

Monitoring and logging are essential for maintaining the health and performance of the system. The following tools and practices are employed:

-   Prometheus: Prometheus is used for monitoring various metrics such as CPU and memory utilization, request latency, and error rates.
-   Grafana: Grafana is used for visualization of Prometheus metrics, providing insights into the system's performance.
-   <u>In-development</u>: ELK Stack (Elasticsearch, Logstash, Kibana): Logs generated by the system are collected using Logstash, indexed in Elasticsearch, and visualized in Kibana. This allows for efficient log management and troubleshooting.

8. Conclusion<a name="conclusion"></a>
---------------------------------------

"What's Happening" is a robust local news summarizer application built using Golang, gRPC, Envoy, Kubernetes, and React services. The system design outlined in this document ensures high performance, scalability and reliability making it suitable for serving large numbers of users while efficiently managing and processing news data.

9. Future Work(In-development): Security Considerations<a name="security"></a>
-----------------------------------------------------------------

Security is paramount in any application, especially when dealing with sensitive data such as user information. The following security measures are scheduled to be implemented:

-   TLS Encryption: All communication between clients and the backend server would be encrypted using TLS, ensuring data privacy and integrity.
-   Role-Based Access Control (RBAC): RBAC will be implemented to control access to various resources within the system based on the roles assigned to users.
-   Secrets Management: Sensitive information such as API keys and database credentials will be stored securely using Kubernetes secrets.