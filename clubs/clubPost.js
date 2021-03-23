const {db} = require('../util/admin');
const admin = require('firebase-admin');
exports.postClubPost =((req, res)=>{
    if(req.body.body.trim() === ''){
        return res.status(400).json({body: 'Body must not be empty'});
    }
    newClubPost = {
        username : req.body.username,
         body : req.body.body,
         clubId : req.params.clubId,
         likeCount : 0,
        commentCount : 0,
        createdAt: new Date().toISOString()
    }  
    db.doc(`/Clubs/${req.params.clubId}`)
    .get()
    .then((doc) =>{ 
        if(!doc.exists){
            return res.status(200).json({error: "Le Club n'existe pas "})
        }
       })
.then(() =>{
    return db.collection('Clubs').doc(req.params.clubId).collection('ClubPosts').add(newClubPost)
})
.then(()=>{
    res.json(newClubPost);
})
.catch(err => {
    console.log(err);
    res.status(500).json({err: 'Something Went Wrong'});
})
    });


exports.getClubPost = ( (req, res) => {
    let clubPostData = {};
    db.doc(`/Clubs/${req.params.clubId}`).get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: "La publication n'existe pas "})
        }
        clubPostData = doc.data();
         clubPostData.clubPostId = doc.id;
        return db.collection('ClubPosts').get();
    })
    .then((data) =>{
         clubPostData.Posts =[];
        data.forEach((doc) => {
            clubPostData.Posts.push(doc.data());  
        });
        return res.json(clubPostData);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
    });

/*exports.putClubPost = ( (req, res) => {
    let clubPostData = {};
    const clubPostId = req.params.clubPostId;
    db.collection('ClubPosts').doc(clubPostId).get().then((doc) =>{
        if(doc.exists){
            doc.ref.update({
                body: req.body.body
            }).then(()=>{
                return res.status(200).json({error: "Publication modifiée "})
            })
            .catch(err =>{
                console.error(err);
                res.status(200).json({error: "Publication modifiée "});
            });
        }
            else{
             res.status(200).json({error: "La publication n'existe pas "})
            }
             })
        clubPostData = doc.data();
         clubPostData.clubPostId = doc.id;
        return doc.ref.collection('Comments').get()
    
    .then((data) =>{
         clubPostData.Comments =[];
        data.forEach((doc) => {
            clubPostData.Comments.push(doc.data());  
        });
        return res.json(clubPostData);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"} );
    })
            
        }
          
      
);*/
exports.putClubPost = (async(req, res) => {

    try {
        const document = db.collection('ClubPosts').doc(req.params.clubPostId);
        await document.update({
         body: req.body.body
        });
        return res.status(200).json({message : 'Publication modifiée'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
    });

    exports.deleteClubPost = ((req, res) => {
        
        db.collection('ClubPosts').doc(req.params.clubPostId).get().then((doc) => {
            if (doc.exists) {
              doc.ref.delete().then(() => {
                  res.status(200).json({message : 'Publication supprimée'});
                })
                .catch((error) => {
                    console.log(error)
                  res.status(500).json({message : 'Something went wrong'});
                });
            } else {
              res.status(500).json({ erreur: "le post n'existe plus" });
            }
          })
          .catch((error) => {
              console.log(error)
            res.status(500).json({message : 'Something went wrong'});
          });
      });