import * as d3 from "d3";
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

    public init(): void {
        // create charts
        this.createCharts();
    }

    private createCharts(): void {
        // create axis
        this.createAxis();
        // create lines
    }

    private createAxis(): void {
        // create container
        d3.select(this.config.svgId)
            .append("g")
            .attr("class", "chart-container");

        this.createXAxis();
        this.createYAxis();
    }

    private createXAxis(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect(),
            xScale = d3.scaleTime()
                .range([svgBounds.width * 0.05, svgBounds.width * 0.9])
                .domain(d3.extent(this.data, d => d.date));

        d3.select(this.config.svgId)
            .append("g")
            .attr("class", "x-axis")
            .call(
                d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%Y-%m-%d")
                    )
            )
            .attr("transform", this.translate(svgBounds.width * 0.05, svgBounds.height * 0.95))

    }

    private createYAxis(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect(),
            yScale = d3.scaleLinear()
                .range([svgBounds.height * 0.9, svgBounds.height * 0.05])
                .domain([0, d3.max(this.data, d => d.total)]);

        d3.select(this.config.svgId)
            .append("g")
            .attr("class", "x-axis")
            .call(
                d3.axisLeft(yScale)
        )
            .attr("transform", this.translate(svgBounds.width * 0.1, svgBounds.height * 0.05))
    }

    private createExplanation(): void {

    }

    private translate(x: number, y: number): string {
        return "translate(" + x + "," + y + ")";
    }
}