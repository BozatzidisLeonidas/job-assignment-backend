import Parse from 'parse/node.js';

export const initializeParse = () => { 
  Parse.initialize( //Kanw initialize ton Parse server,ton kanw introduce. 
    process.env.APP_ID, //
    '', //The JavaScript key (deprecated in modern Parse setups, so it’s left empty).
    process.env.MASTER_KEY //An to exw, exw full control sthn bash. Den to vazw front end gia eynohtoys logoys
  );
  Parse.serverURL = process.env.SERVER_URL; //Poy prepei na stelnw ta request, defines the endpoints
}; 

/* What is the Parse SDK?
The Parse SDK (Software Development Kit) is essentially a library equipped with a collection of pre-defined functions and tools. It facilitates seamless communication between your application (whether it's web, mobile, or desktop) and the Parse Server, which manages backend services like databases and user authentication.​

How Does It Benefit You?
By integrating the Parse SDK into your project, you gain access to a variety of ready-made features, including:​

Data Management: Effortlessly create, read, update, and delete data objects on the Parse Server without constructing complex API calls.​
Parse

User Authentication: Implement user signup, login, and session management with minimal coding effort.​

File Storage: Upload and retrieve files such as images or documents directly through the SDK.​

Real-time Queries: Set up live queries to receive immediate updates when data changes on the server.​

This abstraction allows you to focus on developing your application's unique features rather than dealing with the intricacies of backend communication.*/
