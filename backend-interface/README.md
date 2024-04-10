# What's Happening

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

The "What's Happening" application is a robust local news summarizer built using a modern, scalable, and efficient system design. The application leverages a range of advanced technologies, including Golang, gRPC, Envoy, Kubernetes, React, and MongoDB, to deliver a seamless user experience. The system architecture consists of a high-performance gRPC backend server, a frontend application, a MongoDB database for data storage, Kubernetes for container orchestration, and AWS services for deployment and management. This comprehensive approach ensures the application can handle large volumes of data and users while maintaining high performance and reliability.

## Getting Started
To set up the development environment and deploy the "What's Happening" application, follow these steps:

- Git Clone: Begin by cloning the repository using the following command:
    ```sh
    git clone git@github.com:shanyachaubey/Whats_Happenin-A_big_data_project.git
    ```
- Minikube Setup: Start the Minikube cluster with the following configuration:
    ```sh
    minikube start --cpus 4 --memory 3072
    ```
    The --cpus 4 and --memory 3072 options ensure that the Minikube cluster has sufficient resources to run the "What's Happening" application.
- Backend Deployment: Deploy the backend components using the following Kubernetes manifests:
    ```sh
    cd Whats_Happening
    kubectl create -f backend-interface/k8sServer/
    kubectl create -f backend-interface/minikube-mongo/
    kubectl create -f Topic_Modelling/MLDeployments/
    ```
    These commands deploy the gRPC server, Envoy proxy, MongoDB and Fastapi data pipeline instances to the Kubernetes cluster.
- Frontend Deployment: Deploy the frontend application by navigating to the react_frontend directory and running the following commands:
    ```sh
    npm install
    npm start
    ```
    The npm install command installs the necessary dependencies, and npm start launches the frontend application.
- Verify Deployment: Ensure that all the pods are running by executing the following command:
    ```sh
    kubectl get pods
    ```
    Additionally, you can access the backend interface by running the following command to forward the Envoy service port:
    ```sh
    kubectl port-forward svc/envoy-service 1337:1337
    ```
    Then, open a web browser and navigate to http://localhost:3000 to see the "What's Happening" application.

The "Getting Started" guide provides the necessary steps to set up the development environment and deploy the "What's Happening" application. Let's now dive into the system architecture and design decisions.

## System Architecture Diagram

[Insert a system architecture diagram that shows the integration and interaction of the various components within the "What's Happening" application]

## Backend System Design

The backend system of the "What's Happening" application is designed to be highly scalable, efficient, and reliable. It consists of the following key components:

- #### gRPC Server:
    The backend server is implemented using Golang and utilizes the gRPC communication protocol for efficient microservices interaction. The decision to use gRPC was driven by its ability to provide a high-performance, strongly-typed, and language-agnostic RPC framework. gRPC allows the backend server to handle incoming requests from clients and dispatch them to the appropriate microservices for processing, ensuring seamless communication and data exchange.
- #### Microservices:
    The backend system is designed around a microservices architecture, where each microservice is responsible for a specific task, such as news summarization, location mapping, or user management. This modular approach allows for better scalability, maintainability, and flexibility in the system. The microservices communicate with each other using the Kubernetes API, which provides a reliable and efficient way to discover and interact with other services within the cluster.
- #### Envoy Proxy
    To ensure compatibility with browser clients and enhance performance, the backend system employs an Envoy proxy. The Envoy proxy acts as a gateway for incoming HTTP/1.1 calls, converting them to HTTP/2 for efficient processing by the backend microservices. This design decision was made to leverage the performance benefits of HTTP/2, while still maintaining compatibility with older browser clients that may not support the newer protocol.
- #### MongoDB Integration
    The "What's Happening" application uses MongoDB as the primary data storage solution. MongoDB was chosen for its scalability, flexibility, and efficient handling of unstructured data, which is well-suited for the storage and retrieval of news articles and user information. The backend system utilizes MongoDB's CRUD (Create, Read, Update, Delete) operations to manage the data, ensuring reliable and consistent data management.

    To ensure data persistence and reliability, the MongoDB deployment within the Kubernetes cluster is managed using StatefulSets. StatefulSets provide a reliable way to manage the lifecycle of stateful applications, such as databases, by guaranteeing the order and uniqueness of pod deployments. Additionally, a headless service is used to access the MongoDB pods directly, facilitating efficient data management and querying.
- #### Frontend system design:
    **1. Web Server**
    The frontend application is served by a web server, which handles incoming HTTP/1.1 requests from users and delivers the React-based application to their browsers. This design ensures that the frontend can be easily accessed and used by end-users.

    **2. Client-side JavaScript**
    The client-side JavaScript implementation in the frontend application is responsible for rendering the interactive features, such as displaying news summaries and interactive maps. By leveraging the power of React, the frontend can efficiently manage the user interface and provide a responsive and engaging experience for the users.

    **3. gRPC API Integration**
    The frontend application communicates with the backend server using the gRPC APIs with the help of generated grpc-web JS files. This integration allows the frontend to fetch news data, user information, and other relevant data from the backend, ensuring a seamless and efficient data flow between the two components of the system.

    **4. React Components and Props**
    The frontend application is built using a component-based architecture, where individual UI elements are encapsulated as React components. These components can receive data and functionality through the use of props, which are passed down from parent components to child components.

    **5. React State Management with useState**
    The frontend application utilizes the useState hook provided by React to manage the state of individual components. This allows the components to store and update their own internal state, which can then be used to render the appropriate UI elements.

    **6. React Context for State Sharing**
    In addition to using useState for local state management, the frontend application also leverages the React Context API to share state across multiple components. This allows for the efficient propagation of data, such as user information and custom salad data, throughout the application without the need for extensive prop drilling.
    By utilizing a combination of React components, props, useState, and the Context API, the frontend system design of the "What's Happening" application is able to deliver a seamless and efficient user experience, while also maintaining a modular and scalable codebase.

