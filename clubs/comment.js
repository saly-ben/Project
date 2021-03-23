const {db} = require('../util/admin');
const admin = require('firebase-admin');
exports.postPostComment = ((req, res) => {
    if(req.body.body.trim() === '') 
    return res.status(400).json({ error: 'Must Not Be empty'});

    const newComment = {
        username : req.body.username,
        clubPostId: req.params.clubPostId,
        body: req.body.body,
        creatAt: new Date().toISOString()  
    };
     
        db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}`)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    return res.status(404).json({ error: 'post inexistant' })
                }
                return doc.ref.update({ commentCount: doc.data().commentCount + 1})
            })
            .then(() => {
                return db.collection('Clubs').doc(req.params.clubId).collection('ClubPosts').doc(req.params.clubPostId).collection('Comments').add(newComment)
            })
            .then(() => {
                res.json(newComment)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({ error: 'Something went wrong' })
            })
    })
exports.getComment =( (req, res) => {
    db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}`).get().then((doc) =>{
        if(!doc.exists){
            return res.status(404).json({error: "Aucun commentaire "})
        }
        return doc.ref.collection('Comments').get().then((data) =>{
            let comments = [];
            data.forEach(doc => {
                comments.push(doc.data());
            })
            return res.json({comments})
        });

    })
    
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
    });
exports.putComment= (req , res ) =>{
    const document = db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}/Comments/${req.params.commentId}`);
    document.get().then((doc) =>{ 
        if(!doc.exists){
            return res.status(200).json({error: "aucun commentaire "})
        }
       else{
        return document.update({
            body : req.body.body
             });
    }
})
.then(() => {
    res.json({message : 'commentaire modifié'});
})

.catch(err => {
    console.log(err);
    res.status(500).json({err: 'Something Went Wrong'});
})
    };
    exports.deleteComment =  ((req, res) => {

        const document = db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}`);
    
        let commentData;
        document.get().then(doc => {
                commentData = doc.data();
                commentData.clubPostId = doc.id;
        })
        const commentDoc = db.doc(`/Clubs/${req.params.clubId}/ClubPosts/${req.params.clubPostId}/Comments/${req.params.commentId}`);
        commentDoc.get().then((doc) =>{
            if(!doc.exists){
                return res.status(404).json({error: 'aucun commentaire'});
            }
            else{
                
             return commentDoc.delete().then(() =>{
                    commentData.commentCount --;
                    return document.update({commentCount: commentData.commentCount});
                })
    
            }
        })
        .then(() => {
            res.json({message : 'commentaire supprimé'});
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).json({error: err.code});
        })
        
        });