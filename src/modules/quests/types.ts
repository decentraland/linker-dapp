export type QuestInfoResponse = {
    messageToSign: string
    extraData?: {
        questName?: string,
        questId?: string,
        createQuest?: Record<any, any>
    },
    actionType: "create" | "list" | "activate" | "deactivate"
}