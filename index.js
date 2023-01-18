const express = require('express')

// creating an express instance
const app = express()
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const request = require("request");

const db = require("./database");

// getting the local authentication type
var OAuth2Strategy = require("passport-oauth2");
var YahooFantasy = require("yahoo-fantasy");
const NHLAPICrawler = require("nhl-api-crawler")
// import { crawlEvents } from 'nhl-api-crawler'

var APP_KEY = process.env.APP_KEY || require("./conf.js").APP_KEY;
var APP_SECRET = process.env.APP_SECRET || require("./conf.js").APP_SECRET;

const has = function (obj, key) {
  var keyParts = key.split('.');

  return !!obj && (
    keyParts.length > 1
      ? has(obj[key.split('.')[0]], keyParts.slice(1).join('.'))
      : hasOwnProperty.call(obj, key)
  );
};

let User = require('./schema/user')
let Game = require('./schema/game')
const Player = require('./schema/player')
const Season = require('./schema/season')
const PlayByPlay = require('./schema/playbyplay')
const Team = require('./schema/team')
const PlayerStats = require('./schema/stats')
const defaultGameData = require('./data')

const publicRoot = '/Users/joel/Documents/Sites/yfantasy-front-end/'

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send('You are not authenticated')
  } else {
    return next()
  }
}
app.use(bodyParser({ limit: '50mb' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'mysession',
  keys: ['vueauthrandomkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.yf = new YahooFantasy(APP_KEY, APP_SECRET);
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static(publicRoot))
// app.use(express.static('public'))
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://api.login.yahoo.com/oauth2/request_auth",
      tokenURL: "https://api.login.yahoo.com/oauth2/get_token",
      clientID: APP_KEY,
      clientSecret: APP_SECRET,
      callbackURL:
        (process.env.APP_URL || require("./conf.js").APP_URL) +
        "/auth/yahoo/callback"
    },
    function (accessToken, refreshToken, params, profile, done) {
      var options = {
        url: "https://api.login.yahoo.com/openid/v1/userinfo",
        method: "get",
        json: true,
        auth: {
          bearer: accessToken
        }
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          User.findOne({ 'yahooId': body.sub }, function (err, user) {
            if (err) {
              return done(err);
            }
            // if no user is found create a new one
            if (!user) {
              const userObj = new User({
                yahooId: body.sub,
                avatar: body.profile_images.image64,
                name: body.nickname,
                created_at: new Date(),
                access_token: accessToken,
                refresh_token: refreshToken
              });
              userObj.save(function (err) {
                if (err) console.log(err);
                return done(err, userObj);
              });
              app.yf.setUserToken(accessToken);
              return done(null, userObj);
            } else {
              //found user. Return
              app.yf.setUserToken(accessToken);
              user.access_token = accessToken;
              return done(err, user);
            }
          })
        } else {
          console.log(error)
        }
      });
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: publicRoot })
})

app.get("/api/login", (req, res, next) => {
  passport.authenticate("oauth2", (err, user, info) => {
    if (err) {
      console.log(err)
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in", info]);
    }

    req.login(user, err => {
      res.send("Logged in");
    });
  })(req, res, next);
});

app.get("/api/logout", function (req, res) {
  req.logout();
  console.log("logged out")
  return res.send();
});

app.get("/auth/yahoo", passport.authenticate("oauth2", { failureRedirect: "/" }),
  function (req, res, user) {
    console.log(req, res, user)
    res.redirect("/dashboard");
  }
);

app.get("/auth/yahoo/callback", passport.authenticate("oauth2", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect(req.session.redirect || "/dashboard");
  }
);

app.get("/api/user", authMiddleware, function (req, res) {
  let user = User.find({ _id: req.session.passport.user }).exec()
  res.send({ user: user })
})

