// Define the class in a file named ExampleClass.ts

import { transition } from "../objects/transition";

export class stringFSM {
    private id: number; // id of FSM
    private languageDescription: string; // description of the language of the FSM
    private alphabet: string[]; // alphabet of FSM
    private states: string[]; // states of FSM
    private start: string; // start state of FSM
    private accept: string[]; // accept states of FSM
    private transitions: transition[]; // delta transitions of FSM

    constructor(
        id: number,
        languageDescription: string,
        alphabet: string[],
        states: string[],
        start: string,
        accept: string[],
        transitions: transition[]
    ) {
        this.idFSM = id;
        this.languageDescriptionFSM = languageDescription;
        this.alphabetFSM = alphabet;
        this.statesFSM = states;
        this.startFSM = start;
        this.acceptFSM = accept;
        this.transitionsFSM = transitions;
    }

    // Getter & Setter for id
    public get idFSM(): number {
        return this.id;
    }
    private set idFSM(value: number) {
        this.idFSM = value;
    }

    // Getter & Setter for languageDescription
    public get languageDesctiptionFSM(): string {
        return this.languageDescription;
    }
    private set languageDescriptionFSM(value: string) {
        this.languageDescriptionFSM = value;
    }

    // Getter & Setter for alphabet
    public get alphabetFSM(): string[] {
        return this.alphabet;
    }
    private set alphabetFSM(value: string[]) {
        this.alphabet = value;
    }

    // Getter & Setter for states
    public get statesFSM(): string[] {
        return this.states;
    }
    private set statesFSM(value: string[]) {
        this.states = value;
    }

    // Getter & Setter for start
    public get startFSM(): string {
        return this.start;
    }
    private set startFSM(value: string) {
        this.start = value;
    }

    // Getter & Setter for accept
    public get acceptFSM(): string[] {
        return this.accept;
    }
    private set acceptFSM(value: string[]) {
        this.accept = value;
    }

    // Getter & Setter for
    public get transitionsFSM(): transition[] {
        return this.transitions;
    }
    private set transitionsFSM(value: transition[]) {
        this.transitions = value;
    }

    public checkString(value: string): boolean {
        let stringAccepts: boolean = true;
        let currentState: string = this.start;
        for (let index = 0; index < value.length; index++) {
            let currentInput = value[index];
            let hasTransition: boolean = false;
            for (let delta = 0; delta < this.transitions.length; delta++) {
                let deltaTran = this.transitions[delta];
                let state = deltaTran.getState();
                if (
                    state === currentState &&
                    deltaTran.checkStateInput(currentInput)
                ) {
                    hasTransition = true;
                    currentState = deltaTran.getStateInput(currentInput);
                    break;
                }
            }
            if (!hasTransition || currentState === "") {
                stringAccepts = false;
                break;
            }
        }
        return stringAccepts;
    }

    // Example of a method that performs an action
    public doSomething(): void {
        console.log(`Doing something with ${this.id}`);
    }
}

/* Example usage in another file
import { stringFSM } from "../objects/stringFSM";

const exampleInstance = new stringFSM(0);
console.log(exampleInstance.FSMId); // Accessing the property via getter

exampleInstance.FSMId = 1; // Modifying the property via setter
exampleInstance.doSomething(); // Expected output: Doing something with new value
*/
