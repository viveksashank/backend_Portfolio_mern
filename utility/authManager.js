const jwt = require("jsonwebtoken");

function signJWT(payload)
{
   try
   {

     const token = jwt.sign(
        payload,
        "pmpkpavankumar0816",
        {
           expiresIn: "10d"
        }
     );

     return token;

   }
   catch(err)
   {
      console.log("JWT Sign Error:", err);
      return undefined;
   }
}

const verifyJWT = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(
            token,
            "pmpkpavankumar0816"
        );

        req.user = payload;

        next();

    }
    catch (err) {

        return res.status(403).json({
            success: false,
            message: "Invalid token"
        });

    }

};

const authorizeRole = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            const userRole = req.user.role;

            if (!allowedRoles.includes(userRole)) {

                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });

            }

            next();

        }
        catch (err) {

            return res.status(500).json({
                success: false,
                message: "Authorization error",
                error: err.message
            });

        }

    };

};

module.exports = { signJWT, verifyJWT, authorizeRole };