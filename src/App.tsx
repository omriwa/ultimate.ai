import * as React from 'react';
// module
import { Chart } from "./visualization/chart";
// interface
import { IData } from "./visualization/interface/data";
// data
import botData from "./botData";

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
    }

    public componentWillMount() {
        // here should be call for getting the data from the server
        const data = botData.map(entry => {
            return {
                date: new Date(entry.date),
                total: entry.total,
                botOnly: entry.bot_only,
                botAgent: entry.bot_agent,
                agentOnly: entry.agent_only
            }
        });
        this.setState({
            ...this.state,
            data
        },
            () => {
                this.chart = new Chart(
                    { 
                        svgId: "chart" 
                    },
                    this.state.data
                );
            }
        );
    }

  public render() {
    return (
        <div className="App">
            <svg id="chart"/>
      </div>
    );
  }
}

export default App;
