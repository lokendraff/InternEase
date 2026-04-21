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
    },
    codingProfiles: {
        leetcodeHandle: { type: String, default: "" },
        codeforcesHandle: { type: String, default: "" },
        stats: {
            leetcode: {
                totalSolved: { type: Number, default: 0 },
                ranking: { type: Number, default: 0 }
            },
            codeforces: {
                rating: { type: Number, default: 0 },
                rank: { type: String, default: "unranked" }
            }
        }
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