import mysql from 'mysql2/promise';

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

type OperationType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

interface QueryParams {
  table: string; 
  operation: OperationType;
  conditions?: Record<string, any>;
  data?: Record<string, any>;      
}

export function buildQuery({ table, operation, conditions = {}, data = {} }: QueryParams) {
  switch (operation) {
    case 'SELECT': {
        const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      return {
        query: `SELECT * FROM ${table} ${whereClause ? 'WHERE ' + whereClause : ''}`,
        values: Object.values(conditions),
      };
    }

    case 'INSERT': {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');

      return {
        query: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values: Object.values(data),
      };
    }

    case 'UPDATE': {
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');

      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');

      // Extract and sanitize values
      const values = [
        ...Object.values(data),
        ...Object.keys(conditions).map(key => {
          const value = conditions[key];
          // Basic type check and conversion
          return typeof value === 'object' ? value[key] : value; 
        }),
      ];

      return {
        query: `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
        values,
      };
    }

    case 'DELETE': {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');

      return {
        query: `DELETE FROM ${table} WHERE ${whereClause}`,
        values: Object.values(conditions),
      };
    }

    default:
      throw new Error('Unknown operation');
  }
}