const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-cpi-default-rtdb.firebaseio.com"
});

const{createClubs , getClub , putClub , deleteClub} = require('./clubs/club');
const{postClubPost , getClubPost , putClubPost , deleteClubPost} = require('./clubs/clubPost');
const{postPostComment , getComment , putComment , deleteComment} = require('./clubs/comment');
const{postMembers , getMember } = require('./clubs/members');
const{LikerPost , deleteLike} = require('./clubs/likePost');
const{joinClub} = require('./clubs/abonnee');
const db = admin.firestore();

//club
app.post('/createClubs', createClubs);
app.get('/readClubs', getClub);
app.put('/updateClubs/:clubId', putClub);
app.delete('/deleteClub/:clubId', deleteClub);

 //club privé
 app.post('/joinClub/:clubId' , joinClub);
  //image
  //app.post('/upload/image' , upload.single('file') , postClubImg)
//publication dans groupe
//text
app.post('/createClubsPost/:clubId' , postClubPost);
app.get('/readClubsPost/:clubId' , getClubPost);
app.put('/updatePosts/:clubId/:clubPostId', putClubPost);
app.delete('/deletePost/:clubId/:clubPostId' , deleteClubPost);

//members
app.post('/postMembers/:clubId', postMembers);
app.get('/getMembers/:clubId', getMember);
//app.delete('/deleteMembers/:clubId/:memberId' , deleteMember);

//Comments
app.post('/createComment/:clubId/:clubPostId' , postPostComment);
app.get('/getComment/:clubId/:clubPostId' , getComment);
app.put('/updateComment/:clubId/:clubPostId/:commentId' , putComment);
app.delete('/deleteComment/:clubId/:clubPostId/:commentId', deleteComment);

//app.put('/updatePostComment/:cludId/:clubPostId', putPostComment);

//postlike
app.post('/createLike/:clubId/:clubPostId' ,LikerPost);
//postdislike
app.delete('/deleteLike/:clubId/:clubPostId/:likeId' , deleteLike);

  exports.api = functions.https.onRequest(app);