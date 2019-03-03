// interface
import { IData } from "./interface/data";
import { IConfig } from './interface/config';

export class Chart {
    private config: IConfig;
    private data: IData[];

    constructor(config: IConfig, data: IData[]) {
        this.config = config;
        this.data = data;
    }
}