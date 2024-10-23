#  Rule Engine with AST

## Objective

The Rule Engine application is a 3-tier system designed to determine user eligibility based on attributes such as age, department, income, and spend. The application uses an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic creation, combination, and modification of these rules.

## Table of Contents

   1. [Architecture](#architecture)
   2. [Data Structure](#data-structure)
   3. [Project Structure](#project-structure)
   4. [Data Storage](#data-storage)
   5. [API Design](#api-Design)
   6. [Setup Instructions](#setup-instructions)
   7. [Testing](#testing)
   8. [Bonus Features](#bonus-features)
   9. [Contact](#for-queries-contact)

## Architecture

Raft is a consensus algorithm designed to be easy to understand. This project implements key functionalities of Raft, including leader election and log replication, to provide fault tolerance in a distributed system. The implementation includes handling scenarios like network partitioning and node recovery.

## Data Structure

  * The data structure used to represent the AST is as follows:
```
    class Node {
    constructor(nodeType, left = null, right = null, value = null) {
        this.type = nodeType; // "operator" for AND/OR, "operand" for conditions
        this.left = left;     // Left child node
        this.right = right;   // Right child node
        this.value = value;   // Condition value for operand nodes
    }
}

```

## Project Structure

The project directory is organized as follows:

```
/rule-engine
│
├── /backend
│   ├── /config
│   │   └── db.js
│   ├── /controllers
│   │   └── ruleController.js
│   ├── /models
│   │   └── Rule.js
│   ├── /routes
│   │   └── rules.js
│   ├── /utils
│   │   └── ruleEngine.js
│   ├── package.json
│   └── server.js
│
├── /frontend
│   ├── /components
│   │   ├── ASTDisplay.js
│   │   ├── EvaluationForm.js
│   │   └── RuleForm.js
│   ├── /pages
│   │   └── index.js
│   ├── package.json
│   └── next.config.js
│
├── README.md
└── .env
```

Backend

  * `/backend`: Contains the backend application files.

     * `/config/db.js`: This file establishes the connection to the MongoDB database using Mongoose. It handles error logging for failed connections and exports the connection function.

     * `/controllers/ruleController.js`: This file contains the logic for handling API requests related to rules, such as adding, retrieving, deleting, and updating rules. It communicates with the MongoDB database through the `Rule` model.

     * `/models/Rule.js`: This defines the Mongoose schema for the rules, including the structure for `ruleString` and `ast`. This model represents the data structure for rules in the MongoDB collection.

     * `/routes/rules.js`: This file defines the Express routes for the rules API. It maps HTTP requests to the appropriate controller functions, such as `addRule`, `getRules`, and `deleteRule`.

     * `/utils/ruleEngine.js`: This file implements the core logic for the rule engine, including the `Node` class for the AST and methods for creating, combining, and evaluating rules. This is where the AST representation and evaluation logic reside.

     * `package.json`: Contains the project metadata, scripts for running the server, and dependencies required for the backend, such as Express, Mongoose, and body-parser.

     * `server.js`: The entry point of the backend application. It initializes the Express server, sets up middleware, and defines the API endpoint for handling rule-related requests.

Frontend

  * `/frontend`: Contains the frontend application files built with Next.js.

     * `/components`: This directory holds reusable React components used in the application.

        * `ASTDisplay.js`: Component for displaying the Abstract Syntax Tree (AST) generated from the rules. This provides a visual representation of the rules.

        * `EvaluationForm.js`: Component for evaluating the rules against user-provided data. It collects input data and displays the evaluation result.

        * `RuleForm.js`: Component for adding new rules. It includes a form for users to input rule strings and submit them to the backend.

     * `/pages/index.js`: The main page of the application, which renders the overall UI, including the form for adding rules, lists of existing rules, and buttons for editing and deleting rules.

     * `package.json`: Contains metadata for the frontend project, including dependencies like React and Next.js, and scripts for development and production builds.

     * `next.config.js`: Configuration file for Next.js, where you can specify various settings for your Next.js application (if necessary).

Other Files

   * `README.md`: A comprehensive documentation file for the project. This should include an overview of the application, setup instructions, usage, and any additional notes or guidelines for development.

   * `.env`: A file for storing environment variables, such as the MongoDB URI. This should not be committed to version control to keep sensitive information secure.

## Data Storage

### Database Choice

   * Database: MongoDB (using Mongoose for object data modeling)

### MongoDB Schema

```
const RuleSchema = new mongoose.Schema({
    ruleString: {
        type: String,
        required: true,
    },
    ast: {
        type: Object,
        required: true,
    }
});

```

### Sample Data

  * Rule 1: `((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)`
  * Rule 2: `((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)`

## API Design

### Endpoints

  1. Create Rule
        `POST /api/rules`
        Request Body: `{ "ruleString": "<rule_string>" }`
        Response: The created rule with its AST.

  2. Get All Rules
        `GET /api/rules`
        Response: An array of all rules.

  3. Delete Rule
        `DELETE /api/rules/:id`
        Response: No content (204).

  4. Get Combined Rules
        `GET /api/rules/combine`
        Response: The combined AST of all rules.

  5. Evaluate Rule
        `POST /api/rules/evaluate`
        Request Body: `{ "ast": <AST>, "data": { "age": 35, "department": "Sales", "salary": 60000, "experience": 3 } }`
        Response: `{ "result": true/false }`

## Setup Instructions

### Prerequisites

  * Node.js (v14 or later)
  * MongoDB (local or Atlas account)

### Clone repository

* Go to the file location you want to clone the application
  
```
git clone https://github.com/harshapatil7/Rule-Engine-with-AST.git
cd Rule-Engine-with-AST
```

### Backend Setup

1. Navigate to the `backend` directory:
```
cd backend
```
3. Install dependencies:
```
npm install
```
3. Create a `.env` file in the `backend` directory with the following content:
```
PORT=5000
MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<database>
```
4. To run the backend:
```
npm run dev
```

### Frontend Setup

1. Navigate to the `frontend` directory:
```
cd frontend
```
3. Install dependencies:
```
npm install
```
4. To run the Frontend:
```
npm run dev
```
5. Now open the `web browser`
```
http://localhost:3000/
```

## Testing

## Bonus Features

* Implement error handling for invalid rule strings or data formats.
* Allow modification of existing rules.
* Visual Display of the `AST of Rules` for users. 

## Expected Behavior

## Things you go through before starting

### Installing Node.js (v14 or Later)

  1. Visit the Node.js Website: Go to the official [Node.js download page](https://nodejs.org/en/download/prebuilt-installer).

  2. Choose the Version:
        * Select the LTS (Long Term Support) version, which is recommended for most users.
        * Ensure that the version is 14 or later (the current LTS version will typically be displayed on the download page).

  3. Download the Installer:
        * Select the Operating System and processor architectures.
        * Download it.

  4. Run the Installer:
        * Follow the prompts in the installer to complete the installation.

  5. Verify the Installation:
        * Open a terminal or command prompt and run the following command:
          ```
          node -v
          ```
        * You should see the version number, which confirms that Node.js is installed successfully.

  6. Install npm (Node Package Manager):

        * npm is included with Node.js installation. To verify, run:
          ```
          npm -v
          ```
        
### Installing MongoDB (Local Installation)

  1. Visit the MongoDB Download Page: Go to the official [MongoDB Community Server download page](https://www.mongodb.com/try/download/community).

  2. Choose Your Version:
        * Select the desired version and your operating system (Windows, macOS, or Linux).
        * Click Download to get the installer.

  3. Run the Installer:
        * Follow the installation instructions provided for your specific operating system:
            * Windows: Run the `.msi` installer and follow the prompts. You can select the option to install as a service if you want MongoDB to start automatically.
            * macOS: You can use the Homebrew package manager by running the following command:
              ```
              brew tap mongodb/brew
              brew install mongodb-community
              ```
            * Linux: Follow the instructions provided for your specific distribution.

  4. Start MongoDB:
        * After installation, you can start MongoDB using:
          ```
          mongod
          ```
        * This command starts the MongoDB server. Ensure you have created the necessary directories for MongoDB data if prompted.

  5. Verify the Installation:

        * Open a new terminal window and run:
          ```
          mongo
          ```
        * You should see the MongoDB shell prompt, indicating that the installation was successful.

### Using MongoDB Atlas (Cloud Installation)

  1. Sign Up for an Account:
        Go to the [MongoDB Atlas website](https://www.mongodb.com/products/platform/atlas-database) and create an account.

  2. Create a New Cluster:
        Once logged in, click on the **"Build a Cluster"** button.
        Choose the free tier option and follow the prompts to select your cloud provider and region.

  3. Configure Cluster:
        After your cluster is created, you’ll need to set up database access by creating a user with a username and password.

  4. Get the Connection String:
        Go to your cluster in the Atlas dashboard, click on the **"Connect"** button, and choose **"Connect your application"**.
        Copy the connection string provided, replacing `<password>` with the password for the user you created.

  5. Connect Using MongoDB Compass (Optional):
        You can also use [MongoDB Compass](https://www.mongodb.com/try/download/compass) for a graphical interface to manage your databases. Download and install Compass, then use the connection string to connect to your Atlas cluster.

## For queries contact

**Harsha Patil:** [**harshapatil.hp01@gmail.com**](mailto:harshapatil.hp01@gmail.com)
