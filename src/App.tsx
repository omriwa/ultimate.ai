import * as React from 'react';
// module
import { Chart } from "./visualization/chart";
// interface
import { IData } from "./visualization/interface/data";
// data
import botData from "./botData";
import { ListItem } from './visualization/components/listItem';

interface IAppState {
    data: IData[]
}

class App extends React.Component<{}, IAppState> {
    private chart: Chart;

    constructor(props) {
        super(props);

        this.state = {
            data: new Array<IData>()
        }
        // binding functions
        this.onChangeComment = this.onChangeComment.bind(this);
    }

    public componentWillMount() {
        // here should be call for getting the data from the server
        const data = botData.map((entry, dataId) => {
            return {
                id: dataId,
                date: new Date(entry.date),
                total: entry.total,
                botOnly: entry.bot_only,
                botAgent: entry.bot_agent,
                agentOnly: entry.agent_only
            }
        });
        // set state and create charts
        this.setState({
            ...this.state,
            data
        },
            () => {
                this.chart = new Chart(
                    {
                        svgId: "#chart"
                    },
                    this.state.data
                );
                this.chart.init();
            }
        );
    }

    private renderList(): any {
        return <ul>
            {
                this.state.data.map(itemData =>
                    <ListItem
                        key={itemData.id}
                        data={itemData}
                        onChangeComment={this.onChangeComment}
                    />
                )
            }
        </ul>
    }

    private onChangeComment(id: number, comment: string): void {
        const dataArray = [...this.state.data],
            dataEntryCopy = { ...this.state.data[id] };
        // change comment
        dataEntryCopy.comment = comment;
        dataArray[dataEntryCopy.id] = dataEntryCopy;
        // replace entry in state and update state
        this.setState({
            ...this.state,
            data: dataArray
        })
    }

    public render() {
        return <div
            style={{
                height: "75vh"
            }}
        >

            <div
                style={{
                    width: "30%",
                    display: "inline-block",
                    height: "100%",
                    overflowY: "scroll"
                }}
            >
            {
                this.renderList()
                }
            </div>

            <svg
                style={{
                    width: "70%",
                    height: "100%"
                }}
                id="chart"
            />
        </div>
    }
}

export default App;
