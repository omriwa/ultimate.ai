export interface IData {
    id: number;
    date: Date;
    total: number;
    botOnly: number;
    botAgent: number;
    agentOnly: number;
    comment?: string;
}