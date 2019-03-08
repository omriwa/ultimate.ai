import * as React from "react";
// interface 
import { IData } from "../interface/data";
import { Label } from './label';
// animation
import Transition from "react-transition-group/Transition";
import { isObject } from 'util';

interface IListItemProps {
    data: IData;
    onChangeComment: (id: number, comment: string) => void;
}

interface IListItemState {
    isOpen: boolean
}

export class ListItem extends React.Component<IListItemProps, IListItemState> {
    constructor(props: IListItemProps) {
        super(props);

        this.state = {
            isOpen: false
        }
        // binding functions
        this.toggleDescription = this.toggleDescription.bind(this);
        this.onChange = this.onChange.bind(this);  
    }

    public componentDidMount() {
        // event listener for interacting from the diagram
        window.addEventListener("toggleDesription-" + this.props.data.id, this.toggleDescription, false);
    }

    private onChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.props.onChangeComment(this.props.data.id, e.target.value);
    }

    private toggleDescription(): void {
        this.setState({
            ...this.state,
            isOpen: !this.state.isOpen
        });
    }

    public render() {
        const style = {
            show: {
                height: 125,
                opacity: 1
            },
            hide: {
                height: 0,
                opacity: 0
            }
        },
            defaultStyle = {
                transition: "500ms all"
            };

        return <li>
            <span
                onClick={this.toggleDescription}
            >
                <Label
                    label="Date:"
                    value={this.props.data.date.toISOString()}
                />
            </span>

            <Transition
                in={this.state.isOpen}
                timeout={500}
                unmountOnExit={true}
            >
                {
                    state => <div
                        style={
                            {
                                ...defaultStyle,
                                ...(
                                    state === "entring" || state === "entered"
                                        ?
                                        style.show
                                        :
                                        style.hide
                                )
                            }
                        }
                    >
                        <Label
                            label="Bot Only:"
                            value={this.props.data.botOnly}
                        />

                        <Label
                            label="Agent Only:"
                            value={this.props.data.agentOnly}
                        />

                        <Label
                            label="Bot And Agent:"
                            value={this.props.data.botAgent}
                        />


                        <div>
                            <label>
                                Comment:
                            </label>

                            <div>
                            <textarea
                                value={this.props.data.comment}
                                onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                }
            </Transition>
        </li >
    }
}