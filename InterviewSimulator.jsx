import Webcam from "react-webcam";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, PlayCircle, StopCircle, MessageSquare, BarChart3 } from "lucide-react";
import { interviewDataset } from "../data/evaluationDataset";
import { saveInterview } from "../api/api";
import { Radar } from "react-chartjs-2";
import InterviewCategory from "./InterviewCategory";
import InterviewRoles from "./InterviewRoles";
import InterviewFeedback from "./InterviewFeedback";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

import { motion } from "framer-motion";
import {
  Code2,
  Wrench,
  Briefcase,
  Users
} from "lucide-react";

const getMLScore = async (question, answer) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        answer: answer,
      }),
    });

    const data = await response.json();

    console.log("ML API Response:", data); // 🔥 DEBUG

    return data.score;

  } catch (error) {
    console.error("ML API error:", error);
    return 5;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLE QUESTION BANK  –  paste this into InterviewSimulator.jsx
// Replace the existing roleQuestionBank constant with the block below.
// Each role has 50 questions; the app randomly picks questions per session.
// ─────────────────────────────────────────────────────────────────────────────

const roleQuestionBank = {

  "Software Developer": [
    "What is OOP and what are its four pillars?",
    "Explain the difference between stack and heap memory.",
    "What is the difference between compiled and interpreted languages?",
    "What is recursion? Give an example.",
    "What are design patterns? Name a few common ones.",
    "Explain the SOLID principles.",
    "What is the difference between synchronous and asynchronous programming?",
    "What is a data structure? Name common types.",
    "What is the time complexity of binary search?",
    "What is a REST API and how does it work?",
    "What is the difference between an abstract class and an interface?",
    "Explain the concept of polymorphism with an example.",
    "What is a linked list and how does it differ from an array?",
    "What is a hash table and how does it handle collisions?",
    "What is the difference between a stack and a queue?",
    "What is a binary search tree?",
    "What is Big O notation and why does it matter?",
    "What is the difference between GET and POST HTTP requests?",
    "What is multithreading and when would you use it?",
    "What is the difference between pass by value and pass by reference?",
    "What is a deadlock and how can you prevent it?",
    "What is garbage collection and how does it work?",
    "What is the difference between == and === in JavaScript?",
    "What is a closure in programming?",
    "Explain the concept of inheritance in OOP.",
    "What is encapsulation and why is it important?",
    "What is the difference between a process and a thread?",
    "What is version control and why is it important?",
    "What is the difference between SQL and NoSQL databases?",
    "What is an API and why is it used?",
    "What is unit testing and why is it important?",
    "What is the difference between black box and white box testing?",
    "What is a software development lifecycle (SDLC)?",
    "Explain the Agile methodology.",
    "What is a merge conflict and how do you resolve it?",
    "What is continuous integration and continuous delivery (CI/CD)?",
    "What is the difference between monolithic and microservices architecture?",
    "What is the Singleton design pattern and when is it used?",
    "What is an exception and how do you handle it?",
    "What is the difference between authentication and authorization?",
    "What is memoization and how does it optimize performance?",
    "What is the difference between deep copy and shallow copy?",
    "What is the event loop in JavaScript?",
    "What is dependency injection?",
    "What is the difference between coupling and cohesion?",
    "What is middleware?",
    "What is the difference between TCP and UDP?",
    "What is an operating system?",
    "What is virtual memory?",
    "What is the CAP theorem?"
  ],

  "Frontend Developer": [
    "What is the DOM and how does it work?",
    "Explain the CSS box model.",
    "What is React and why is it popular?",
    "What are React hooks? Explain useState and useEffect.",
    "What is the difference between controlled and uncontrolled components in React?",
    "What is CSS Flexbox and when would you use it?",
    "Explain how the browser renders a webpage.",
    "What is responsive design and how do you implement it?",
    "What is the difference between localStorage and sessionStorage?",
    "What is CORS and how do you handle it on the frontend?",
    "What is the difference between class and functional components in React?",
    "What is the virtual DOM and how does it improve performance?",
    "What is CSS Grid and when would you use it over Flexbox?",
    "What is the difference between inline, block, and inline-block elements?",
    "What is event bubbling and event capturing?",
    "What is the purpose of the useCallback hook?",
    "What is the useMemo hook used for?",
    "What is prop drilling and how do you avoid it?",
    "What is the React Context API?",
    "What is Redux and when would you use it over Context?",
    "What is lazy loading in React?",
    "What is code splitting and why is it useful?",
    "What are web accessibility standards (WCAG)?",
    "What is semantic HTML and why does it matter?",
    "What is the difference between em, rem, px, and %?",
    "What is a CSS preprocessor like SASS?",
    "What is the difference between visibility:hidden and display:none?",
    "What is the z-index property in CSS?",
    "What is a Promise in JavaScript?",
    "What is async/await in JavaScript?",
    "What is the difference between null and undefined in JavaScript?",
    "What is debouncing and throttling?",
    "What is a service worker?",
    "What is a Progressive Web App (PWA)?",
    "What is the critical rendering path?",
    "What are meta tags and why are they important?",
    "What is the difference between SSR and CSR?",
    "What is Next.js and what problems does it solve?",
    "What is TypeScript and why is it used with React?",
    "What is the difference between a cookie and a session?",
    "What is XSS and how do you prevent it?",
    "What is Content Security Policy (CSP)?",
    "What is tree shaking?",
    "What is webpack and what does it do?",
    "What is the difference between JSON and XML?",
    "What is the Fetch API?",
    "What is the Intersection Observer API?",
    "What is the difference between margin and padding?",
    "What is CSS specificity?",
    "What is the purpose of the key prop in React lists?"
  ],

  "Backend Developer": [
    "What is a RESTful API?",
    "Explain the MVC architecture pattern.",
    "What is middleware in backend development?",
    "What is the difference between SQL and NoSQL databases?",
    "What is database indexing and why is it important?",
    "Explain the difference between authentication and authorization.",
    "What is JWT and how does it work?",
    "What is caching and how does it improve performance?",
    "What is a message queue and when would you use it?",
    "Explain the concept of microservices architecture.",
    "What is database normalization?",
    "What is an ORM and what are its pros and cons?",
    "What is the N+1 query problem?",
    "What is connection pooling?",
    "What does ACID stand for in databases?",
    "What is a database transaction?",
    "What is the difference between optimistic and pessimistic locking?",
    "What is rate limiting and why is it important?",
    "What is a reverse proxy?",
    "What is load balancing?",
    "What is the difference between horizontal and vertical scaling?",
    "What is a webhook?",
    "What is GraphQL and how does it differ from REST?",
    "What is the difference between synchronous and asynchronous APIs?",
    "What is a deadlock in a database?",
    "What is SQL injection and how do you prevent it?",
    "What is CORS and how do you handle it in a backend application?",
    "What is an API gateway?",
    "What is idempotency in APIs?",
    "What is the difference between PUT and PATCH?",
    "What is pagination in APIs and why is it important?",
    "What is event-driven architecture?",
    "What is a stored procedure?",
    "What is a database view?",
    "What is a database trigger?",
    "What is the difference between INNER JOIN and OUTER JOIN?",
    "What is Redis and when would you use it?",
    "What is a CDN?",
    "What is WebSocket and when would you use it?",
    "What is gRPC?",
    "What is the difference between monolith and microservices?",
    "What is a service mesh?",
    "What is circuit breaking in microservices?",
    "What is eventual consistency?",
    "What is the CAP theorem?",
    "What is a distributed system?",
    "What is containerization?",
    "What is the 12-factor app methodology?",
    "What is blue-green deployment?",
    "What is a health check endpoint?"
  ],

  "Full Stack Developer": [
    "Explain the difference between frontend and backend development.",
    "What is a REST API and how do frontend and backend communicate?",
    "What is the MERN or MEAN stack?",
    "How do you manage state in a full stack application?",
    "What is the difference between server-side rendering and client-side rendering?",
    "Explain how authentication works end-to-end in a full stack app.",
    "What is a database ORM?",
    "How do you deploy a full stack application?",
    "What is CI/CD and why is it useful for full stack development?",
    "What are environment variables and why are they important?",
    "What is the difference between monolithic and microservices architecture?",
    "What is Docker and how does it help full stack development?",
    "What is a reverse proxy and when would you use Nginx?",
    "What is GraphQL and when would you prefer it over REST?",
    "What is WebSocket and when do you use it over HTTP?",
    "How do you handle CORS in a full stack app?",
    "What is JWT and how is it used for auth in a full stack app?",
    "What is the difference between session-based and token-based authentication?",
    "What is database indexing?",
    "What is connection pooling?",
    "What is Redis and why would you use it in a full stack app?",
    "What is a CDN and why would you use one?",
    "What is lazy loading?",
    "What is code splitting?",
    "What is server-side rendering with Next.js?",
    "What is TypeScript and why use it?",
    "What is the difference between SQL and NoSQL?",
    "How do you handle file uploads in a full stack app?",
    "What is a message queue and why use it?",
    "What is an API gateway?",
    "How do you handle errors across the full stack?",
    "What is logging and monitoring in a full stack app?",
    "What is rate limiting and how do you implement it?",
    "What is the N+1 query problem and how do you fix it?",
    "What is caching and where would you apply it?",
    "What is load balancing?",
    "What is horizontal vs vertical scaling?",
    "What is the 12-factor app?",
    "What is a health check endpoint?",
    "What is ACID compliance?",
    "What is database migration?",
    "What is a webhook?",
    "What is idempotency in APIs?",
    "What is the difference between PUT and PATCH?",
    "What is pagination in APIs?",
    "What is event-driven architecture?",
    "What is a service worker?",
    "What is a Progressive Web App (PWA)?",
    "How do you optimize a slow full stack application?",
    "What is blue-green deployment?"
  ],

  "Data Analyst": [
    "What is the difference between structured and unstructured data?",
    "What is data cleaning and why is it important?",
    "Explain the difference between mean, median, and mode.",
    "What is a pivot table and when would you use one?",
    "What are some common data visualization tools?",
    "What is SQL and how is it used in data analysis?",
    "What is the difference between correlation and causation?",
    "What is an outlier and how do you handle it?",
    "What is A/B testing?",
    "What is the purpose of exploratory data analysis (EDA)?",
    "What is the difference between qualitative and quantitative data?",
    "What is a KPI and how do you define one?",
    "What is data normalization?",
    "What is a JOIN in SQL? Name its types.",
    "What is the difference between HAVING and WHERE in SQL?",
    "What is a subquery?",
    "What is a window function in SQL?",
    "What is ETL and how does it work?",
    "What is a data warehouse?",
    "What is a data lake?",
    "What is the difference between OLTP and OLAP?",
    "What is a star schema in data warehousing?",
    "What is data aggregation?",
    "What is a histogram?",
    "What is a box plot?",
    "What is standard deviation?",
    "What is variance?",
    "What is the difference between accuracy and precision?",
    "What is a scatter plot used for?",
    "What is regression analysis?",
    "What is hypothesis testing?",
    "What is a p-value?",
    "What is the central limit theorem?",
    "What is data sampling?",
    "What is stratified sampling?",
    "What is a dashboard and what makes a good one?",
    "What is the difference between a bar chart and a histogram?",
    "What is data granularity?",
    "What is a time series?",
    "What is seasonality in data?",
    "What is cohort analysis?",
    "What is RFM analysis?",
    "What is funnel analysis?",
    "What is the difference between LAG and LEAD functions in SQL?",
    "What is data governance?",
    "What is a calculated field?",
    "What is the difference between a measure and a dimension?",
    "What is data blending in Tableau?",
    "What is Power BI and how does it work?",
    "How would you explain a complex data insight to a non-technical audience?"
  ],

  "Machine Learning Engineer": [
    "What is machine learning?",
    "Explain the difference between supervised and unsupervised learning.",
    "What is overfitting and how do you prevent it?",
    "What is a confusion matrix?",
    "Explain gradient descent.",
    "What is the difference between classification and regression?",
    "What is feature engineering?",
    "What is cross-validation?",
    "What is the bias-variance tradeoff?",
    "What are neural networks and how do they work?",
    "What is the difference between bagging and boosting?",
    "What is a random forest?",
    "What is XGBoost?",
    "What is a support vector machine (SVM)?",
    "What is k-means clustering?",
    "What is dimensionality reduction?",
    "What is PCA (Principal Component Analysis)?",
    "What is the curse of dimensionality?",
    "What is a learning rate?",
    "What is regularization? Explain L1 and L2.",
    "What is dropout in neural networks?",
    "What is batch normalization?",
    "What is transfer learning?",
    "What is a convolutional neural network (CNN)?",
    "What is a recurrent neural network (RNN)?",
    "What is LSTM?",
    "What is the difference between precision and recall?",
    "What is the F1 score?",
    "What is ROC-AUC?",
    "What is a loss function?",
    "What is mean squared error (MSE)?",
    "What is the difference between a generative and a discriminative model?",
    "What is a GAN?",
    "What is natural language processing (NLP)?",
    "What is tokenization?",
    "What is TF-IDF?",
    "What is word embedding?",
    "What is the transformer architecture?",
    "What is the attention mechanism?",
    "What is fine-tuning a pre-trained model?",
    "What is model deployment?",
    "What is MLOps?",
    "What is feature importance?",
    "What is SHAP?",
    "What is data augmentation?",
    "What is class imbalance and how do you handle it?",
    "What is SMOTE?",
    "What is the elbow method in k-means clustering?",
    "What is hyperparameter tuning?",
    "What is the difference between grid search and random search?"
  ],

  "DevOps Engineer": [
    "What is DevOps and what are its key principles?",
    "What is CI/CD?",
    "What is Docker and how does containerization work?",
    "What is Kubernetes?",
    "Explain infrastructure as code (IaC).",
    "What is a load balancer?",
    "What is the difference between blue-green and canary deployments?",
    "What is monitoring and why is it important in DevOps?",
    "What is Git and how do you use branching strategies?",
    "What is the difference between horizontal and vertical scaling?",
    "What is Terraform?",
    "What is Ansible?",
    "What is Jenkins?",
    "What is GitHub Actions?",
    "What is Docker Compose?",
    "What is a Kubernetes pod?",
    "What is the difference between a Kubernetes Deployment and a StatefulSet?",
    "What is Helm in Kubernetes?",
    "What is a service mesh?",
    "What is Istio?",
    "What is Prometheus?",
    "What is Grafana?",
    "What is the ELK stack?",
    "What is log aggregation?",
    "What is a reverse proxy?",
    "What is Nginx?",
    "What is a container registry?",
    "What is the difference between a Docker image and a container?",
    "What is a multi-stage Docker build?",
    "What is a rolling deployment?",
    "What is a health check?",
    "What is chaos engineering?",
    "What is Site Reliability Engineering (SRE)?",
    "What is an SLA, SLO, and SLI?",
    "What is incident management?",
    "What is an on-call rotation?",
    "What is a runbook?",
    "What is GitOps?",
    "What is ArgoCD?",
    "What is a secret manager?",
    "What is HashiCorp Vault?",
    "What is the difference between stateful and stateless applications?",
    "What is the Horizontal Pod Autoscaler (HPA) in Kubernetes?",
    "What is a namespace in Kubernetes?",
    "What is a ConfigMap in Kubernetes?",
    "What is a Secret in Kubernetes?",
    "What is network policy in Kubernetes?",
    "What is a DaemonSet?",
    "What is the sidecar container pattern?",
    "What is immutable infrastructure?"
  ],

  "Cloud Engineer": [
    "What is cloud computing?",
    "What are the differences between IaaS, PaaS, and SaaS?",
    "What is AWS S3 used for?",
    "Explain the concept of auto-scaling.",
    "What is a VPC (Virtual Private Cloud)?",
    "What is serverless computing?",
    "What is the difference between public, private, and hybrid cloud?",
    "What is cloud storage and how does it differ from local storage?",
    "What is IAM in cloud platforms?",
    "How do you ensure security in the cloud?",
    "What is AWS EC2?",
    "What is AWS Lambda?",
    "What is AWS RDS?",
    "What is AWS CloudFront?",
    "What is AWS Route 53?",
    "What is AWS CloudWatch?",
    "What is AWS EKS?",
    "What is AWS ECS?",
    "What is an availability zone?",
    "What is a region in AWS?",
    "What is AWS SQS?",
    "What is AWS SNS?",
    "What is Azure Active Directory?",
    "What is Azure Blob Storage?",
    "What is Google Cloud BigQuery?",
    "What is the shared responsibility model in cloud security?",
    "What is a cloud-native application?",
    "What is a multi-cloud strategy?",
    "What is disaster recovery in the cloud?",
    "What is RTO and RPO?",
    "What is a bastion host?",
    "What is a NAT gateway?",
    "What is an internet gateway in AWS?",
    "What is a subnet in a VPC?",
    "What is a security group in AWS?",
    "What is a network ACL?",
    "What is elastic load balancing?",
    "What is AWS CloudFormation?",
    "What is the difference between CloudFormation and Terraform?",
    "What is AWS Glue?",
    "What is AWS Kinesis?",
    "What is the difference between object, block, and file storage?",
    "What is data replication in the cloud?",
    "What is a CDN and how does AWS CloudFront work?",
    "What is the difference between reserved, on-demand, and spot instances?",
    "What is cloud cost optimization?",
    "What is resource tagging in cloud?",
    "What is cloud compliance (SOC2, ISO)?",
    "What is zero trust security?",
    "What is cloud migration and what are the 6 Rs?"
  ],

  "Cybersecurity Analyst": [
    "What is the CIA triad in cybersecurity?",
    "What is the difference between encryption and hashing?",
    "What is a firewall and how does it work?",
    "What is social engineering?",
    "Explain what a man-in-the-middle attack is.",
    "What is two-factor authentication?",
    "What is a vulnerability assessment?",
    "What is the difference between a virus and a worm?",
    "What is penetration testing?",
    "What is HTTPS and how does SSL/TLS work?",
    "What is a zero-day vulnerability?",
    "What is SQL injection?",
    "What is XSS (Cross-Site Scripting)?",
    "What is CSRF (Cross-Site Request Forgery)?",
    "What is a DDoS attack?",
    "What is ransomware?",
    "What is a phishing attack?",
    "What is spear phishing?",
    "What is a brute force attack?",
    "What is a rainbow table attack?",
    "What is salting a password?",
    "What is the difference between symmetric and asymmetric encryption?",
    "What is AES encryption?",
    "What is RSA encryption?",
    "What is a digital certificate?",
    "What is PKI (Public Key Infrastructure)?",
    "What is a VPN and how does it work?",
    "What is a DMZ in network security?",
    "What is network segmentation?",
    "What is the difference between an IDS and an IPS?",
    "What is SIEM?",
    "What is a Security Operations Center (SOC)?",
    "What is threat intelligence?",
    "What is the OWASP Top 10?",
    "What is the MITRE ATT&CK framework?",
    "What is a security audit?",
    "What is a risk assessment?",
    "What is GDPR and why does it matter for security?",
    "What is Data Loss Prevention (DLP)?",
    "What is endpoint security?",
    "What is multi-factor authentication (MFA)?",
    "What is Privileged Access Management (PAM)?",
    "What is the principle of least privilege?",
    "What is patch management?",
    "What is a honeypot?",
    "What is steganography?",
    "What is a security baseline?",
    "What is vulnerability scanning?",
    "What is ethical hacking?",
    "What is a security incident response plan?"
  ],

  "IT Support Specialist": [
    "What are the steps to troubleshoot a computer that won't turn on?",
    "What is DHCP and what does it do?",
    "What is the difference between TCP and UDP?",
    "How would you handle a user who forgot their password?",
    "What is a VPN and why is it used?",
    "What is the OSI model?",
    "How do you troubleshoot a slow network connection?",
    "What is Active Directory?",
    "What is remote desktop and how is it used for support?",
    "How do you prioritize multiple support tickets?",
    "What is the difference between a hub, switch, and router?",
    "What is DNS and how does it work?",
    "What is an IP address? Explain IPv4 vs IPv6.",
    "What is a subnet mask?",
    "What is a default gateway?",
    "What is ICMP and how is ping used?",
    "What is the difference between a workgroup and a domain?",
    "What is Group Policy in Windows?",
    "What is BIOS/UEFI?",
    "What is the difference between HDD and SSD?",
    "What is RAM and why does it matter?",
    "What is the difference between 32-bit and 64-bit operating systems?",
    "What is a driver and why do drivers need to be updated?",
    "How do you recover data from a corrupted drive?",
    "What is RAID and why is it used?",
    "What is a printer spooler and how do you fix spooler issues?",
    "What is an IP conflict and how do you resolve it?",
    "What is the difference between NTFS permissions and share permissions?",
    "How do you troubleshoot a Blue Screen of Death (BSOD)?",
    "What is safe mode and when do you use it?",
    "What is a system restore point?",
    "What is the difference between a virus and spyware?",
    "How do you remove malware from a computer?",
    "What is Windows Event Viewer?",
    "What is Task Manager and how do you use it for troubleshooting?",
    "What is a network adapter and how do you troubleshoot it?",
    "What is the difference between Wi-Fi 5 and Wi-Fi 6?",
    "What is a MAC address?",
    "What is NAT?",
    "What is a firewall and how does it protect a network?",
    "What is a ticketing system and how do you use it?",
    "What is ITIL?",
    "What is a knowledge base article?",
    "What is SLA in IT support?",
    "What is first call resolution (FCR)?",
    "What is escalation in IT support?",
    "What is patch management?",
    "How do you image a computer?",
    "What is PXE boot?",
    "How do you document a resolved issue?"
  ],

  "Technical Support Engineer": [
    "How do you diagnose a software issue reported by a user?",
    "What is an API error and how do you handle it?",
    "What is a log file and how do you use it for troubleshooting?",
    "How do you handle a client who is frustrated with a technical issue?",
    "What is the difference between hardware and software issues?",
    "Explain what a crash dump is.",
    "How do you document a resolved technical issue?",
    "What is escalation in technical support?",
    "What tools do you use for remote troubleshooting?",
    "What is SLA and why does it matter in support?",
    "What is a status code? Explain 200, 400, 401, 403, 404, 500.",
    "What is a REST API and how do you test one?",
    "What is Postman and how is it used in technical support?",
    "What is a timeout error and how do you diagnose it?",
    "What is latency and how does it affect application performance?",
    "What is a memory leak?",
    "What is CPU throttling?",
    "What is a stack trace and how do you read one?",
    "What is the difference between a bug, a defect, and an error?",
    "What is regression in software?",
    "What is a sandbox environment?",
    "What is a staging environment?",
    "What is the difference between a patch and a hotfix?",
    "How do you reproduce a bug reported by a customer?",
    "What is a use case vs a test case?",
    "What is browser cache and how do you clear it?",
    "What is a cookie and how does it affect a web session?",
    "What is CORS and why does it cause errors?",
    "What is an SSL certificate error?",
    "What is a DNS resolution failure?",
    "What is a 502 Bad Gateway error?",
    "What is a 503 Service Unavailable error?",
    "What is load testing?",
    "What is uptime and how is it measured?",
    "What is a failover?",
    "What is a rollback in software?",
    "What is a deployment and how can it cause support issues?",
    "What is version compatibility?",
    "What is a dependency conflict?",
    "How do you handle a P1 (critical) incident?",
    "What is a war room in incident management?",
    "What is a post-mortem analysis?",
    "What is root cause analysis (RCA)?",
    "What is MTTR (Mean Time To Resolve)?",
    "What is MTTF (Mean Time To Failure)?",
    "What is a customer success plan?",
    "What is technical documentation and why is it important?",
    "How do you communicate a technical outage to non-technical stakeholders?",
    "What is a knowledge base and how do you contribute to it?",
    "What is the difference between Tier 1, Tier 2, and Tier 3 support?"
  ],

  "System Administrator": [
    "What is the role of a system administrator?",
    "What is a file system and name common types.",
    "How do you manage user accounts in Linux?",
    "What is a cron job?",
    "What is RAID and what are its levels?",
    "How do you back up and restore a server?",
    "What is SSH and how is it used?",
    "What is a package manager?",
    "How do you monitor server performance?",
    "What is the difference between a process and a thread?",
    "What is systemd?",
    "What is the difference between /etc/passwd and /etc/shadow?",
    "What is chmod and how does it work?",
    "What is chown?",
    "What is a symbolic link vs a hard link?",
    "What is the difference between TCP and UDP?",
    "What is iptables?",
    "What is a firewall rule?",
    "What is NFS (Network File System)?",
    "What is Samba?",
    "What is LDAP?",
    "What is Active Directory and how does it integrate with Linux?",
    "What is a DNS server and how do you configure it?",
    "What is DHCP and how do you set it up?",
    "What is a mail server?",
    "What is Postfix?",
    "What is Apache web server?",
    "What is Nginx?",
    "What is a virtual host?",
    "How do you set up SSL/TLS certificates on a server?",
    "What is a disk partition?",
    "What is LVM (Logical Volume Manager)?",
    "What is swap space?",
    "What is the difference between ext4 and XFS?",
    "What is a kernel?",
    "What is a kernel panic?",
    "How do you troubleshoot a server that is not responding?",
    "What is top/htop and how do you use it?",
    "What is vmstat?",
    "What is netstat?",
    "What is tcpdump?",
    "What is rsync?",
    "What is a snapshot?",
    "What is high availability (HA)?",
    "What is a failover cluster?",
    "What is load balancing?",
    "What is a bastion host?",
    "What is patch management?",
    "What is configuration management? Name tools.",
    "What is Ansible and how is it used by sysadmins?"
  ],

  "Network Engineer": [
    "What is the OSI model and its layers?",
    "What is the difference between a router and a switch?",
    "What is subnetting?",
    "What is BGP?",
    "Explain NAT (Network Address Translation).",
    "What is a VLAN and why is it used?",
    "What is the difference between IPv4 and IPv6?",
    "What is a DNS server?",
    "What is QoS in networking?",
    "How do you troubleshoot a network outage?",
    "What is OSPF?",
    "What is EIGRP?",
    "What is the difference between static and dynamic routing?",
    "What is a routing table?",
    "What is ARP (Address Resolution Protocol)?",
    "What is ICMP?",
    "What is the difference between half-duplex and full-duplex?",
    "What is a trunk port?",
    "What is STP (Spanning Tree Protocol)?",
    "What is RSTP?",
    "What is a network topology?",
    "What is the difference between a star, ring, and mesh topology?",
    "What is MPLS?",
    "What is SD-WAN?",
    "What is a firewall and how do you configure one?",
    "What is a DMZ in networking?",
    "What is an ACL (Access Control List)?",
    "What is port forwarding?",
    "What is a proxy server?",
    "What is the difference between HTTP and HTTPS?",
    "What is a packet and how is it structured?",
    "What is MTU (Maximum Transmission Unit)?",
    "What is latency and how do you reduce it?",
    "What is the difference between bandwidth and throughput?",
    "What is jitter?",
    "What is a wireless access point?",
    "What is 802.11 and its common variants?",
    "What is the difference between WPA2 and WPA3?",
    "What is SSID?",
    "What is channel interference in Wi-Fi?",
    "What is a network protocol analyzer?",
    "What is Wireshark and how do you use it?",
    "What is traceroute and how does it work?",
    "What is ping and what does it tell you?",
    "What is a VPN tunnel?",
    "What is IPSec?",
    "What is GRE tunneling?",
    "What is network redundancy?",
    "What is HSRP/VRRP?",
    "What is a network audit?"
  ],

  "Business Analyst": [
    "What is the role of a business analyst?",
    "What is a Business Requirements Document (BRD)?",
    "How do you gather requirements from stakeholders?",
    "What is a use case diagram?",
    "What is gap analysis?",
    "How do you prioritize business requirements?",
    "What is a SWOT analysis?",
    "What is the difference between functional and non-functional requirements?",
    "How do you handle conflicting requirements from different stakeholders?",
    "What is process modeling?",
    "What is a user story?",
    "What is acceptance criteria?",
    "What is the difference between a business requirement and a system requirement?",
    "What is a feasibility study?",
    "What is a cost-benefit analysis?",
    "What is a stakeholder map?",
    "What is RACI?",
    "What is the difference between as-is and to-be process?",
    "What is a workflow diagram?",
    "What is BPMN?",
    "What is UML?",
    "What is the difference between Agile and Waterfall in a BA context?",
    "What is a sprint in Agile?",
    "What is a product backlog?",
    "What is backlog grooming?",
    "What is business process improvement?",
    "What is Six Sigma?",
    "What is the Lean methodology?",
    "What is root cause analysis?",
    "What is the 5 Whys technique?",
    "What is a fishbone diagram?",
    "What is a decision matrix?",
    "What is ROI and how do you calculate it?",
    "What is a KPI and how do you define one for a project?",
    "What is a dashboard and what should it contain?",
    "What is data modeling?",
    "What is an ER diagram?",
    "What is the difference between a use case and a user story?",
    "What is impact analysis?",
    "What is change management?",
    "What is scope creep and how do you prevent it?",
    "What is a project charter?",
    "What is the difference between a BA and a PM?",
    "What is a proof of concept (PoC)?",
    "What is a prototype in a BA context?",
    "What is the MoSCoW prioritization technique?",
    "What is a data flow diagram (DFD)?",
    "What is a wireframe and why does a BA need to understand it?",
    "What is a traceability matrix?",
    "How do you write a good user story?"
  ],

  "Product Manager": [
    "What is the role of a product manager?",
    "How do you prioritize features in a product roadmap?",
    "What is the difference between a product and a project?",
    "How do you define success metrics for a product?",
    "What is Agile methodology?",
    "How do you conduct user research?",
    "What is an MVP (Minimum Viable Product)?",
    "How do you handle a product that is not meeting its goals?",
    "What is product-market fit?",
    "How do you work with engineering teams to deliver a product?",
    "What is a product roadmap?",
    "What is OKR (Objectives and Key Results)?",
    "What is the difference between output and outcome?",
    "What is the RICE prioritization framework?",
    "What is the Kano model?",
    "What is the Jobs-to-be-Done (JTBD) framework?",
    "What is a product vision statement?",
    "What is a go-to-market strategy?",
    "What is the product lifecycle?",
    "What is a product backlog?",
    "What is sprint planning?",
    "What is a retrospective?",
    "What is a daily standup?",
    "What is a release plan?",
    "What is a feature flag?",
    "What is A/B testing in product management?",
    "What is user onboarding?",
    "What is churn rate?",
    "What is NPS (Net Promoter Score)?",
    "What is DAU/MAU?",
    "What is activation rate?",
    "What is retention rate?",
    "What is the North Star metric?",
    "What is funnel analysis?",
    "What is cohort analysis?",
    "What is the difference between qualitative and quantitative research?",
    "What is ethnographic research?",
    "What is a user persona?",
    "What is the difference between UX and UI?",
    "What is a customer journey map?",
    "What is competitive analysis?",
    "What is the difference between a feature and a product improvement?",
    "How do you say no to a stakeholder?",
    "What is technical debt and how does it affect product decisions?",
    "What is the Build-Measure-Learn cycle?",
    "What is a pivot in product strategy?",
    "What is the difference between freemium and premium pricing?",
    "What is Product-Led Growth (PLG)?",
    "How do you manage a product across multiple platforms?",
    "What is post-launch analysis?"
  ],

  "Project Manager": [
    "What is the role of a project manager?",
    "What is a project charter?",
    "What is the difference between Waterfall and Agile?",
    "How do you manage project risks?",
    "What is a Gantt chart?",
    "How do you handle a project that is behind schedule?",
    "What is scope creep and how do you prevent it?",
    "How do you manage stakeholder expectations?",
    "What is a Work Breakdown Structure (WBS)?",
    "How do you measure project success?",
    "What is a RACI matrix?",
    "What is the triple constraint in project management?",
    "What is a project baseline?",
    "What is Earned Value Management (EVM)?",
    "What is CPI (Cost Performance Index)?",
    "What is SPI (Schedule Performance Index)?",
    "What is a project kickoff meeting?",
    "What is a change control process?",
    "What is a change request?",
    "What is a project status report?",
    "What is a risk register?",
    "What is a RAID log?",
    "What is a sprint in Agile project management?",
    "What is a Kanban board?",
    "What is a burndown chart?",
    "What is velocity in Agile?",
    "What is a project post-mortem?",
    "What is the critical path method (CPM)?",
    "What is float/slack in project scheduling?",
    "What is resource leveling?",
    "What is a project milestone?",
    "What is a deliverable?",
    "What is a dependency in project planning?",
    "What is the difference between fast tracking and crashing a project?",
    "What is project closure?",
    "What is lessons learned in project management?",
    "What is a Statement of Work (SOW)?",
    "What is procurement management?",
    "What is a vendor contract?",
    "What is quality management in a project?",
    "What is the PMBOK guide?",
    "What is a PMP certification?",
    "What is PRINCE2?",
    "What is SAFe (Scaled Agile Framework)?",
    "What is the difference between a program and a project?",
    "What is portfolio management?",
    "What is an assumption log?",
    "What is issue management?",
    "What is communication planning?",
    "What is stakeholder engagement planning?"
  ],

  "HR Executive": [
    "Tell me about yourself.",
    "What motivated you to pursue a career in HR?",
    "How do you handle a conflict between two employees?",
    "What is your experience with recruitment and onboarding?",
    "How do you ensure employee engagement?",
    "What is your approach to performance management?",
    "How do you handle confidential employee information?",
    "What HR tools or software have you used?",
    "How do you stay updated with labor laws?",
    "Describe a time you resolved a difficult HR situation.",
    "What is the difference between recruitment and selection?",
    "What is employer branding?",
    "What is an ATS (Applicant Tracking System)?",
    "What is competency-based interviewing?",
    "What is the STAR method in interviews?",
    "What is a job description and how do you write one?",
    "What is a KRA (Key Result Area)?",
    "What is a PIP (Performance Improvement Plan)?",
    "What is 360-degree feedback?",
    "What is succession planning?",
    "What is talent management?",
    "What is learning and development (L&D)?",
    "What is a training needs analysis?",
    "What is the employee lifecycle?",
    "What is attrition and how do you reduce it?",
    "What is the difference between voluntary and involuntary turnover?",
    "What is an exit interview and why is it important?",
    "What is an Employee Value Proposition (EVP)?",
    "What is compensation and benefits management?",
    "What is a salary band?",
    "What is pay equity?",
    "What is HR analytics?",
    "What is headcount planning?",
    "What is an organizational chart?",
    "What is change management in an HR context?",
    "What is DEI (Diversity, Equity, and Inclusion)?",
    "What is psychological safety at work?",
    "What is an Employee Assistance Program (EAP)?",
    "What is the Prevention of Sexual Harassment (POSH) Act?",
    "What is a grievance redressal mechanism?",
    "What is HR compliance?",
    "What is the role of HR in a merger or acquisition?",
    "What is culture fit vs culture add?",
    "What is the difference between onboarding and induction?",
    "What is a probation period?",
    "What is an employee handbook?",
    "What is payroll processing?",
    "What are statutory compliance obligations in India?",
    "What is PF, ESI, and gratuity?",
    "How do you handle a termination process?"
  ],

  "Marketing Executive": [
    "What is your understanding of digital marketing?",
    "How do you measure the success of a marketing campaign?",
    "What is SEO and why is it important?",
    "What is the difference between B2B and B2C marketing?",
    "How do you identify your target audience?",
    "What is content marketing?",
    "How do you use social media for brand promotion?",
    "What is a marketing funnel?",
    "How do you handle a campaign that is underperforming?",
    "What tools do you use for marketing analytics?",
    "What is SEM (Search Engine Marketing)?",
    "What is PPC advertising?",
    "What is Google Ads and how does it work?",
    "What is Meta Ads Manager?",
    "What is email marketing?",
    "What is a drip campaign?",
    "What is marketing automation?",
    "What is HubSpot?",
    "What is CRM in a marketing context?",
    "What is lead generation?",
    "What is lead nurturing?",
    "What is a conversion rate?",
    "What is CTR (Click Through Rate)?",
    "What is CPA (Cost Per Acquisition)?",
    "What is CPM (Cost Per Mille)?",
    "What is ROI in marketing?",
    "What is influencer marketing?",
    "What is affiliate marketing?",
    "What is performance marketing?",
    "What is brand positioning?",
    "What is a USP (Unique Selling Proposition)?",
    "What is a buyer persona?",
    "What is the difference between inbound and outbound marketing?",
    "What is growth hacking?",
    "What is viral marketing?",
    "What is community marketing?",
    "What is event marketing?",
    "What is a product launch strategy?",
    "What is guerrilla marketing?",
    "What is omnichannel marketing?",
    "What is Customer Lifetime Value (CLV)?",
    "What is Customer Acquisition Cost (CAC)?",
    "What is market segmentation?",
    "What is psychographic segmentation?",
    "What are the 4Ps of marketing?",
    "What are the 7Ps of marketing?",
    "What is a brand style guide?",
    "What is competitor analysis in marketing?",
    "What is social proof?",
    "What is retargeting in digital advertising?"
  ],

  "Sales Executive": [
    "How do you approach a new sales prospect?",
    "What is your experience with CRM tools?",
    "How do you handle objections from a client?",
    "What is consultative selling?",
    "How do you manage your sales pipeline?",
    "What do you do when you fail to meet a sales target?",
    "How do you build long-term relationships with clients?",
    "What is upselling and cross-selling?",
    "How do you research a prospect before a meeting?",
    "Describe your best sales achievement.",
    "What is the difference between a lead and a prospect?",
    "What is the BANT framework?",
    "What is SPIN selling?",
    "What is the Challenger sales model?",
    "What is solution selling?",
    "What is value-based selling?",
    "What is the difference between inside sales and outside sales?",
    "What is cold calling and how do you make it effective?",
    "What is cold emailing?",
    "What is social selling?",
    "What is LinkedIn Sales Navigator?",
    "What is a sales pitch?",
    "What is an elevator pitch?",
    "What is a demo call and how do you prepare for one?",
    "What is a sales proposal?",
    "What is a sales contract?",
    "What is a follow-up strategy?",
    "What is churn in a sales context?",
    "What is customer retention?",
    "What is account management?",
    "What is Key Account Management (KAM)?",
    "What is a sales quota?",
    "What is a sales forecast?",
    "What is the difference between gross sales and net sales?",
    "What is ARR (Annual Recurring Revenue)?",
    "What is MRR (Monthly Recurring Revenue)?",
    "What is a sales funnel?",
    "What is lead scoring?",
    "What is a discovery call?",
    "What is objection handling?",
    "What is the difference between a feature, advantage, and benefit?",
    "What is negotiation in sales?",
    "What is BATNA in negotiation?",
    "What is a win-loss analysis?",
    "What is territory management?",
    "What is channel sales?",
    "What is a reseller?",
    "What is a referral program?",
    "What is after-sales service?",
    "What is NPS (Net Promoter Score) in a sales context?"
  ],

  "General HR Interview": [
    "Tell me about yourself.",
    "Why do you want this job?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "Describe a challenge you faced and how you overcame it.",
    "How do you handle pressure and tight deadlines?",
    "What motivates you at work?",
    "How do you work in a team?",
    "What are your salary expectations?",
    "Why are you leaving your current job?",
    "What do you know about our company?",
    "How do you handle failure?",
    "Describe your ideal work environment.",
    "What is your greatest professional achievement?",
    "How do you prioritize your work?",
    "Describe a time you showed leadership.",
    "How do you handle criticism?",
    "What do you do to improve yourself professionally?",
    "How do you manage work-life balance?",
    "Describe a time you worked with a difficult colleague.",
    "How do you stay organized?",
    "What are your hobbies and interests?",
    "How do you adapt to change?",
    "Describe a time you went above and beyond.",
    "What is your management style?",
    "How do you handle multiple tasks at once?",
    "What does success mean to you?",
    "How do you deal with ambiguity at work?",
    "Describe a time you made a mistake and how you fixed it.",
    "What skills do you want to develop?",
    "What kind of feedback do you prefer?",
    "How do you build trust with your team?",
    "Describe a time you influenced others without authority.",
    "How do you handle disagreements with your manager?",
    "What makes you unique as a candidate?",
    "Are you comfortable working remotely?",
    "How do you stay updated in your field?",
    "What is your approach to learning new skills?",
    "Describe a time you had to make a quick decision.",
    "How do you handle stress?",
    "What are your short-term career goals?",
    "What are your long-term career goals?",
    "How do you define teamwork?",
    "What is your experience with cross-functional teams?",
    "How do you handle a situation where you disagree with company policy?",
    "Describe a time you showed initiative.",
    "What values are important to you in a workplace?",
    "How do you ensure quality in your work?",
    "Do you have any questions for us?"
  ]

};

const InterviewSimulator = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewType, setInterviewType] = useState('technical');

  const [step, setStep] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const webcamRef = useRef(null);

