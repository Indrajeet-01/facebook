const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer")
const { generateToken } = require("../helpers/token")
const generateCode = require("../helpers/generateCode");
const { validateEmail, validateLength, validateUsername } = require("../helpers/validation")
const User = require("../models/User")
const Code = require("../models/Code");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


exports.register = async (req,res) => {
    try {
    const {
        first_name,
        last_name,
        email,
        password,
        username,
        bYear,
        bMonth,
        bDay,
        gender,
    } = req.body

    if (!validateEmail(email)){
        return res.status(400).json({
            message: "invalid email address",
        })
    }

    const check = await User.findOne({email})
    if (check) {
        return res.status(400).json({
            message: "This email address already exist.",
        })
    }

    if (!validateLength(first_name,3,30)) {
        return res.status(400).json({
            message: "First name in range of 3 and 30 characters.",
        })
    }
    if (!validateLength(last_name,3,30)) {
        return res.status(400).json({
            message: "Last name in range of 3 and 30 characters.",
        })
    }
    if (!validateLength(password,6,30)) {
        return res.status(400).json({
            message: "Password must be atleast of 6 characters.",
        })
    }
    const cryptedPassword = await bcrypt.hash(password,12)

    
    let tempUsername = first_name + last_name
    let newUsername = await validateUsername(tempUsername)
    

    const user = await new User({
        first_name,
        last_name,
        email,
        password: cryptedPassword,
        username: newUsername,
        bYear,
        bMonth,
        bDay,
        gender,
    }).save()

    const emailVerificationToken = generateToken(
        { id: user._id.toString()}, "30m"
    )

    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`

    sendVerificationEmail(user.email,user.first_name,url)

    const token = generateToken({ id: user._id.toString()},"7d")

    res.send({
        id:user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token: token,
        verified: user.verified,
        message: "Register Success ! please activate your email to start"
    })
    } catch(error) {
        res.status(500).json({message:error.message})
    }
}

exports.activateAccount = async (req,res) => {
    try{
        const validUser = req.user.id
    const {token} = req.body
    const user = jwt.verify(token,process.env.TOKEN_SECRET)
    const check = await User.findById(user.id)
    if (validUser !== user.id) {
        return res.status(400).json({message: "you don't have authorization to this operation"})
    }
    if (check.verified == true) {
        return res.status(400).json({message: "this email is already exist"})
    } else {
        await User.findByIdAndUpdate(user.id, {verified: true})
        return res.status(200).json({message: "Account has been activated"})
    }} catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: "This email is not registered"})
        }
        const check = await bcrypt.compare(password, user.password)
        if (!check) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = generateToken({ id: user._id.toString()},"7d")

        res.send({
            id:user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
            
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.sendVerification = async(req,res) => {
    try {
        const id = req.user.id
        const user = await  User.findById(id)
        if (user.verified === true) {
            return res.status(400).json({
                message:"this account is already activated"
            })
        }
        const emailVerificationToken = generateToken(
            { id: user._id.toString()}, "30m"
        )
    
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
    
        sendVerificationEmail(user.email,user.first_name,url)
        return res.status(200).json({
            message:"email verification link has been sent to your email"
        })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

exports.findUser = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        return res.status(400).json({
          message: "Account does not exists.",
        });
      }
      return res.status(200).json({
        email: user.email,
        picture: user.picture,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.sendResetPasswordCode = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      await Code.findOneAndRemove({ user: user._id });
      const code = generateCode(5);
      const savedCode = await new Code({
        code,
        user: user._id,
      }).save();
      sendResetCode(user.email, user.first_name, code);
      return res.status(200).json({
        message: "Email reset code has been sent to your email",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
