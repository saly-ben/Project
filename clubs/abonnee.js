const {db} = require('../util/admin');
const admin = require('firebase-admin');
exports.joinClub = (req, res) => {
    let joinClub = {
      username : req.body.username,
      clubName: req.body.clubName,
      date: new Date().toISOString(),
    };
    db.collection("Join")
      .where( "clubName","==", joinClub.clubName)
      .get()
      .then((doc) => {
        if (doc.size > 0){
          res.status(501).json({ error: " demande déja envoyée" });
        } else {
          db.collection("Join")
            .add(joinClub)
            .then((doc) => {
              console.log(doc.id);
              return res.status(200).json({ success: "demande envoyée" });
            })
            .catch((e) => {
              console.error(e);
              return res.status(500).json({ error: "something went wrong" });
            });
        }
      })
      .catch((e) => {
        console.error(e);
        return res.status(500).json({ error: "something went wrong" });
      });
  };