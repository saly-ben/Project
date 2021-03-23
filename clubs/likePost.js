const {db} = require('../util/admin');
const admin = require('firebase-admin');
exports.LikerPost = ((req, res)=>{
    const like = db.collection('Clubs').doc(req.params.clubId).collection('ClubPosts').doc(req.params.clubPostId)
    .collection('LikePost')
    //.where('clubPostId', '==' , req.params.clubPostId).limit(1)
    .where('username' , '==' , req.body.username)
    const clubPost = db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}`);
    let clubPostData;
    clubPost.get().then(doc => {
        if(doc.exists){
            clubPostData = doc.data();
            clubPostData.clubPostId = doc.id;
            return like.get(); 
        }else{
            return res.status(404).json({error: 'Publication non trouvée'});
        }
    })
    .then(data =>{
        if(data.empty){
            return db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}`).collection('LikePost').add({
                clubPostId: req.params.clubPostId,
                username: req.body.username
            })
            .then((doc) =>{
                 clubPostData.likeCount++;
                return clubPost.update({likeCount: clubPostData.likeCount });
            })
            .then(() =>{
                return res.json(clubPostData);
            });
        }else{
            return res.status(400).json({error: 'Vous avez déja aimé la publication'});
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
});

exports.deleteLike =  ((req, res) => {
    const like = db.collection('Clubs').doc(req.params.clubId).collection('ClubPosts').doc(req.params.clubPostId)
    .collection('LikePost')
    .where('username' , '==' , req.body.username)

    const clubPost = db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}`);

    let clubPostData;
    clubPost.get().then(doc => {
        if(doc.exists){
            clubPostData = doc.data();
            clubPostData.clubPostId = doc.id;
            return like.get(); 
        }else{
            return res.status(404).json({error: 'Publication non trouvée'});
        }
    })
    .then(data =>{
        if(data.empty){
            return res.status(404).json({error: 'Publication non aimé'});
        }else{
            return db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}/LikePost/${data.docs[0].id}`)
            .delete().then(() =>{
                clubPostData.likeCount--;
                return clubPostData.update({ likeCount: clubPostData.likeCount});
            })
            .then(() =>{
                res.json(clubPostData);
            })
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
    
    });