import mongoose from 'mongoose';

const statuses = ['Pending', 'In Progress', 'Completed', 'Blocked', 'Canceled'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: statuses, default: 'Pending' },
    priority: { type: String, enum: priorities, default: 'Medium' },
    deadline: { type: Date },
    project: {
      name: { type: String, required: true, trim: true },
      code: { type: String, trim: true }
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export { Task, statuses, priorities };
