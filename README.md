# JavaScript Project Instructions

<!-- toc -->

- [Overview](#overview)
- [Objectives](#objectives)
- [Technical and Complexity Requirements](#technical-and-complexity-requirements)
- [What to Expect in Your Project Review](#what-to-expect-in-your-project-review)
- [Example Projects](#example-projects)

<!-- tocstop -->

## <a id="overview"></a>Overview

Welcome to your JavaScript Project!

You are going build a Single Page Application (**SPA**). Your frontend will be built with HTML, CSS, and JavaScript. Your frontend will communicate with a backend API that you'll build with Ruby and Rails. This is a really exciting moment - the whole course up until this point is coming together!

## <a id="objectives"></a>Objectives

Your goals with this project:

- Design and architect features across frontend and backend
- Integrate JavaScript and Rails
- Debug issues in small- to medium-sized projects
- Build and iterate on a project MVP
- Communicate in a technical environment

## <a id="technical-and-complexity-requirements"></a>Technical and Complexity Requirements

In order to demonstrate your proficiency with what you've learned about web development with JavaScript, here are the requirements for your project. You should view these guidelines as a minimum bar for the features you include in your application. It's your project, and you are encouraged to go above and beyond these requirements.

1. The application must be an HTML, CSS, and JavaScript frontend with a Rails API backend. All interactions between the client and the server must be handled asynchronously (AJAX) and use JSON as the communication format.

2. The JavaScript application be organized by encapsulating related data and behavior. This can be acheived through Object Oriented JavaScript (`class`es), Object composition, or some combination of these approaches.

3. The domain model served by the Rails backend must include a resource with at least one has-many relationship. For example, if you were building an Instagram clone, you might display a list of photos with associated comments.

4. The backend and frontend must collaborate to demonstrate Client-Server Communication. Your application should have at least 3 AJAX calls, one or more of which should not be a GET request. Your client-side JavaScript code must use `fetch` with the appropriate HTTP verb, and your Rails API should use RESTful conventions.

5. Your Ruby code should adhere to Nitro's linting conventions. Included in this repo is a copy of those configurations (`.rubocop.yml`).

Within these constraints, there is a huge variety of applications that you might build. Take some time to brainstorm the application you'd like to build. Take a look at the [example projects](#example-projects) at the bottom of this page for inspiration. You should build something that you are excited to talk about. That means being excited about the features you build and the technology that you use. Check in with your instructor before getting started to make sure your idea will meet the criteria above.

After deciding on your project's goal, check out the [Project Planning Tips](https://github.com/powerhome/phrg-js-spa-project/blob/master/project-planning-tips.md) included in this repository.

### Best Practices

You are encouraged to follow development best practices while you are building your application.

#### JavaScript

- [ ] Organize your code into reusable pieces.
- [ ] Translate JSON responses.
- [ ] Use ES6 features (e.g. arrow functions, `let` & `const`, rest and spread syntax).

#### Rails

- [ ] Follow Rails MVC and RESTful conventions. That means, for example, that a request `GET /puppies` ought to be handled by the `PuppiesController`, fetch puppies from the database using a `Puppy` Active Record model, and return a list of puppies as JSON.
- [ ] Well-named variables and methods
- [ ] Short, single-purpose methods

#### Git

- [ ] Aim for a large number of small commits - commit frequently!
- [ ] Add meaningful messages to your commits. When you look back at your commits with `git log`, the messages should describe each change.
- [ ] Don't include changes in a commit that aren't related to the commit message

### Suggested Project Structure

There is no requirement for how you decide to structure the code within that repo, but in the past, students have had success using a structure like:

```txt
javascript-project/
  backend/
    app/
    (...other rails files and folders)
  frontend/
    index.html
    style.css
    index.js
  README.md
```

For more about setting up your backend, reference the lesson on [Creating a Rails API from Scratch](https://github.com/learn-co-curriculum/js-rails-as-api-creating-a-rails-api-from-scratch) and the [Setup Walkthrough](https://github.com/powerhome/phrg-js-spa-project/blob/master/setup-walkthrough.md) included in this repository.

## <a id="what-to-expect-in-your-project-review"></a>What To Expect In Your Project Review

### What should you be prepared for in Project Review?

During your project review, be prepared to:

1. Explain your code from execution point to exit point. Use the best technical vocabulary you can.
2. Live code. This could be refactoring, adding a new feature, or both.
3. Answer questions about your knowledge of _JavaScript Fundamentals_.

In particular, the JavaScript Fundamentals concepts your reviewer may ask about include:

- variables
- data structures
- functions
- hoisting
- scope
- context
- `this`
- closures
- ES6 syntax
- `let`, `const`
- arrow functions

### Learning Goals

These are the skills and knowledge that you should aim to demonstrate through the project review.

- Explain how Rails routes a request to a controller and method based on the URL and HTTP verb
- Use `render json:` to render serialized JSON
- Select, Create, and Modify DOM nodes
- Attach listeners to DOM nodes to respond to user interaction
- Use `preventDefault` to control form submit behavior
- Use `fetch` with 'GET', 'POST', 'PATCH' & 'DELETE' HTTP methods
- Instantiate JavaScript objects and call methods on them.

## <a id="example-projects"></a>Example Projects

- [Beat Machine](https://beat-machine.com/)
- [Bounce Game](http://bounce-123.s3-website-us-east-1.amazonaws.com/)
- [Words With Nerds™](https://wordswithnerds.herokuapp.com/)
- [Remixer](https://remixer-v2.firebaseapp.com/)
- [Keyboard Karaoke](https://keyboard-karaoke.herokuapp.com/)
