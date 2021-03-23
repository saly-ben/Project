const {db} = require('../util/admin');
const admin = require('firebase-admin');

exports.createClubs = ((req, res) => {
 const newClub = {
        clubName : req.body.clubName,
        owner : req.body.owner,
        category : req.body.category,
        membersCount : 0,
        createdAt: new Date().toISOString()
    };

    db.collection('Clubs').add(newClub)
    .then(doc => {
        newClub.clubId = doc.id;
        res.json(newClub);
    })
    .catch(err => {
        res.status(500).json({message : 'Club non creé'});
        console.error(err); 
    })
});

  

//read all 
exports.getClub= ((req , res) => {
    db.collection('Clubs').get()
    .then((data) =>{
         let clubs =[];
        data.forEach((doc) => {
            clubs.push(doc.data());  
        });
        return res.json(clubs);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
    });

//update club
exports.putClub =(req , res)=> {

    const clubId = req.params.clubId
     db.collection('Clubs').doc(clubId)
     .get()
     .then((doc) =>{
         if(doc.exists){
             doc.ref.update({
                 clubName :req.body.clubName
             })
             .then(()=> {
                 res.status(200).json({message: 'ClubName has been modified successfully'});
             })
         }
         else{
             res.status(200).json({message : 'ClubName can\'t be modified'});
         }
         
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({error: 'Something went wrong'});
     })
}
/*exports.putClub= (req, res) => {
    
         db.collection('Clubs').doc(req.params.clubId);
            
            if(doc.exists){
                         return res.status(200).json({message: 'clubName already  exists !'});
            }
            else {
              await document.update({
                clubName: req.body.clubName
            });
           return res.status(200).json({message: 'clubName has been modified successfully!'});
            
    }
        .catch(error){
            console.log(error);
            res.status(500).send(error).json({error: 'something went wrong'});
        }
    
};*/

//delete club
exports.deleteClub =(req , res)=> {

       const clubId = req.params.clubId
        db.collection('Clubs').doc(clubId)
        .get()
        .then((doc) =>{
            if(doc.exists){
                doc.ref.delete()
                .then(()=> {
                    res.status(200).json({message: 'document successfully deleted'});
                })
            }
            else{
                res.status(200).json({message : 'document doesn\'t exist'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        })
}