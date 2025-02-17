import jwt from 'jsonwebtoken';

const protectRoute = async (req, res) => {
    try {
        const token = res.cookies.jwt;
        if(token){
            return res.status(401).json({error : "Unauthorised - No user Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded){
            return res.status(401).json({error : "Unauthorised - Invalid Token"});

        }

        const user = await User.findById(decoded.userId).select("password");

        if(!user){
            return res.status(404).json({error : "User not found"})
        }

        res.user = user

        next();
        
    } catch (error) {
        console.log("Error in protection middleware : ", error.message)
        res.status(500).json({error : "Internal Server Error"});
    }
}

export default protectRoute