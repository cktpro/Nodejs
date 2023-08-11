const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;

const jwtSettings = require('../constants/jwtSetting');
const { Customer } = require('../models');

// const passportConfig = new JwtStrategy(
//   {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
//     secretOrKey: jwtSettings.SECRET,
//   },
//   async (payload, done) => {
//     try {
//       const user = await Employee.findById(payload._id).select('-password');

//       if (!user) return done(null, false);

//       return done(null, user);
//     } catch (error) {
//       done(error, false);
//     }
//   },
// );

const passportConfigLocal = new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await Customer.findOne({
        isDeleted: false,
        email,
      });

      if (!user) return done(null, false);

      const isCorrectPass = await user.isValidPass(password);

      user.password = undefined;

      if (!isCorrectPass) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

// const passportConfigBasic = new BasicStrategy(async function (username, password, done) {
//   try {
//     const user = await Employee.findOne({ email: username });
  
//     if (!user) return done(null, false);
  
//     const isCorrectPass = await user.isValidPass(password);
  
//     if (!isCorrectPass) return done(null, false);
  
//     return done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// });

module.exports = {
  // passportConfig,
  passportConfigLocal,
  // passportConfigBasic,
};