import mongoose from "mongoose";
const { Schema } = mongoose;

const auditLogSchema = new Schema({
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE']
    },
    details: {
        type: String,
        required: false
    },
    relatedEntity: {
        type : {
            type: String,
            required: true,
            enum: ['Task', 'User', 'Project', 'Comment', 'Notification']
        },
        id : {
            type: Schema.Types.ObjectId,
            required: true
        }  
    },
    performedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: false
    },
    device: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;