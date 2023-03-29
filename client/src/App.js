import { useState } from 'react';
import './App.css';

function App() {

const [artistName, setArtistName] = useState("");
const [pedalNames, setPedalNames] = useState([]);
const [pedalPrices, setPedalPrices] = useState([]);

  async function getArtistsData(artistId) {
    const artistData = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query {
            artist(id: ${artistId}) {
              name
              pedals {
               name
               price
              }
            }
          }
        `
      })
    })
    .then(res => res.json());
    
    setArtistName(artistData.data.artist.name);
    console.log("artistData.data.artist.name", artistData.data.artist.name)

    let pedalData = artistData.data.artist.pedals;
    let pedalKeys = Object.keys(pedalData);
    let pedalNameArray = [];
    let pedalPriceArray = [];
    pedalKeys.forEach((key) => {
      pedalNameArray.push(pedalData[key].name);
      pedalPriceArray.push(pedalData[key].price);
    })

    setPedalNames(pedalNameArray);
    setPedalPrices(pedalPriceArray);
    console.log("pedalNameArray", pedalNameArray)
    console.log("pedalPriceArray", pedalPriceArray)
    
  }  

  
  // async function getArtistsData() {
  //   const artistData = fetch('http://localhost:5000/graphql', {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       query: `
  //         query {
  //           artists {
  //             name
  //           }
  //         }
  //       `
  //     })
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log(data.data)
  //   });
  // }  


  const Selector = () => {
    return (
      <select name="artists" id="artist-select" onChange={(e) => getArtistsData(e.target.value)}>
        <option value="" hidden>Choose a Artist</option>
          <option value="1">Jimi Hendrix</option>
          <option value="2">Adam Jones</option>
          <option value="3">Jimmy Page</option>
          <option value="4">Neil Young</option>
      </select>
    )
  }

  return (
    <div className="App">
      <h1>Pedalboard Maker</h1>
        <Selector />
        {artistName ? <h3>{artistName}</h3> : ""}
        <ul>
          {pedalNames ? pedalNames.map((pedal, index) => <li key={index}>{pedal} ${pedalPrices[index]}</li>) : <h5>No Data</h5>}
        </ul>
    </div>
  );
}

export default App;
