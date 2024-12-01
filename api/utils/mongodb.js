import mongodb from "mongodb";
const { MongoClient, ObjectId } = mongodb;

import { config } from "dotenv";
config(); // carrega as variáveis definidas no .env

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Por favor, defina a variável de ambiente MONGODB_URI dentro do arquivo .env"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Por favor, defina a variável de ambiente MONGODB_DB dentro do arquivo .env"
  );
}

// Opções de conexão para melhorar a resiliência
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 10000, // 10 segundos
  socketTimeoutMS: 45000, // 45 segundos
};

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Se já tiver uma conexão, retorna ela
  if (cached.conn) {
    return cached.conn;
  }

  // Se não tiver uma promise de conexão, cria uma
  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI, mongoOptions)
      .then((client) => {
        return {
          client,
          db: client.db(MONGODB_DB),
          ObjectId: ObjectId,
        };
      })
      .catch((error) => {
        console.error(`❌ Erro de conexão ao MongoDB: ${error}`);
        throw new Error(`❌ Não foi possível conectar no MongoDB: ${error}`);
      });
  }

  // Aguarda a promise de conexão e armazena o resultado
  cached.conn = await cached.promise;
  return cached.conn;
}

export { MONGODB_DB, MONGODB_URI };
