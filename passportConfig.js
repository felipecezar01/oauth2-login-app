const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./src/db'); // Conexão com o banco de dados

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Verificar se o usuário já existe no banco
    const userResult = await pool.query('SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2', ['google', profile.id]);
    let user = userResult.rows[0];

    if (!user) {
      // Se o usuário não existe, inserir um novo usuário
      const insertResult = await pool.query(
        'INSERT INTO users (username, email, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [profile.displayName, profile.emails[0].value, 'google', profile.id]
      );
      user = insertResult.rows[0];
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, userResult.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
