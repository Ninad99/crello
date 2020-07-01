# Contributing to Crello

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

The following is a set of guidelines for contributing to Crello on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table of contents:

1. [Code of Conduct](#code-of-conduct)
2. [How can I contribute?](#how-can-i-contribute)
  - [Reporting bugs](#reporting-bugs)
  - [Suggesting enhancements/Feature requests](#suggesting-enhancementsfeature-requests)
  - [Code contribution/Pull requests](#code-contributionpull-requests)
3. [Setup instructions](#setup-instructions)

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](). By participating, you are expected to uphold this code.

## How can I contribute?

There are many ways you can contribute to the repository. These include:

### Reporting bugs

_How Do I Submit A (Good) Bug Report?_

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps.**
- **Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.**
- **Explain which behavior you expected to see instead and why.**
- Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem if possible.

### Suggesting enhancements/Feature requests

_How Do I Submit A (Good) Enhancement Suggestion?_

- **Use a clear and descriptive title for the issue to identify the suggestion.**
- **Provide a step-by-step description of the suggested enhancement in as many details as possible.**
- **Provide specific examples to demonstrate the steps.** Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github#multiple-lines).
- **Describe the current behavior and explain which behavior you expected to see instead and why.**
- **Explain why this enhancement would be useful.**

### Code contribution/Pull requests

_How Do I Submit A (Good) Pull Request?_

- **Use a clear and descriptive title for the pull request to signify what your changes are.**
- **Provide a step-by-step description of the changes in as many details as possible.**
- **Attach screenshots or animated GIFs which show the changes that have been made.**
- **Please verify that there are no lint errors.** A prettier config file already exists in the repository. Please follow the predefined code formatting style that has been set in the config file.
- **Please verify that all the tests are passing.** Any breaking tests will not be accepted. If you feel that your change breaks a predefined test, then please explain in the comment why the test is breaking and what changes you suggest.

## Setup instructions

1. Fork this repository and clone it locally.
2. Create a firebase project and get your config details.
3. Create a .env file with the following content, and replace the credentials with your own:
```
FIREBASE_API_KEY={YOUR_FIREBASE_API_KEY}
FIREBASE_AUTH_DOMAIN={YOUR_FIREBASE_AUTH_DOMAIN}
FIREBASE_DATABASE_URL={YOUR_FIREBASE_DATABASE_URL}
FIREBASE_PROJECT_ID={YOUR_FIREBASE_PROJECT_ID}
FIREBASE_STORAGE_BUCKET={YOUR_FIREBASE_STORAGE_BUCKET}
FIREBASE_MESSAGING_SENDER_ID={YOUR_FIREBASE_MESSAGING_SENDER_ID}
FIREBASE_APP_ID={YOUR_FIREBASE_APP_ID}
FIREBASE_MEASUREMENT_ID={YOUR_FIREBASE_MEASUREMENT_ID}
```
4. Run `npm start` to start the local development server.