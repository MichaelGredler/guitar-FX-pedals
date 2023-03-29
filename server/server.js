const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const app = express();
app.use(
   cors({
      'Access-Control-Allow-Origin': 'http://localhost:3000/',
   })
)

const artists = [
   {id: 1, name: 'Jimi Hendrix'},
   {id: 2, name: 'Adam Jones'},
   {id: 3, name: 'Jimmy Page'},
   {id: 4, name: 'Neil Young'}
]

const pedals = [
   {id: 1, name: 'Vox V847 Wah Pedal', pedalType: 'wah', price: 179, artistId: 1},
   {id: 2, name: 'Dunlop JHF1 Jimi Hendrix Fuzz Face Distortion', pedalType: 'fuzz', price: 319, artistId: 1},
   {id: 3, name: 'MXR M68 Uni-Vibe Chorus / Vibrato Guitar Pedal', pedalType: 'chorus', price: 249, artistId: 1},
   {id: 4, name: 'Boss DD8 Digital Delay Pedal w/ Tap Tempo & Looper', pedalType: 'delay', price: 289, artistId: 1},
   {id: 5, name: 'Boss RV6 Reverb Pedal', pedalType: 'reverb', price: 269, artistId: 2},
   {id: 6, name: 'Boss BF3 Flanger Pedal', pedalType: 'flanger', price: 279, artistId: 2},
   {id: 7, name: 'Boss CE2W Chorus Pedal (Waza Craft Special Edition)', pedalType: 'chorus', price: 345, artistId: 2},
   {id: 8, name: 'Boss GE7 Graphic Equalizer Pedal', pedalType: 'chorus', price: 209, artistId: 2},
   {id: 9, name: 'MXR M133 Micro Amp Boost Pedal', pedalType: 'gain', price: 169, artistId: 2},
   {id: 10, name: 'Dunlop 535Q Cry Baby Multi-Wah', pedalType: 'chorus', price: 279, artistId: 3},
   {id: 11, name: 'T-Rex Replicator DeLuxe Tape Echo', pedalType: 'delay', price: 799, artistId: 3},
   {id: 12, name: 'Orange Phaser Pedal', pedalType: 'phaser', price: 319, artistId: 3},
   {id: 13, name: 'Boss FZ5 Fuzz Pedal', pedalType: 'fuzz', price: 249, artistId: 3},
]

const ArtistType = new GraphQLObjectType({
   name: 'Artist',
   description: 'This represents an artist',
   fields: () => ({
      id: {type: GraphQLNonNull(GraphQLInt)},
      name: {type: GraphQLNonNull(GraphQLString)},
      pedals: {
         type: new GraphQLList(PedalType),
         resolve: (artist) => {
            return pedals.filter(pedal => pedal.artistId === artist.id)
         }
      }
   })
})

const PedalType = new GraphQLObjectType({
   name: 'Pedal',
   description: 'This represents a pedal',
   fields: () => ({
      id: {type: GraphQLNonNull(GraphQLInt)},
      name: {type: GraphQLNonNull(GraphQLString)},
      price: {type: GraphQLNonNull(GraphQLInt)},
      artistId: {type: GraphQLNonNull(GraphQLInt)},
      artist: {
         type: ArtistType,
         resolve: (pedal) => {
            return artists.find(artist => artist.id === pedal.artistId)
         }
      }
   })
})


//=======> ROOT QUERY <======//
const RootQueryType = new GraphQLObjectType({
   name: 'Query',
   description: 'Root Query',
   fields: () => ({
      pedal: {
         type: PedalType,
         description: 'A single pedal',
         args: {
            id: {type: GraphQLInt}
         },
         resolve: (parent, args) => pedals.find(pedal => pedal.id === args.id)
      },
      pedals: {
         type: GraphQLList(PedalType),
         description: 'All pedals',
         resolve: () => pedals
      },
      artists: {
         type: GraphQLList(ArtistType),
         description: 'All artists',
         resolve: () => artists
      },
      artist: {
         type: ArtistType,
         description: 'Single artist',
         args: {
            id: {type: GraphQLInt}
         },
         resolve: (parents, args) => artists.find(artist => artist.id === args.id)
      }

   })
})

const RootMutationType = new GraphQLObjectType({
   name: 'Mutation',
   description: 'Root Mutation',
   fields: () => ({
      addBook: {
         type: PedalType,
         description: 'Add a pedal',
         args: {
            name: {type: GraphQLNonNull(GraphQLString)},
            artistId: {type: GraphQLNonNull(GraphQLInt)}
         },
         resolve: (parent, args) => {
            const pedal = {
               id: pedals.length + 1, 
               name: args.name,
               artistId: args.artistId
            }
            pedals.push(pedal);
            return pedal;
         }
      }
   })
})

const schema = new GraphQLSchema({
   query: RootQueryType,
   mutation: RootMutationType
})
 


// const schema = new GraphQLSchema({
//    query: new GraphQLObjectType({
//       name: 'hello',
//       fields: () => ({
//          message: { 
//             type: GraphQLString,
//             resolve: () => 'hello'
//          }
//       })
//    })
// })

app.use('/graphql', graphqlHTTP({
   schema: schema,
   graphiql: true
}));
app.listen(5000, () => console.log('AAAAAAAAA'));
