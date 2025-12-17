import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-ignore
  if (!global._mongoClientPromise) {
    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    client = new MongoClient(uri, options)
    // @ts-ignore
    global._mongoClientPromise = client.connect()
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  // Only throw if we're actually using the connection (lazy check)
  clientPromise = (async () => {
    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    const client = new MongoClient(uri, options)
    return client.connect()
  })()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise