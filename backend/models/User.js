const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Student', 'Organizer', 'Admin'], 
        default: 'Student' 
    },

    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    
    //gamification for students only
    gamification: {
        xp: { type: Number, default: 0 },
        badges: [{ type: String }]
    }
}, { timestamps: true });

//password hash
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//password match
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);