const interviewCategories = {
  tech: {
    title: "Software / Tech Roles",
    icon: Code2,
    roles: [
      "Software Developer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Analyst",
      "Machine Learning Engineer",
      "DevOps Engineer",
      "Cloud Engineer",
      "Cybersecurity Analyst"
    ]
  },

  support: {
    title: "IT Support Roles",
    icon: Wrench,
    roles: [
      "IT Support Specialist",
      "Technical Support Engineer",
      "System Administrator",
      "Network Engineer"
    ]
  },

  business: {
    title: "Business Roles",
    icon: Briefcase,
    roles: [
      "Business Analyst",
      "Product Manager",
      "Project Manager",
      "HR Executive",
      "Marketing Executive",
      "Sales Executive"
    ]
  },

  hr: {
    title: "General HR Interview",
    icon: Users,
    roles: [
      "General HR Interview"
    ]
  }
};

  const mapRoleToInterviewType = (role) => {
    if (
      role.includes("Developer") ||
      role.includes("Engineer") ||
      role.includes("Analyst") ||
      role.includes("Administrator") ||
      role.includes("Cloud") ||
      role.includes("DevOps") ||
      role.includes("Cybersecurity") ||
      role.includes("Network") ||
      role.includes("Support")
    ) {
      return "technical";
    }
    if (role === "HR Executive" || role === "General HR Interview") {
      return "behavioral";
    }
    if (role === "Project Manager" || role === "Product Manager") {
      return "leadership";
    }
    return "general";
  };

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const speak = (text) => {
    return new Promise((resolve) => {
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onend = resolve;
        synthRef.current.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    setQuestionCount(0);
    setConversationHistory([]);
    setFeedback(null);

    // ── Pull questions from roleQuestionBank using the selected role ──
    const allQuestions = roleQuestionBank[selectedRole] || roleQuestionBank["General HR Interview"];

    const randomFour = [...allQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    setSelectedQuestions(randomFour);

    const greeting = `Hello! I'm your AI interviewer today. You are being interviewed for the ${selectedRole} role. Let's begin.`;
    await speak(greeting);

    askNextQuestion(randomFour, 0);
  };

  const askNextQuestion = async (questions = selectedQuestions, index = questionCount) => {
    setIsProcessing(true);

    if (index < questions.length) {
      const nextQuestion = questions[index];
      setCurrentQuestion(nextQuestion);
      setConversationHistory(prev => [
        ...prev,
        { role: "interviewer", text: nextQuestion }
      ]);
      setQuestionCount(prev => prev + 1);
      await speak(nextQuestion);
      startListening();
    } else {
      await generateFinalFeedback(conversationHistory);
    }

    setIsProcessing(false);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Could not start microphone. Please check browser permissions and try again.');
        setIsListening(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) return;

    stopListening();
    const answer = transcript;

    const updatedHistory = [
      ...conversationHistory,
      { role: "candidate", text: answer }
    ];

    setConversationHistory(updatedHistory);
    setTranscript("");

    if (questionCount >= selectedQuestions.length) {
      await generateFinalFeedback(updatedHistory);
    } else {
      await askNextQuestion(selectedQuestions, questionCount);
    }
  };

  const calculateCDI = (answer, questionData) => {
    let score = 0;
    const lowerAnswer = answer.toLowerCase();

    //  Concept Coverage (0–3)
    const conceptList = questionData?.concepts || questionData?.traits || [];
    let matched = 0;
    conceptList.forEach(item => { if (lowerAnswer.includes(item)) matched++; });
    if (matched >= conceptList.length * 0.7) score += 3;
    else if (matched >= conceptList.length * 0.4) score += 2;
    else if (matched > 0) score += 1;

    //  Example Usage (0–2)
    const exampleIndicators = ["for example", "for instance", "in my project", "in real world", "in my experience"];
    exampleIndicators.forEach(word => { if (lowerAnswer.includes(word)) score += 2; });

    //  Logical Reasoning (0–2)
    const logicIndicators = ["because", "therefore", "as a result", "which leads to", "so that", "hence"];
    let logicCount = 0;
    logicIndicators.forEach(word => { if (lowerAnswer.includes(word)) logicCount++; });
    if (logicCount >= 2) score += 2;
    else if (logicCount === 1) score += 1;

    //  Structural Depth (0–2)
    const wordCount = lowerAnswer.split(" ").length;
    const sentenceCount = lowerAnswer.split(/[.!?]+/).length;
    if (sentenceCount >= 3) score += 1;
    if (wordCount >= 50) score += 1;

    //  Abstraction Layer (0–1)
    const hasDefinition = lowerAnswer.includes("is defined as") || lowerAnswer.includes("is a");
    const hasApplication = lowerAnswer.includes("used in") || lowerAnswer.includes("applied in") || lowerAnswer.includes("real world");
    if (hasDefinition && hasApplication) score += 1;

    return Math.min(10, score);
  };

  const generateFinalFeedback = async (fullHistory) => {
    setIsProcessing(true);

    const answers = fullHistory.filter(item => item.role === "candidate");
    const questions = fullHistory.filter(item => item.role === "interviewer");

    // ── Look up scoring data using selectedRole as the dataset key ──
    const categoryData = interviewDataset[selectedRole];

    let technicalScore = 0;
    let communicationScore = 0;
    let confidenceScore = 0;
    let totalConcepts = 0;
    let matchedConcepts = 0;
    let totalCDI = 0;
    let questionAnalysis = [];

    for (let index = 0; index < answers.length; index++) {
      const answer = answers[index].text.toLowerCase();
      const question = questions[index]?.text;

      // Role-specific question data lookup
      const questionData = categoryData?.[question];

      const isGarbageAnswer = (answer) => {
  const words = answer.trim().split(/\s+/);

  if (words.length < 5) return true;

  const meaninglessWords = ["hello", "hi", "yes", "no", "ok"];
  const count = words.filter(w => meaninglessWords.includes(w.toLowerCase())).length;

  if (count > words.length * 0.6) return true;

  return false;
};

let mlScore = 0;

if (isGarbageAnswer(answer)) {
  mlScore = 0;
} else {
  mlScore = await getMLScore(question, answer);
}

      const cdiScore = calculateCDI(answer, questionData);

      const wordCount = answer.trim().split(/\s+/).length;

      let ruleWeight = 0.6;
      let mlWeight = 0.4;
      if (wordCount > 50) { ruleWeight = 0.4; mlWeight = 0.6; }
      if (wordCount < 20) { ruleWeight = 0.75; mlWeight = 0.25; }

      const hybridScore = (ruleWeight * cdiScore) + (mlWeight * mlScore);
      totalCDI += hybridScore;

      // Concept match % for display
      let conceptMatch = 0;
      const conceptList = questionData?.concepts || questionData?.traits || [];
      if (conceptList.length > 0) {
        let matched = 0;
        conceptList.forEach(c => { if (answer.includes(c)) matched++; });
        conceptMatch = Math.round((matched / conceptList.length) * 100);
      }

      questionAnalysis.push({
        question,
        ruleScore: Math.round(cdiScore),
        mlScore: Math.round(mlScore),
        hybridScore: Math.round(hybridScore),
        conceptMatch
      });

      // Technical/trait scoring
      if (questionData?.concepts) {
        totalConcepts += questionData.concepts.length;
        questionData.concepts.forEach(concept => {
          if (answer.includes(concept)) {
            matchedConcepts += 1;
            technicalScore += questionData.weight || 1;
          }
        });
      } else if (questionData?.traits) {
        totalConcepts += questionData.traits.length;
        questionData.traits.forEach(trait => {
          if (answer.includes(trait)) {
            matchedConcepts += 1;
            technicalScore += questionData.weight || 1;
          }
        });
      }

      const sentenceCount = answer.split(/[.!?]+/).length;
      if (wordCount > 40) communicationScore += 2;
      if (sentenceCount >= 3) communicationScore += 2;

      const hesitationWords = ["um", "uh", "like", "you know"];
      let hesitationCount = 0;
      hesitationWords.forEach(word => { if (answer.includes(word)) hesitationCount++; });
      confidenceScore += Math.max(0, 5 - hesitationCount);
    }

    const finalCDI = answers.length ? Math.round(totalCDI / answers.length) : 0;
    const conceptCoverage = totalConcepts ? Math.round((matchedConcepts / totalConcepts) * 100) : 0;
    const finalTechnical = Math.min(10, technicalScore);
    const finalCommunication = Math.min(10, communicationScore);
    const finalConfidence = Math.min(10, confidenceScore);
    const overallScore = Math.round((finalTechnical + finalCommunication + finalConfidence) / 3);

    let strengths = [];
    let improvements = [];

    if (conceptCoverage >= 60) strengths.push("Strong understanding of core concepts");
    if (finalCommunication >= 6) strengths.push("Clear and structured communication");
    if (finalConfidence >= 7) strengths.push("Confident response delivery");
    if (finalCDI >= 7) strengths.push("Good analytical reasoning and depth of explanation");
    if (answers.length >= 4) strengths.push("Completed the full interview session");

    if (conceptCoverage < 50) improvements.push({ area: "Concept Understanding", score: conceptCoverage, feedback: "Try to include more role-specific concepts in your answers." });
    if (finalCommunication < 5) improvements.push({ area: "Communication", score: finalCommunication, feedback: "Explain answers in more structured sentences." });
    if (finalConfidence < 5) improvements.push({ area: "Confidence", score: finalConfidence, feedback: "Reduce hesitation words and speak more confidently." });
    if (finalCDI < 5) improvements.push({ area: "Depth of Reasoning", score: finalCDI, feedback: "Provide examples and explain cause-effect relationships." });

    const feedbackData = {
      overallScore,
      conceptCoverage,
      communication: finalCommunication,
      confidence: finalConfidence,
      cognitiveDepth: finalCDI,
      summary:
        overallScore >= 8
          ? "Excellent structured performance with strong clarity."
          : overallScore >= 5
          ? "Good attempt. Improve depth and confidence."
          : "Needs improvement in explanation and structure.",
      strengths: strengths.length
        ? strengths
        : ["Good attempt. Continue practicing to improve your performance."],
      areasForImprovement: improvements,
      questionAnalysis
    };

    try {
  await saveInterview({
    role:          selectedRole,
    interviewType: interviewType,
    score:         overallScore,
    feedback:      feedbackData,
    date:          new Date().toLocaleString(),
  });
} catch (err) {
  console.error("Failed to save interview to DB:", err);
}

    setFeedback(feedbackData);
    await speak(`Interview complete. Your overall score is ${overallScore} out of 10.`);
    setIsProcessing(false);
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setCurrentQuestion('');
    setTranscript('');
    setConversationHistory([]);
    setFeedback(null);
    setQuestionCount(0);
    setStep("category");
    setSelectedCategory(null);
    setSelectedRole(null);
    stopListening();
    if (synthRef.current) synthRef.current.cancel();
  };

// ─── START SCREEN ─────────────────────────────────────────────────────────
  if (!interviewStarted) {
    // Inject Plus Jakarta Sans if not already loaded
    if (typeof document !== "undefined" && !document.getElementById("pjs-font")) {
      const link = document.createElement("link");
      link.id = "pjs-font";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
    return (
      /*
        FULL-BLEED WRAPPER
        Uses negative margins to break out of whatever padding the parent router
        or layout shell adds. Adjust the negative values if your layout uses
        different padding (e.g. -mx-6 if parent has px-6, -mx-8 if px-8, etc.)
        The -mx-6 md:-mx-12 matches the layout shell's px-6 md:px-12 padding.
      */
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col"
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        {/* ── HEADER ── */}
        <div
          className="w-full text-center border-b border-emerald-100"
          style={{ padding: "40px 48px 32px" }}
        >
          <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "2.2rem",
              color: "#064e3b",
              letterSpacing: "-0.04em",
              marginBottom: 8,
            }}
          >
            InterviewAI
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Practice smarter. Get AI-powered feedback instantly.
          </p>
        </div>

        {/* ── BODY — full width, generous padding on sides only ── */}
        <div
          className="flex-1 flex flex-col"
          style={{ padding: "36px 48px 48px", width: "100%", boxSizing: "border-box" }}
        >

          {/* Step content */}
          <div style={{ width: "100%" }}>
            {step === "category" && (
              <InterviewCategory
                interviewCategories={interviewCategories}
                setSelectedCategory={setSelectedCategory}
                setStep={setStep}
              />
            )}

            {step === "role" && selectedCategory && (
              <InterviewRoles
                selectedCategory={selectedCategory}
                interviewCategories={interviewCategories}
                setSelectedRole={setSelectedRole}
                selectedRole={selectedRole}
                setInterviewType={setInterviewType}
                mapRoleToInterviewType={mapRoleToInterviewType}
                setStep={setStep}
              />
            )}
          </div>

          {/* ── CTA ── */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>

            {selectedRole && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "10px 16px", borderRadius: 12,
                background: "rgba(255,255,255,0.7)", border: "1px solid #a7f3d0",
                alignSelf: "flex-start",
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#10b981", boxShadow: "0 0 6px #10b981",
                }} />
                <span style={{ color: "#6b7280", fontSize: "0.82rem" }}>Selected:</span>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                  fontSize: "0.85rem", color: "#064e3b",
                }}>
                  {selectedRole}
                </span>
              </div>
            )}

            <button
              onClick={() => {
                if (!selectedRole) { alert("Please select a role first"); return; }
                startInterview();
              }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "17px 0",
                fontSize: "1rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.3)";
              }}
            >
              <PlayCircle style={{ width: 20, height: 20 }} />
              Begin Interview Session
            </button>

            <div style={{
              padding: "14px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.5)", border: "1px solid rgba(167,243,208,0.4)",
            }}>
              <p style={{ color: "#6b7280", fontSize: "0.8rem", lineHeight: 1.6 }}>
                <strong style={{ color: "#374151" }}>How it works:</strong> Select your role → Answer 4 AI-generated questions via microphone → Receive a detailed performance report.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  // ─── FEEDBACK SCREEN ──────────────────────────────────────────────────────
