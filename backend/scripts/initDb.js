const { sequelize } = require('../models');

async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    console.log('\nSynchronizing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✓ Database schema synchronized successfully');

    console.log('\n✓ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
