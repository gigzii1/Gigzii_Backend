const Usermodel=require('../../models/User');
const sendmail = require('../../utils/mail');


const verifyArtist = async (req, res) => {
  try {
    const{id}=req.params
    const artist = await Usermodel.findByIdAndUpdate(
    id, 
      { isVerified: true }, 
      { new: true } 
    );


    if (!artist) {
      return res.status(404).json({ status: false, message: "Artist not found" });
    }
     await sendmail(artist?.email, `Welcome onboarding ${artist.name} Your profile is verified , login to gigzi `);
    

    res.status(200).json({
      status: true,
      message: "Artist verified successfully",
      artist,
    });
  } catch (error) {
    console.error("Error verifying artist:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

module.exports={verifyArtist}