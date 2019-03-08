import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
// components
import { ListItem } from "./components/listItem";
import { Label } from "./components/label";
// test configuratio
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe("LabelTest", () => {
    it("render without crashing", () => {
        render(<Label
            label=""
            value=""
        />);
    });
});

describe("ListItemTest", () => {
    it("render without crashing", () => {
        render(
            <ListItem
                data={{
                    agentOnly: 0,
                    botAgent: 0,
                    botOnly: 0,
                    comment: "",
                    date: new Date(),
                    id: 1,
                    total: 0
                }}
                onChangeComment={(id: number, comment: string) => { }}
            />
            )
        });

        it("open on click", () => {
            const ListItemWrapper = shallow(
                <ListItem
                    data={{
                        agentOnly: 0,
                        botAgent: 0,
                        botOnly: 0,
                        comment: "",
                        date: new Date(),
                        id: 1,
                        total: 0
                    }}
                    onChangeComment={(id: number, comment: string) => { }}
                />
            );
            expect(ListItemWrapper.state().isOpen).toBeFalsy();
            ListItemWrapper.find("li").find("span").first().simulate("click");
            expect(ListItemWrapper.state().isOpen).toBeTruthy();
        });

    it("change comment", () => {
        let stateComment = "";
        const ListItemWrapper = mount(
            <ListItem
                data={{
                    agentOnly: 0,
                    botAgent: 0,
                    botOnly: 0,
                    comment: stateComment,
                    date: new Date(),
                    id: 1,
                    total: 0
                }}
                onChangeComment={(id: number, comment: string) => { stateComment = comment }}
            />
        );
        // open list item
        ListItemWrapper.setState({ isOpen: true });
        expect(ListItemWrapper.state().isOpen).toBeTruthy();
        ListItemWrapper.update();
        // change comment
        ListItemWrapper.find("textarea").simulate("change", {
            target: {
                value: "change"
            }
        });
        expect(stateComment).toBe("change");
    });
});

describe("App test", () => {
    it('renders without crashing', () => {
        render(<App />);
    });
});