if (feedback) {
  return (
    <InterviewFeedback
      feedback={feedback}
      resetInterview={resetInterview}
      selectedRole={selectedRole}
    />
  );
}

  // ─── INTERVIEW IN PROGRESS SCREEN ─────────────────────────────────────────
  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview in Progress</h1>
              <p className="text-sm text-emerald-600 font-medium mt-1">{selectedRole}</p>
            </div>
            <div className="text-sm text-gray-600">Question {questionCount} of 4</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(questionCount / 4) * 100}%` }}
            ></div>
          </div>

          <div className="absolute top-6 right-6">
            <Webcam
              ref={webcamRef}
              audio={false}
              width={200}
              height={150}
              className="rounded-lg shadow-md border"
            />
          </div>

          <div className="mb-8 p-8 bg-emerald-50 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-8 h-8 text-emerald-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2">Interviewer:</p>
                <p className="text-gray-700">{currentQuestion || "Preparing next question..."}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900">Your Answer:</p>
              {isListening && (
                <div className="flex items-center gap-3 text-red-600 text-sm">
                  <span className="font-semibold">Recording</span>
                  <div className="flex items-end gap-1 h-4">
                    <span className="w-1 bg-red-500 animate-wave1"></span>
                    <span className="w-1 bg-red-500 animate-wave2"></span>
                    <span className="w-1 bg-red-500 animate-wave3"></span>
                    <span className="w-1 bg-red-500 animate-wave4"></span>
                    <span className="w-1 bg-red-500 animate-wave5"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-700">
                {transcript || "Click the microphone and start speaking..."}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            {!isListening ? (
              <button
                onClick={startListening}
                disabled={isProcessing}
                className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Mic className="w-5 h-5" />
                Start Speaking
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <MicOff className="w-5 h-5" />
                Stop Speaking
              </button>
            )}

            <button
              onClick={submitAnswer}
              disabled={!transcript.trim() || isListening || isProcessing}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Submit Answer"}
            </button>
          </div>

          <button
            onClick={resetInterview}
            className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
          >
            <StopCircle className="w-5 h-5" />
            End Interview
          </button>
        </div>

        {conversationHistory.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-xl p-4 max-h-40 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation History</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversationHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    item.role === "interviewer"
                      ? "bg-emerald-50 border-l-4 border-emerald-600"
                      : "bg-green-50 border-l-4 border-green-600"
                  }`}
                >
                  <p className="font-semibold text-sm mb-1">
                    {item.role === "interviewer" ? "Interviewer" : "You"}
                  </p>
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;