- #### Deployment Strategy
    The "What's Happening" application is deployed using Kubernetes, with AWS EKS (Elastic Kubernetes Service) for production and Minikube for local development.

    **1. Containerization**
    Each component of the system, including the backend server, frontend application, Envoy proxy, and MongoDB, is containerized using Dockerfile. This containerization process ensures that the application can be easily deployed, scaled, and managed across different environments. 
    To build multi-platform Docker images for the "What's Happening" application, the system leverages the docker buildx command. Buildx is a Docker component that enables powerful multi-platform build features with a familiar Docker user experience. It runs on the Moby Buildkit builder engine, which allows for efficient cross-compilation and emulation-based builds.
    The process involves the following steps:
    - Creating a new builder instance using `docker buildx create --name mybuilder --bootstrap --use`. This sets up a multi-platform builder that can target various architectures.
    Building the Docker images for multiple platforms using the `docker buildx build` command with the `--platform` flag. For example:
        ```sh
        docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t username/image:latest --push .
        ```

    This command builds the Docker image for the specified platforms (amd64, arm64, and arm/v7) and pushes the resulting multi-platform image to the registry. By leveraging docker buildx, the "What's Happening" application can be easily containerized and deployed across a wide range of architectures, including x86_64, ARM64, and ARM/v7, without the need for manual configuration or complex build setups. This ensures the application can run efficiently on various hardware platforms, including cloud instances, edge devices, and ARM-based systems.
    
    **2. Kubernetes Deployment**
    Kubernetes manifests are used to define the desired state of the system, including deployments, services, and pods. This declarative approach to deployment ensures that the application can be easily replicated and scaled as needed, without the need for manual intervention.
    
    **3. MongoDB Deployment**
    For the MongoDB deployment, the system utilizes StatefulSets to ensure data persistence and reliability. StatefulSets provide a reliable way to manage the lifecycle of stateful applications, such as databases, by guaranteeing the order and uniqueness of pod deployments. Additionally, a headless service is used to access the MongoDB pods directly, facilitating efficient data management and querying.
    The use of StatefulSets and the headless service for MongoDB ensures that the data stored within the database is not lost, even if pods are restarted or scaled. This design decision was made to prioritize the reliability and consistency of the data, which is crucial for the "What's Happening" application.
- #### Scaling and Load Balancing
    To ensure the scalability and efficient resource utilization of the "What's Happening" application, the following strategies are employed:

    **1. Horizontal Scaling**
    Kubernetes enables horizontal scaling by adding or removing pods based on resource utilization. This ensures that the system can handle varying loads effectively, scaling up or down as needed to meet the demands of the users.
    
    **2. Load Balancing**
    For the backend and Envoy deployments, ClusterIP services are used to ensure that only internal traffic can access these services. This design decision enhances the security and isolation of the backend components.
    The frontend deployment, on the other hand, utilizes a weighted round-robin load balancing strategy. This approach distributes incoming requests evenly across multiple frontend pods, ensuring that the system can handle increased user traffic without compromising performance.
- #### Monitoring and Logging
    Monitoring and logging are essential for maintaining the health and performance of the "What's Happening" application. The system employs the following tools and practices:

    **1. Prometheus and Grafana**
    Prometheus is used for monitoring various metrics, such as CPU and memory utilization, request latency, and error rates. Grafana is then used to visualize these Prometheus metrics, providing insights into the system's performance and allowing for effective monitoring and troubleshooting.
    
    **2. ELK Stack (In-development)**
    In the future, the "What's Happening" application will integrate the ELK stack (Elasticsearch, Logstash, Kibana) for centralized log management and troubleshooting. This will allow the system to collect, index, and visualize logs generated by the various components, enabling efficient log analysis and issue resolution.
- #### Conclusion
    The "What's Happening" application is a robust and scalable local news summarizer built using a comprehensive system design that leverages Golang, gRPC, Envoy, Kubernetes, React, and MongoDB. The chosen technologies and architectural patterns ensure high performance, efficient data management, and reliable deployment, making the application suitable for serving large numbers of users while effectively processing and managing news data.

    The detailed documentation provided in this guide covers the key aspects of the system design, including the backend server, frontend application, deployment strategy, scaling and load balancing, and monitoring and logging mechanisms. By understanding the rationale behind each design decision, readers can gain a comprehensive understanding of the "What's Happening" application and its underlying architecture.
    
- #### Future Work: Security Considerations
    As the "What's Happening" application continues to evolve, the following security measures are planned for implementation:

    **1. TLS Encryption**
    To ensure the privacy and integrity of data, all communication between clients and the backend server will be encrypted using TLS (Transport Layer Security). This will protect sensitive information, such as user data and API keys, from unauthorized access. 

    **2. Role-Based Access Control (RBAC)**
    The system will implement RBAC to control access to various resources within the "What's Happening" application. This will allow for fine-grained control over who can access and perform specific actions, enhancing the overall security of the system.
    
    **3. Secrets Management**
    Sensitive information, such as API keys and database credentials, will be stored securely using Kubernetes secrets. This will ensure that these critical assets are not exposed in the codebase or deployment manifests, further strengthening the security of the application.
    
    By incorporating these security measures, the "What's Happening" application will be better equipped to protect user data and system resources, ensuring a secure and trustworthy experience for all users.