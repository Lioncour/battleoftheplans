# Battle of Plans 2024 - Static Version

This is a simple static HTML version of the Battle of Plans application. No server, no npm, no build process needed!

## How to Use

1. **Open the application**: Simply double-click `index.html` or open it in any web browser
2. **Update data**: Edit `data.js` to change participants, forecasts, or predictions
3. **Update styling**: Edit `styles.css` to change colors, layout, or appearance
4. **Update functionality**: Edit `app.js` to change behavior

## Files

- `index.html` - The main HTML file
- `styles.css` - All the styling
- `data.js` - All the data (participants and forecasts)
- `app.js` - All the JavaScript functionality
- `avatar/` - Folder containing participant avatar images

## Features

✅ **Leaderboard** - Shows all participants with scores  
✅ **Avatar hover effects** - Avatars scale up significantly on hover  
✅ **Forecast cards** - Stacked vertically with click-to-expand  
✅ **Predictions display** - Shows what each participant predicted  
✅ **Bottom timeline** - Horizontal timeline at the bottom  
✅ **No server needed** - Works completely offline  

## Updating Data

To add new forecasts or participants, simply edit the `appData` object in `data.js`:

```javascript
const appData = {
  participants: [
    {
      id: "1",
      name: "New Person",
      email: "new@example.com",
      score: 0,
      avatar: "avatar/newperson.jpg"
    }
  ],
  forecasts: [
    {
      id: "13",
      date: "2024-03-21T10:00:00Z",
      title: "New Forecast",
      description: "New prediction",
      participants: ["New Person"],
      answerDate: "2024-12-31T23:59:59Z"
    }
  ]
};
```

That's it! No build process, no server, just edit and refresh your browser. 