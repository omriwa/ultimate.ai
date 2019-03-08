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
        // create label
        this.createAxisLabels("Total Conversations", "Date");
    }

    private createCharts(): void {
        // create axis
        this.createAxis();
        // create lines
        this.createLine();
    }

    private createAxis(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect();
        // create container
        d3.select(this.config.svgId)
            .append("g")
            .attr("class", "chart-container")
            .attr("transform", this.translate(svgBounds.width * 0.05, svgBounds.height * 0.05))

        this.createXAxis();
        this.createYAxis();
    }

    private createXAxis(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect(),
            xScale = d3.scaleTime()
                .range([svgBounds.width * 0.05, svgBounds.width * 0.95])
                .domain(d3.extent(this.data, d => d.date));

        d3.select(this.config.svgId)
            .select(".chart-container")
            .append("g")
            .attr("class", "x-axis")
            .call(
                d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%Y-%m-%d")
                    )
            )
            .attr("transform", this.translate(svgBounds.width * -0.05, svgBounds.height * 0.85))
    }

    private createYAxis(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect(),
            yScale = d3.scaleLinear()
                .range([svgBounds.height * 0.85, svgBounds.height * 0.05])
                .domain([0, d3.max(this.data, d => d.total)]);

        d3.select(this.config.svgId)
            .select(".chart-container")
            .append("g")
            .attr("class", "x-axis")
            .call(
                d3.axisLeft(yScale)
            )
    }

    private createLine(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect(),
            xScale = d3.scaleTime()
                .range([svgBounds.width * 0.05, svgBounds.width * 0.9])
                .domain(d3.extent(this.data, d => d.date)),
            yScale = d3.scaleLinear()
                .range([svgBounds.height * 0.9, svgBounds.height * 0.05])
                .domain([0, d3.max(this.data, d => d.total)]),
            totalLine = d3.line()
                .curve(d3.curveCardinal)
                .x(d => {
                    return xScale(d.date);
                })
                .y(d => {
                    return yScale(d.total)
                }),
            circleRadius = 8;


        const path = d3.select(this.config.svgId)
            .select(".chart-container")
            .append("path")
            .datum(this.data)
            .attr("class", "total-line")
            .attr("fill", "none")
            .attr("stroke-width", "5px")
            .attr("stroke", "#0084FF")
            .attr("d", totalLine);

        const pathLength = path.node().getTotalLength();

        // animate path
        path.attr("stroke-dasharray", pathLength + " " + pathLength)
            .attr("stroke-dashoffset", pathLength)
            .transition()
            .duration(2000)
            .attr("stroke-dashoffset", 0);

        d3.select(this.config.svgId)
            .select(".chart-container")
            .selectAll(".circle")
            .data(this.data)
            .enter()
            .append("circle")
            .on("mouseover", this.onCircleEnter.bind(this))
            .on("mouseout", this.onCircleLeave.bind(this))
            .on("click", (d) => window.dispatchEvent(new CustomEvent("toggleDesription-" + d.id)))
            .attr("class", "circle")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.total))
            .transition()
            .delay((d, i) => 2000 / this.data.length * i)
            .duration((d, i) => 2000 / this.data.length * i)
            .attr("r", circleRadius)
            .attr("fill", "#FFBC42")
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
    }

    private onCircleEnter(data: IData): void {
        const event = d3.event,
            circle = d3.select(d3.event.path[0]),
            rectHeight = 25,
            rectWidth = 200;
        // create svg for description
        console.log("event", d3.event)
        const tooltip = d3.select(this.config.svgId)
            .append("g")
            .attr("id", "description");
        // create background
        tooltip.append("rect")
            .attr("x", -rectWidth * 0.055)
            .attr("y", -rectHeight * 0.7)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("fill", "black");
        //create text
        tooltip.append("text")
            .attr("fill", "white")
            .text("click for more information!");
        // adjust to center
        tooltip.attr("transform",
            this.translate(
                circle.attr("cx") - tooltip.node().getBoundingClientRect().width / 4,
                circle.attr("cy")
            )
        )

    }

    private onCircleLeave(): void {
        d3.select("#description")
            .remove();
    }

    private createAxisLabels(xAxisLabel: string, yAxisLabel: string): void {
        const diagramContainer = d3.select(this.config.svgId)
            .select(".chart-container"),
            diagramContainerBounds: ClientRect = diagramContainer.node()
                .getBoundingClientRect();
        // create xAxis label
        d3.select(this.config.svgId)
            .append("text")
            .text(xAxisLabel)
            .attr("transform", diagramContainer.attr("transform"))
        // create yAxis label
        d3.select(this.config.svgId)
            .append("text")
            .text(yAxisLabel)
            .attr("transform", this.translate(diagramContainerBounds.left, diagramContainerBounds.bottom + 10))
    }

    private translate(x: number, y: number): string {
        return "translate(" + x + "," + y + ")";
    }
}