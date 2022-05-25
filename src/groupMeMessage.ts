import GroupMeAttachment from './groupMeAttachment';

export default class GroupMeMessage {
    "attachments": GroupMeAttachment[];
    "avatar_url": string;
    "created_at": number;
    "group_id": string;
    "id": string;
    "name": string;
    "sender_id": string;
    "sender_type": string;
    "source_guid": string;
    "system": boolean;
    "text": string;
    "user_id": string;
}