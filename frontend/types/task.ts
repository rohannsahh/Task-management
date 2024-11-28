export interface Task {
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
    priority: number;
    status: 'pending' | 'finished';
    timeToFinish?: number;
}
