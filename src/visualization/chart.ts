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
        this.createLines();
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
                .range([svgBounds.width * 0.05, svgBounds.width * 0.9])
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
            .attr("transform", this.translate(svgBounds.width * -0.05, svgBounds.height * 0.9))
    }

    private createYAxis(): void {
        const svgBounds = d3.select(this.config.svgId).node().getBoundingClientRect(),
            yScale = d3.scaleLinear()
                .range([svgBounds.height * 0.9, svgBounds.height * 0.05])
                .domain([0, d3.max(this.data, d => d.total)]);

        d3.select(this.config.svgId)
            .select(".chart-container")
            .append("g")
            .attr("class", "x-axis")
            .call(
                d3.axisLeft(yScale)
            )
    }

    private createLines(): void {
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
                });


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
            .attr("class", "circle")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.total))
            .transition()
            .delay((d, i) => 2000 / this.data.length * i)
            .duration((d, i) => 2000 / this.data.length * i)
            .attr("r", 8)
            .attr("fill", "#FFBC42")
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
    }

    private onCircleEnter(data: IData): void {
        const event = d3.event;
        console.log("e",d3.event)
        // create svg for description
        d3.select("body")
            .append("svg")
            .attr("id", "description")
            .style("width", 500)
            .style("height", 300)
            .style("position", "absolute")
            .style("left", event.screenX)
            .style("bottom", event.screenY)
        // create pie
        this.createPie(data);
        // create comment
    }

    private onCircleLeave(): void {
        d3.select("#description")
            .remove();
    }

    private createPie(data: IData): void {
        const pieData = [
            data.agentOnly,
            data.botAgent,
            data.botOnly
        ].map(val => val / data.total),
            outerRadius = 80,
            innerRadius = 10,
            pie = d3.pie(),
            arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius),
            colors = ["#FFDDC1", "red", "#D1D3D4"],
            texts = ["Agent", "B&A", "Bot"];

        console.log("pieData", pie(pieData))

        const arcs = d3.select("#description")
            .append("g")
            .attr("transform","translate(" + 200 + "," + 100  + ")")
            .attr("class","pie-container")
            .selectAll(".arc")
            .data(pie(pieData))
            .enter()
            .append("g")
            .attr("class", "arc")

        arcs.append("path")
            .attr("fill", (d, i) => colors[i])
            .attr("d", arc);

        arcs.append("text")
            .attr("transform", (d, i) => {
                return "translate(" + arc.centroid(pie(pieData)[i]) + ")";
            })
            .text((d, i) => texts[i])
            
    }

    private createComment(): void {

    }

    private translate(x: number, y: number): string {
        return "translate(" + x + "," + y + ")";
    }
}