import './App.css';

fetch('http://localhost:5000/graphql', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: `
      query {
        books {
          name
          id
        }
      }
    `
  })
})
.then(res => res.json())
.then(data => {
  console.log(data.data)
});

function App() {
  return (
    <div className="App">
      <h1>dfnhgneuodifhnueiont</h1>
    </div>
  );
}

export default App;
