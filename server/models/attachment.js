import mongoose from "mongoose";
const { Schema } = mongoose;

const attachmentSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps:true
});

const Attachment = mongoose.model('Attachment', attachmentSchema);
export default Attachment;