app.post("/api/yahoo/:resource/:subresource", authMiddleware, function (req, res) {
  var yf = req.app.yf,
    resource = req.params.resource,
    subresource = req.params.subresource,
    query = req.body;

  Object.map = function (obj) {
    var key,
      arr = [];
    for (key in obj) {
      arr.push(obj[key]);
    }
    return arr;
  };
  var args = Object.map(query);

  var callback = function callback(err, data) {
    // console.profileEnd(`${resource}-${subresource}`);
    if (err) {
      var reason = err.description;
      // .match(/"(.*?)"/)
      // .shift();
      if (reason && 'token_expired' === reason) {
        var options = {
          url: "https://api.login.yahoo.com/oauth2/get_token",
          method: "post",
          json: true,
          form: {
            client_id: process.env.APP_KEY || require("../conf.js").APP_KEY,
            client_secret: process.env.APP_SECRET || require("../conf.js").APP_SECRET,
            redirect_uri: "oob",
            refresh_token: req.user.refreshToken,
            grant_type: "refresh_token",
          },
        };

        request(options, function (error, response, body) {
          if (error) {
            res.json({ error: "Couldn't renew token..." });
          }

          yf.setUserToken(body.access_token);
          req.user.accessToken = body.access_token;
          req.user.refreshToken = body.refresh_token;

          // re-try the request
          console.log("re-trying request...");
          // console.log(resource, subresource);
          yf[resource][subresource].apply(yf[resource], args);
        });
      } else {
        res.json({ error: reason });
      }
    } else {
      res.json(data);
    }
  };
  if (has(query, "filters")) {
    query.filters = JSON.parse(query.filters);
  }
  if (has(query, "subresources")) {
    query.subresources = query.subresources;
  }
  args = Object.values(query);
  args.push(callback);
  // arg length descriptions
  // 5 - i think this only happens with transactions.adddrop_player
  // 4 - would be key, filters, subs, callback
  // 3 - would be key, filters or subs, callback for collection
  // could be key, another key, callback too...
  // 2 - would be key or filters or subs, callback
  // 1 - callback only...
  return yf[resource][subresource].apply(yf[resource], args).catch(err => { console.log(err) })
})

