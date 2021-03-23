const {db} = require('../util/admin');
const admin = require('firebase-admin');

exports.postMembers = ((req, res)=>{
    const newMember = {
        userName : req.body.userName,
        clubId: req.params.clubId,
        createAt : new Date().toISOString()
    }
    
    db.doc(`/Clubs/${req.params.clubId}`).get().then((doc) =>{ 
        if(!doc.exists){
            return res.status(200).json({error: "Le Club n'existe pas "})
        }
        return doc.ref.update({membersCount: doc.data().membersCount + 1});
       })
.then(() =>{
    return db.collection('Clubs').doc(req.params.clubId).collection('Members').add(newMember)
})
.then(()=>{
    res.json(newMember);
})
.catch(err => {
    console.log(err);
    res.status(500).json({err: 'Something Went Wrong'});
})
    });

//get all members
exports.getMember =( (req, res) => {
    db.doc(`/Clubs/${req.params.clubId}`).get().then((doc) =>{
        if(!doc.exists){
            return res.status(404).json({error: "Aucun membre "})
        }
        memberData = doc.data();
         memberData.memberId = doc.id;
        return db.collection('Members').get();
    })
        .then((data) =>{
            memberData.member = [];
            data.forEach(doc => {
                memberData.push(doc.data());
            })
            return res.json({memberData})
        })

    
    
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
})

//delete member
