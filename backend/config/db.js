import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// Initialize Oracle Client (required for Thick mode with Oracle Instant Client)
try {
  const libDir = process.env.INSTANT_CLIENT_DIR;
  if (libDir) {
    oracledb.initOracleClient({ libDir });
    console.log(`✅ Oracle Client initialized with libDir: ${libDir}`);
  } else {
    oracledb.initOracleClient();
    console.log("✅ Oracle Client initialized (auto-detected)");
  }
} catch (err) {
  console.error("⚠️ Could not initialize Oracle Client:", err.message);
  console.error("💡 Make sure Oracle Instant Client is installed and INSTANT_CLIENT_DIR is set in .env");
}

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // returns results as key:value objects

// --- Connection Pool Setup ---
const poolConfig = {
  user: process.env.DB_USER || "C##RAMEEZHODA",
  password: process.env.DB_PASSWORD || "123",
  connectString: process.env.DB_CONNECT_STRING || "localhost:1521/orcl",
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
};

// --- Initialize the Pool ---
let pool;
export async function initDB() {
  try {
    pool = await oracledb.createPool(poolConfig);
    console.log("✅ Oracle connection pool created");
  } catch (err) {
    console.error("❌ Error creating Oracle connection pool:", err);
    process.exit(1);
  }
}

// --- Query Helper Function ---
export async function query(sql, params = {}) {
  let connection;
  try {
    connection = await pool.getConnection();

    // Oracle automatically detects whether params is array or object
    const result = await connection.execute(sql, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT, // ensures rows come as key:value
    });

    return result;
  } catch (err) {
    console.error("❌ Database query error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("⚠️ Error closing connection:", err);
      }
    }
  }
}


// --- Graceful Shutdown ---
process.on("SIGINT", async () => {
  try {
    if (pool) {
      await pool.close(10);
      console.log("🟡 Oracle connection pool closed");
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing Oracle pool:", err);
    process.exit(1);
  }
});
