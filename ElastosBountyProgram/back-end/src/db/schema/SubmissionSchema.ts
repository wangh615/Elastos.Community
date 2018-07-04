import {Schema} from 'mongoose';
import {CommentSchema} from './CommentSchema';

const communityProps = {
    community : {
        type: Schema.Types.ObjectId,
        ref: 'community'
    },
    state : {
        type : String
    },
    city : {
        type : String
    }
}

export const Submission = {
    type : {
        type : String,
        required : true
    },
    campaign: {
        type: String
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },

    email: String,
    fullLegalName: String,
    audienceInfo: String,
    publicSpeakingExp: String,
    previousExp: String,

    isDeveloper: Boolean,

    devBackground: String,

    reason: String,

    attachment: String,
    attachmentType: String,
    attachmentFilename: String,

    createdBy : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    comments: [[CommentSchema]],
    subscribers: [{type: Schema.Types.ObjectId, ref: 'users'}],
    ...communityProps
};