app.get("/api/:resource/:id", async function (req, res, next) {
  if (req.params.resource === 'games') {
    Game.find({}).then(function (games) {
      res.send(games)
    }).catch(next)
  } else if (req.params.resource === 'player') {
    Player.findOne({ y_player_id: req.params.id }).then(function (player) {
      if (player === null) {
        res.send({ 'error': 'Player not found' })
      } else {
        res.send(player);
      }
    }).catch(function (err) {
      console.log('err', err)
    })
  } else if (req.params.resource === 'players') {
    console.log(req.params.id)
    // Get all players in a season
    await NHLAPICrawler.crawlPlayers(req.params.id, req.params.id).then(players => {
      let mappedPlayers = players.map(player => {
        return {
          'updateOne': {
            'filter': { 'nhl_player_id': player.id },
            'update': { '$set': { 'name': player.fullName, 'active': player.active, 'rookie': player.rookie, 'currentTeamId': player.currentTeamId, 'position': player.primaryPosition } },
            'upsert': true
          }
        }
      })
      Player.collection.bulkWrite(mappedPlayers).then(function (data) {
        res.send(data);
      }).catch(function (err) {
        console.log('err', err)
      });
    })
  } else if (req.params.resource === 'season') {
    Season.findOne({ game_key: req.params.id }).then(function (season) {
      if (season === null) {
        res.send({ 'error': 'Season not found' })
      } else {
        res.send(season);
      }
    }).catch(function (err) {
      console.log('err', err)
    })
  } else if (req.params.resource === 'playbyplay') {
    PlayByPlay.find({ gamePK: req.params.id }).then(function (play) {
      console.log(play)
      if (play.length === 0) {
        res.send({ 'error': 'Play by Play not found' })
      } else {
        res.send(play);
      }
    }).catch(function (err) {
      console.log('err', err)
    })
  } else if (req.params.resource === 'team') {
    if (req.params.id !== 'all') {
      Team.find({ id: req.params.team_id })
        .then(team => {
          res.send(team)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      Team.find({})
        .then(teams => {
          // NO TEAMS IN DB
          if (teams.length === 0) {
            request('https://statsapi.web.nhl.com/api/v1/teams', function (error, response, body) {
              if (!error && response.statusCode == 200) {
                Team.insertMany(JSON.parse(body).teams).then(function (teams) {
                  res.send(teams)
                }).catch(err => {
                  console.log(teams)
                })
              }
            })
          } else {
            res.send(teams)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
app.post("/api/:resource", async function (req, res, next) {
  if (req.params.resource === 'games') {
    req.body.leagues.forEach(data => {
      Game.create(data).then(function (game) {
        res.send(game);
      }).catch(next);
    });
  } else if (req.params.resource === 'player') {
    let data = req.body.data
    Player.updateOne({ name: req.body.data.name }, {
      $set: {
        y_player_id: data.y_player_id,
        name: data.name,
        team_name: data.team_name,
        team_name_abbr: data.team_name_abbr,
        league_abbr: data.league_abbr,
        uniform_number: data.uniform_number,
        image: data.image,
        position_type: data.position_type,
        rookie_season: data.rookie_season,
        eligible_positions: data.eligible_positions,
        seasons: data.seasons
      },
    }, { upsert: true }).then(function (player) {
      res.send(player);
    }).catch(function (err) {
      console.log('err', err)
    });
  } else if (req.params.resource === 'players') {
    let playersQuery = [
      {
        '$match': req.body.data
      },
      {
        '$lookup': {
          'from': 'stats',
          'localField': 'nhl_player_id',
          'foreignField': 'playerId',
          'as': 'Games',
          'pipeline': [
            { '$match': { 'gamePk': { $gt: req.body.season } } },
            { '$sort': { 'gamePk': -1 } }
          ],
        }
      },{
        $project: {
          'name': true,
          'nhl_player_id': true,
        }
      }
    ];
    if (req.body.stats){
      playersQuery[2].$project.previousGames = {
        '$filter':{
          'input': '$Games',
          'as':'previousGames',
          'cond': { 
            '$and':[
              { '$gte': [ "$$previousGames.gamePk", req.body.start ] },
              { '$lt': [ "$$previousGames.gamePk", req.body.end ] }
            ] 
          }
        }
      }
    }
    if (req.body.statType === 'averages') {
      playersQuery[2].$project.averages = {
        '$let': {
          'vars': {
            'red': {
              '$reduce': {
                'input': {
                  '$map': {
                    'input': {'$slice':["$Games",0,req.body.limit]},
                    'in': {
                      '$objectToArray': '$$this'
                    }
                  }
                },
                'initialValue': [],
                'in': {
                  '$concatArrays': [
                    '$$value', '$$this'
                  ]
                }
              }
            }
          },
          'in': {
            '$arrayToObject': {
              '$map': {
                'input': {
                  '$setUnion': [
                    '$$red.k'
                  ]
                },
                'as': 'm',
                'in': {
                  '$let': {
                    'vars': {
                      'fil': {
                        '$filter': {
                          'input': '$$red',
                          'as': 'd',
                          'cond': {
                            '$eq': [
                              '$$d.k', '$$m'
                            ]
                          }
                        }
                      }
                    },
                    'in': {
                      'k': '$$m',
                      'v': {
                        '$divide': [
                          {
                            '$sum': '$$fil.v'
                          }, {
                            '$size': '$$fil'
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (req.body.sortBy !== undefined) {
      let sortObj = {
        "$sort": {
          ["averages." + req.body.sortBy]: -1
        }
      };
      playersQuery.push(sortObj)
    }
    Player.aggregate(playersQuery).then(players => {
      res.send(players)
    }).catch(err => {
      console.log("players", err)
    })
  } else if (req.body.action === 'updateOwnership') {
    let playerUpdate = req.body.players.map(player => {
      return {
        'updateOne': {
          'filter': { name: player.name },
          'update': { $set: { fantasyTeamId: player.fantasyTeamId } },
        }
      }
    })
    let cleanup = [{
      'updateMany': {
        'filter': { fantasyTeamId: { $ne: null } },
        'update': { $set: { fantasyTeamId: null } },
      }
    }]
    let updatePlayerOwnership = cleanup.concat(playerUpdate)
    Player.collection.bulkWrite(updatePlayerOwnership).then(function (data) {
      res.send(data);
    }).catch(function (err) {
      console.log('err 1', err)
    });
  } else if (req.params.resource === 'season') {
    Season.create(req.body.data).then(function (season) {
      res.send(season);
    }).catch(function (err) {
      console.log('err', err)
    })
  } else if (req.params.resource === 'playbyplay') {
    if (req.body.action === 'fetch') {
      let result = []
      // GET PLAYERS TOI
      let playerShifts = []
      await NHLAPICrawler.crawlShifts(req.body.start, req.body.end).then(shifts => {
        playerShifts = shifts
      }).catch(err => {
        console.log(err)
      })
      // GET ALL EVENTS AND CALCULATE ADVANCED STATS
      let playerGameStats = []
      await NHLAPICrawler.crawlEvents(req.body.start, req.body.end).then(events => {
        let games = events.map(game => {
          return game.gamePk;
        });
        games = [...new Set(games)].map(game => {
          let gameEvents = events.filter(event => {
            if (event.gamePk === game) {
              return event
            }
          })
          let playerIds = gameEvents.map(event => {
            return event.playerId
          })
          return {
            gamePk: game,
            events: gameEvents,
            players: [...new Set(playerIds)]
          }
        })

        playerGameStats = games.flatMap(game => {
          let playerStats = game.players.map(player => {
            let playerEvents = game.events.filter(event => {
              if (player === event.playerId) { return event }
            })
            let accumulatingStats = { ...defaultGameData };

            let goalEvents = game.events.filter(event => {
              if (event.type === "GOAL") { return event }
            })
            // LAST GOAL
            if (goalEvents[goalEvents.length - 1].players.some(goalEvents => { player === goalEvents.playerId })) {
              accumulatingStats.GAME_WINNING_GOAL = 1;
            }

            goalEvents.forEach(goal => {
              if (goal.teamStrength === goal.opposingStrength) {
                if (goal.players.some(teammate => teammate === player)) {
                  accumulatingStats.PLUS_MINUS += 1
                }
                if (goal.opposingPlayers.some(opponet => opponet === player)) {
                  accumulatingStats.PLUS_MINUS -= 1
                }
              }
            })

            playerEvents.forEach((event, i) => {
              if (event.type === 'PENALTY_AGAINST') {
                accumulatingStats.PENALTY_MINUTES += event.secondaryNumber
              }

              accumulatingStats[event.type] += 1;
              if (playerEvents[i - 1] !== undefined && event.type === "ASSIST" && playerEvents[i - 1].type === "ASSIST") {
                accumulatingStats.ASSIST_2 += 1
              } else {
                if (event.teamStrength - event.opposingStrength === 1) { // 5 on 4 pp
                  accumulatingStats['5_ON_4_' + event.type] += 1
                } else if (event.teamStrength - event.opposingStrength === 2) { // 5 on 3 pp
                  accumulatingStats['5_ON_3_' + event.type] += 1
                } else if (event.opposingStrength - event.teamStrength === 1) { // 4 on 5 pk
                  accumulatingStats['4_ON_5_' + event.type] += 1
                } else if (event.opposingStrength - event.teamStrength === 2) { // 3 on 5 pk
                  accumulatingStats['3_ON_5_' + event.type] += 1
                }
              }
            })

            let toi = playerShifts.filter(event => {
              if (event.playerId === parseInt(player)) {
                return event
              }
            }).map(event => {
              return event.length
            }).reduce((a, b) => a + b)

            if (accumulatingStats['SAVE'] > 0) {
              let lastEventOfTheGame = game.events[game.events.length - 1]
              if (lastEventOfTheGame.teamScore === 0 && lastEventOfTheGame.opposingPlayers.some(opponent => opponent === player)) {
                accumulatingStats.SHUTOUT = 1
              }
              if (lastEventOfTheGame.opposingTeamScore === 0 && lastEventOfTheGame.players.some(teammate => teammate === player)) {
                accumulatingStats.SHUTOUT = 1
              }
              accumulatingStats.SAVE_PERCENTAGE = accumulatingStats['SAVE'] / (accumulatingStats['SAVE'] + accumulatingStats['GOAL_ALLOWED'])
              accumulatingStats.GOALS_AGAINST_AVERAGE = (accumulatingStats['GOAL_ALLOWED'] * 60) / accumulatingStats['TOI']
              accumulatingStats.GAME_SCORE = (-0.75 * accumulatingStats['GOAL_ALLOWED']) + (0.1 * accumulatingStats['SAVE'])
            } else {
              let cf = (accumulatingStats['ON_ICE_SHOT'] - accumulatingStats['5_ON_4_ON_ICE_SHOT'] - accumulatingStats['5_ON_3_ON_ICE_SHOT'] - accumulatingStats['4_ON_5_ON_ICE_SHOT'] - accumulatingStats['3_ON_5_ON_ICE_SHOT']) + (accumulatingStats['ON_ICE_SHOT_BLOCKED'] - accumulatingStats['5_ON_4_ON_ICE_SHOT_BLOCKED'] - accumulatingStats['5_ON_3_ON_ICE_SHOT_BLOCKED'] - accumulatingStats['4_ON_5_ON_ICE_SHOT_BLOCKED'] - accumulatingStats['3_ON_5_ON_ICE_SHOT_BLOCKED']) + (accumulatingStats['ON_ICE_SHOT_MISSED'] - accumulatingStats['5_ON_4_ON_ICE_SHOT_MISSED'] - accumulatingStats['5_ON_3_ON_ICE_SHOT_MISSED'] - accumulatingStats['4_ON_5_ON_ICE_SHOT_MISSED'] - accumulatingStats['3_ON_5_ON_ICE_SHOT_MISSED'])
              accumulatingStats.CORSI_FOR = cf
              let ca = (accumulatingStats['ON_ICE_SAVE'] - accumulatingStats['5_ON_4_ON_ICE_SAVE'] - accumulatingStats['5_ON_3_ON_ICE_SAVE'] - accumulatingStats['4_ON_5_ON_ICE_SAVE'] - accumulatingStats['3_ON_5_ON_ICE_SAVE']) + (accumulatingStats['ON_ICE_BLOCKED_SHOT'] - accumulatingStats['5_ON_4_ON_ICE_BLOCKED_SHOT'] - accumulatingStats['5_ON_3_ON_ICE_BLOCKED_SHOT'] - accumulatingStats['4_ON_5_ON_ICE_BLOCKED_SHOT'] - accumulatingStats['3_ON_5_ON_ICE_BLOCKED_SHOT']) + (accumulatingStats['ON_ICE_MISSED_SHOT'] - accumulatingStats['5_ON_4_ON_ICE_MISSED_SHOT'] - accumulatingStats['5_ON_3_ON_ICE_MISSED_SHOT'] - accumulatingStats['4_ON_5_ON_ICE_MISSED_SHOT'] - accumulatingStats['3_ON_5_ON_ICE_MISSED_SHOT'])
              accumulatingStats.CORSI_AGAINST = ca
              accumulatingStats.GAME_SCORE = (0.75 * accumulatingStats['GOAL']) + (0.7 * accumulatingStats['ASSIST']) + (0.55 * accumulatingStats['ASSIST_2']) + (0.075 * accumulatingStats['SHOT']) + (0.05 * accumulatingStats['BLOCKED_SHOT']) + (0.15 * accumulatingStats['PENALTY_MINUTES']) + (0.01 * accumulatingStats['FACEOFF_WIN']) - (0.01 * accumulatingStats['FACEOFF_LOSS']) + (0.05 * cf) - (0.05 * ca) + (0.15 * accumulatingStats['PLUS_MINUS']) + (0.15 * accumulatingStats['HIT']) + (0.65 * (accumulatingStats['5_ON_4_GOAL'] + accumulatingStats['5_ON_3_GOAL'] + accumulatingStats['5_ON_4_ASSIST'] + accumulatingStats['5_ON_3_ASSIST']))
            }

            let stats = { ...accumulatingStats, 'TOI': toi }

            return {
              'updateOne': {
                'filter': { gamePk: game.gamePk, playerId: player },
                'update': { $set: { gamePk: game.gamePk, playerId: player, ...stats } },
                'upsert': true,
              }
            }
          })
          return playerStats
        })
      }).catch(err => {
        console.log(err)
      })

      if (playerGameStats.length > 0) {
        // ADD NEW GAME DATA INTO STATS COLLECTION
        await PlayerStats.collection.bulkWrite(playerGameStats).then(function (data) {
          console.log('PS', data)
          // res.send(data)
          result.push(data)
        }).catch(function (err) {
          console.log('P err', err)
        })

        // UPDATE SEASON WITH DATE OF LAST GAME LOGGED
        await Season.updateOne({ game_key: req.body.game_key }, { $set: { lastGameDayPlayed: req.body.end } }).then(function (data) {
          result.push(data)
          // res.send(data);
        }).catch(function (err) {
          console.log('err', err)
        });

        res.send(result)
      } else {
        res.send("No PBP available")
      }
    } else if (req.body.action === 'internal') {
      PlayByPlay.aggregate([
        {
          '$match': {
            'timestamp': {
              '$gte': new Date(req.body.start),
              '$lt': new Date(req.body.end)
            }
          }
        }, {
          '$project': {
            'gamePk': '$gamePk',
            'timestamp': '$timestamp',
            'home': '$homeId',
            'away': '$awayId'
          }
        }
      ]).then(pbp => {
        if (pbp.length === 0) {
          res.send('no play by plays')
        } else {
          res.send(pbp);
        }
      }).catch(err => {
        res.send(err);
        console.log("season", err)
      })
    } else if (req.body.action === 'add') {
      let action = req.body.data.map(game => {
        return {
          'updateOne': {
            'filter': { gamePk: game.gamePk },
            'update': { $set: game },
            'upsert': true,
          }
        }
      });
      PlayByPlay.collection.bulkWrite(action).then(function (play) {
        res.send(play)
      }).catch(err => {
        console.log(err)
      })
    }
  }
})
app.put('/api/:resource', function (req, res, next) {
  if (req.params.resource === 'games') {
    Game.findOneAndUpdate({ _id: req.params.league_key }, req.body).then(function (student) {
      Game.findOne({ _id: req.params.league_key }).then(function (student) {
        res.send(student);
      });
    });
  } else if (req.params.resource === 'player') {
    Player.findByIdAndUpdate(req.body.data._id, req.body.data).then(function (player) {
      res.send(player);
    }).catch(function (err) {
      res.send(err);
      console.log('err', err)
    });
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000")
})