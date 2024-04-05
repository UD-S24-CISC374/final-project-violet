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

    private currentState: string; // will always begin as start
    private currentString: string; // will always begin as empty
    private machineAccepts: boolean; // will always begin as false

    constructor(
        id: number,
        languageDescription: string,
        alphabet: string[],
        states: string[],
        start: string,
        accept: string[],
        transitions: transition[]
    ) {
        this.id = id;
        this.languageDescription = languageDescription;
        this.alphabet = alphabet;
        this.states = states;
        this.start = start;
        this.accept = accept;
        this.transitions = transitions;

        this.currentState = this.start;
        this.currentString = "";
        this.machineAccepts = false;
    }

    // Getter & Setter for id
    public getIdFSM(): number {
        return this.id;
    }
    private setIdFSM(value: number) {
        this.id = value;
    }

    // Getter & Setter for languageDescription
    public getLanguageDescriptionFSM(): string {
        return this.languageDescription;
    }
    private setLanguageDescriptionFSM(value: string) {
        this.languageDescription = value;
    }

    // Getter & Setter for alphabet
    public getAlphabetFSM(): string[] {
        return this.alphabet;
    }
    private setAlphabetFSM(value: string[]) {
        this.alphabet = value;
    }

    // Getter & Setter for states
    public getStatesFSM(): string[] {
        return this.states;
    }
    private setStatesFSM(value: string[]) {
        this.states = value;
    }

    // Getter & Setter for start
    public getStartFSM(): string {
        return this.start;
    }
    private setStartFSM(value: string) {
        this.start = value;
    }

    // Getter & Setter for accept
    public getAcceptFSM(): string[] {
        return this.accept;
    }
    private setAcceptFSM(value: string[]) {
        this.accept = value;
    }

    // Getter & Setter for
    public getTransitionsFSM(): transition[] {
        return this.transitions;
    }
    private setTransitionsFSM(value: transition[]) {
        this.transitions = value;
    }

    public clearCurrentString(): void {
        this.currentString = "";
    }

    public resetCurrentState(): void {
        this.currentState = this.start;
    }

    public resetMachineAccepts(): void {
        this.machineAccepts = false;
    }

    public readInput(input: string): boolean {
        let readsInput: boolean = false;
        for (
            let index = 0;
            index < this.transitions.length && this.currentState !== "";
            index++
        ) {
            let deltaTransition = this.transitions[index];
            let state = deltaTransition.getState();
            if (
                state === this.currentState &&
                deltaTransition.checkStateInput(input)
            ) {
                readsInput = true;
                this.currentState = deltaTransition.getStateInput(input);
                this.currentString += input;
                break;
            }
        }
        if (!readsInput) {
            this.currentState === "";
        }
        return readsInput;
    }

    public generateString(): string {
        this.clearCurrentString();
        this.resetCurrentState();
        this.resetMachineAccepts();
        let count: number = Math.ceil(Math.random() * 10); // length of string
        for (let index = 0; index < count; index++) {
            let inputIndex: number = Math.floor(
                Math.random() * this.alphabet.length
            );
            let input = this.alphabet[inputIndex];
            this.readInput(input);
        }
        return this.currentString;
    }

    public generateStrings(count: number): string[] {
        let results: string[] = [];
        count = count < 1 ? 1 : count;
        for (let index = 0; index < count; index++) {
            results[index] = this.generateString();
        }
        return results;
    }

    public getMachineAccepts(): boolean {
        for (let index = 0; index < this.accept.length; index++) {
            if (this.currentState === this.accept[index]) {
                this.machineAccepts = true;
            }
        }
        return this.machineAccepts;
    }

    public checkString(value: string): boolean {
        this.clearCurrentString();
        this.resetCurrentState();
        this.resetMachineAccepts();
        for (
            let index = 0;
            index < value.length && this.currentState !== "";
            index++
        ) {
            let currentInput = value[index];
            this.readInput(currentInput);
        }
        return this.getMachineAccepts();
    }

    public checkStrings(values: string[]): boolean[] {
        let acceptingStrings: boolean[] = [];
        for (let index = 0; index < values.length; index++) {
            acceptingStrings[index] = this.checkString(values[index]);
        }
        return acceptingStrings;
    }
}

/*
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
*/

/*
// Example of a method that performs an action
    public doSomething(): void {
        console.log(`Doing something with ${this.id}`);
    }
*/
/* Example usage in another file
import { stringFSM } from "../objects/stringFSM";

const exampleInstance = new stringFSM(0);
console.log(exampleInstance.FSMId); // Accessing the property via getter

exampleInstance.FSMId = 1; // Modifying the property via setter
exampleInstance.doSomething(); // Expected output: Doing something with new value
*/
