const fetch = require('node-fetch')
module.exports = function(app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user : req.user,
        messages: result

      })
    })
  });
  // detailed
  // app.get('/detailed', isLoggedIn, function(req, res) {
  //   db.collection('posts').find({_id: postId}).toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('post.ejs', {
  //       posts: result
  //     })
  //   })
  //     db.collection('messages').find().toArray((err, result) => {
  //       if (err) return console.log(err)
  //       res.render('detailed.ejs', {
  //         user : req.user,
  //         messages: result
  //
  //       })
  //     })
  // });

  // post route
  app.put('/hotels/posts', isLoggedIn, (req, res) => {
    // console.log("idk",req.body);
    db.collection('comments').find({placeid: req.body.place_id}).toArray((err, find_results) => {
      // console.log(find_results, "string");
      let userName = req.body.username
      let newComment = req.body.comments
      let comments;
      // console.log(find_results,"RRresultsSS");
      // console.log((find_results.hasOwnProperty("comments")),"bool");
      // console.log(find_results.length);
      if(find_results.length !== 0){
        comments = find_results[0].comments
        comments.push({username: userName, comment: newComment})
      }else{
        comments = []
        comments.push({username: userName, comment: newComment})
      }
      console.log("new comments", comments);
      db.collection('comments')
      .findOneAndUpdate({placeid: req.body.place_id}, {
        $set: {
          comments: comments
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })

    })
  })
  // post route


  app.get('/hotels/:info', isLoggedIn, function(req, res) {
    let place_id = req.params.info
    console.log(req.query.photo, "req");
    let uId = ObjectId(req.session.passport.user)
    console.log(uId, "uId");
    db.collection('users').find({_id: uId}).toArray((err, user) => {


      console.log(user, "user");
      db.collection('comments').find({placeid: place_id}).toArray((err, result) => {
        console.log(result, "result");
        let comments;``
        if (result.length === 0) {
          comments = []
        }else{
          comments = result[0].comments
        }
        console.log(comments, "okay");
        if (err) return console.log(err)
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXM`)
          .then(response => {
            return response.json()
          }).then(json => {
            console.log("HOTELS",json);
            res.render("detailed.ejs",{
              place: json,
              commentResult: comments,
              user: user,
              photo: req.query.photo

            })
          })
          .catch(err => {
            console.log(err);
          });

        })
      })
      //
      // let postId = ObjectId(req.params.users)


      // console.log(postId); // postId is what we use to pull the picture from the database

    });



    // LOGOUT ==============================

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    // message board routes ===============================================================
    // hotel
    app.get("/hotels", (req, res) =>{
      const location = req.query.location
      fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${location}&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXM`)
        .then(response => {
          // console.log(response.json());
          return response.json()
        }).then(json => {
          // console.log("HOTELS",json);
          res.render("hotels.ejs",{
            hotels: json.results,
            location: location,

          })
          // console.log( "type", json.results)
        })
        .catch(err => {
          console.log(err);
        });
      })
      // hotel
      // // Restaurants
      app.get("/restaurants", (req, res) =>{
        const location = req.query.location
        console.log(location, " location ");
        // console.log("hit the search btn");
        // https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXM
        // https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXM
        // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXMY
        fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${location}&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXM`)
          .then(response => {
            // console.log( "HELLO",response);
            return response.json()
            // console.log(response.json());
          }).then(json => {
            // console.log("FOOD",json);
            res.render("food.ejs",{
              restaurants : json.results,
              location: location


            })
          }).catch(err => {
            console.log(err);
          });

        })
        app.get('/restaurants/:info', isLoggedIn, function(req, res) {
          let place_id = req.params.info
          console.log(req.query.photo, "req");
          let uId = ObjectId(req.session.passport.user)
          console.log(uId, "uId");
          db.collection('users').find({_id: uId}).toArray((err, user) => {


            console.log(user, "user");
            db.collection('comments').find({placeid: place_id}).toArray((err, result) => {
              console.log(result, "result");
              let comments;
              if (result.length === 0) {
                comments = []
              }else{
                comments = result[0].comments
              }
              console.log(comments, "okay");
              if (err) return console.log(err)
              fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=AIzaSyDu7ML3Gh0Invl3_Wvx89faDViiR3r6rXM`)
                .then(response => {
                  return response.json()
                }).then(json => {
                  console.log("HOTELS",json);
                  res.render("detailed.ejs",{
                    place: json,
                    commentResult: comments,
                    user: user,
                    photo: req.query.photo

                  })
                })
                .catch(err => {
                  console.log(err);
                });

              })
            })
            //
            // let postId = ObjectId(req.params.users)


            // console.log(postId); // postId is what we use to pull the picture from the database

          });
        // Restaunts

        app.post('/search', isLoggedIn, (req, res) => {
          // hotelApi.search(req.body.msg)
          // console.log("req",req.body);
          db.collection('messages').save({searchDate: new Date() ,name: req.user.local.email, traveled: false, msg: req.body.location, }, (err, result) => {
            if (err) return console.log(err)
            // console.log('saved to database')
            res.render('result',{
              results : [],
              location: req.body.location
            })
          })
        })

        app.put('/messages', (req, res) => {
          db.collection('messages')
          .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
            $set: {
              traveled: req.body.traveled
            }
          }, {
            sort: {_id: -1},
            upsert: true
          }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
          })
        })

        app.put('/thumbDown', (req, res) => {
          db.collection('messages')
          .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
            $set: {
              thumbUp:req.body.thumbUp - 1
            }
          }, {
            sort: {_id: -1},
            upsert: true
          }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
          })
        })

        app.delete('/messages', (req, res) => {
          db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
          })
        })

        // =============================================================================
        // AUTHENTICATE (FIRST LOGIN) ==================================================
        // =============================================================================

        // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
          res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/login', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
          res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/signup', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
        }));

        // =============================================================================
        // UNLINK ACCOUNTS =============================================================
        // =============================================================================
        // used to unlink accounts. for social accounts, just remove the token
        // for local account, remove email and password
        // user account will stay active in case they want to reconnect in the future

        // local -----------------------------------
        app.get('/unlink/local', isLoggedIn, function(req, res) {
          var user            = req.user;
          user.local.email    = undefined;
          user.local.password = undefined;
          user.save(function(err) {
            res.redirect('/profile');
          });
        });

      };

      // route middleware to ensure user is logged in
      function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
        return next();

        res.redirect('/');
      }
