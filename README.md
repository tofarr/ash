## Description

This project is intended to help beleaguered Accounts Servants to record and report on accounts. Have you ever spent way too much time trying to figure out where you made a mistake in recording or basic arithmetic? (I know I have!)

This app does not record any data externally: everything is stored on your device (In my case an Android phone). It is recommended that you use the backup functionality to store a backup of the data to an external source, though I will leave it up to you as to where (e.g.: Dropbox, Google Drive, iCloud)

Get started today at https://tofarr.github.io/ash

The standard use case for me is to use this app on my phone to record the contents of boxes at meetings (where it calculates totals for me), deposits to the bank (which it calculates default values for based upon what was previously collected), and then generate the required S26, S30, and TO62 forms. It will also warn of oddities such as missing meetings, potential duplicate transactions, and more.

## Known Issues

* The PDF library used seems to not work with Adobe Reader. The built in reader in chrome seems to work, but has some issues (Total Values disappear if the document is manually edited)

## Development

This is currently hosted on github, with a version of the actual files hosted on on github pages - I figure that's as good a place as any considering that it only uses static files, and does not have any external dependencies.

It is set up as a Progressive Web App - hopefully this platform has matured enough at this point that there will not be issues between iPhone / android, but I cannot yet guarantee this. (You can help here!)

## Technologies Used

* ReactJS (https://reactjs.org/)
* MaterialUI (https://material-ui.com/)
* Dexie (https://dexie.org/)
* pdfform (https://github.com/phihag/pdfform.js/blob/master/README.md)


## Available Scripts

The standard react scripts are available. In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Aside from this, there is a custom distribution script which runs a build then copies the content to /docs, which can be pushed to github pages.

### `npm dist`
