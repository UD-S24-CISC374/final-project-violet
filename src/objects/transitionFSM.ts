import { stringFSM } from "./stringFSM";

export class transitionFSM {
    private state: string;
    private statesAndInputs: Map<string, string>; // = new Map([]);

    constructor(state: string, statesAndInputs: Map<string, string>) {
        this.state = state;
        this.statesAndInputs = statesAndInputs;
    }

    // Get state of transition
    public getState(): string {
        return this.state;
    }

    // Adding a new key-value pair (input-state(s))
    public setStateInput(input: string, state: string, typeFSM: string): void {
        // add state validator
        if (
            (typeFSM === stringFSM.DFA || typeFSM === stringFSM.NFA) &&
            !this.statesAndInputs.has(input)
        ) {
            this.statesAndInputs.set(input, state);
        } else if (
            typeFSM === stringFSM.NFA &&
            this.statesAndInputs.has(input)
        ) {
            let updateValue: string =
                this.statesAndInputs.get(input) + "," + state;
            this.statesAndInputs.set(input, updateValue);
        }
    }

    // Accessing a value (state(s)) by key (input)
    public getStateInput(input: string): string {
        let result: string | undefined = this.statesAndInputs.get(input);
        if (result === undefined) {
            // Handle the undefined case, e.g., by returning a default string
            result = "";
        }
        return result;
    }

    // Checking for a key (input)
    public checkStateInput(input: string): boolean {
        return this.statesAndInputs.has(input);
    }

    // Deleting a key-value pair (input-state(s))
    public deleteStateInput(input: string): void {
        this.statesAndInputs.delete(input);
    }

    // Iterating over the dictionary
    public showStatesAndInputs(): void {
        this.statesAndInputs.forEach((key, value) => {
            console.log(key, value);
        });
        /*
            // Or using for..of
            for (let [key, value] of mapDictionary) {
                console.log(key, value);
            }
        */
    }
}
