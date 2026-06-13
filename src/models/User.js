import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const roles = ['Admin', 'Manager', 'Developer', 'Designer', 'Intern', 'Client'];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    role: { type: String, enum: roles, default: 'Developer' },
    password: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    profile: {
      title: String,
      department: String,
      phone: String,
      location: String
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    invitationToken: String,
    invitationTokenExpiresAt: Date
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export { User, roles };
