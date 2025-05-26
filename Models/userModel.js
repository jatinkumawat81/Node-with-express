const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter valid email.']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            // This validator will only work for save() && create()
            validator: function(val){
                return val == this.password;
            },
            message: 'Password & Confirm Password does not match!'
        }
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    passwordResetToken: String,
    PasswordResetToeknExpires: Date
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    // encrypt the password before saving it
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.comparePasswordInDb = async function(pass,passDb){
   return await bcrypt.compare(pass,passDb)
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
   if(this.passwordChangedAt){
        const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        return JWTTimestamp < pswdChangedTimestamp;
   }
   return false
}
userSchema.methods.createResetPassToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.PasswordResetToeknExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}
const User = mongoose.model('User',userSchema);

module.exports = User;