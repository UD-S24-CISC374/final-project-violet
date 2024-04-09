import { stringFSM } from "../objects/stringFSM";

export abstract class levelsFSM {
    public static getLevels(): stringFSM[] {
        // finite state machine
        const lvl1 = new stringFSM(
            1, // id
            "All strings", // language description
            ["a", "b"], // alphabet
            ["q0"], // states
            "q0", // start state
            ["q0"], // accepting states
            [["q0", "a", "q0", "b", "q0"]], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl2 = new stringFSM(
            2, // id
            "Even a's", // language description
            ["a", "b"], // alphabet
            ["q0", "q1"], // states
            "q0", // start state
            ["q0"], // accepting states
            [
                ["q0", "a", "q1", "b", "q0"],
                ["q1", "a", "q0", "b", "q1"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl3 = new stringFSM(
            3, // id
            "Odd b's", // language description
            ["a", "b"], // alphabet
            ["q0", "q1"], // states
            "q0", // start state
            ["q1"], // accepting states
            [
                ["q0", "a", "q0", "b", "q1"],
                ["q1", "a", "q1", "b", "q0"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl4 = new stringFSM(
            4, // id
            "Start with ab", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q2"], // accepting states
            [
                ["q0", "a", "q1", "b", "q3"],
                ["q1", "a", "q3", "b", "q2"],
                ["q2", "a", "q2", "b", "q2"],
                ["q3", "a", "q3", "b", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl5 = new stringFSM(
            5, // id
            "End with ba", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2"], // states
            "q0", // start state
            ["q2"], // accepting states
            [
                ["q0", "a", "q0", "b", "q1"],
                ["q1", "a", "q2", "b", "q1"],
                ["q2", "a", "q0", "b", "q1"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl6 = new stringFSM(
            6, // id
            "Contains aba", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q3"], // accepting states
            [
                ["q0", "a", "q1", "b", "q0"],
                ["q1", "a", "q1", "b", "q2"],
                ["q2", "a", "q3", "b", "q0"],
                ["q3", "a", "q3", "b", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl7 = new stringFSM(
            7, // id
            "Not contains bab", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q0", "q1", "q2"], // accepting states
            [
                ["q0", "a", "q0", "b", "q1"],
                ["q1", "a", "q2", "b", "q1"],
                ["q2", "a", "q0", "b", "q3"],
                ["q3", "a", "q3", "b", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl8 = new stringFSM(
            8, // id
            "Starts with aa or bb", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3", "q4"], // states
            "q0", // start state
            ["q2"], // accepting states
            [
                ["q0", "a", "q1", "b", "q3"],
                ["q1", "a", "q2", "b", "q4"],
                ["q2", "a", "q2", "b", "q2"],
                ["q3", "a", "q4", "b", "q2"],
                ["q4", "a", "q4", "b", "q4"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl9 = new stringFSM(
            9, // id
            "Contains aa and bb", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"], // states
            "q0", // start state
            ["q4"], // accepting states
            [
                ["q0", "a", "q1", "b", "q5"],
                ["q1", "a", "q2", "b", "q5"],
                ["q2", "a", "q2", "b", "q3"],
                ["q3", "a", "q2", "b", "q4"],
                ["q4", "a", "q4", "b", "q4"],
                ["q5", "a", "q1", "b", "q6"],
                ["q6", "a", "q7", "b", "q6"],
                ["q7", "a", "q4", "b", "q6"],
            ], // delta transitions
            "DFA" // machine type
        ); // finite state machine
        const lvl10 = new stringFSM(
            10, // id
            "Contains aaa and does not contain bbb", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"], // states
            "q0", // start state
            ["q3", "q7", "q8"], // accepting states
            [
                ["q0", "a", "q1", "b", "q4"],
                ["q1", "a", "q2", "b", "q4"],
                ["q2", "a", "q3", "b", "q4"],
                ["q3", "a", "q3", "b", "q7"],
                ["q4", "a", "q1", "b", "q5"],
                ["q5", "a", "q1", "b", "q6"],
                ["q6", "a", "q6", "b", "q6"],
                ["q7", "a", "q7", "b", "q8"],
                ["q8", "a", "q3", "b", "q6"],
            ], // delta transitions
            "DFA" // machine type
        );

        let levels: stringFSM[] = [
            lvl1,
            lvl2,
            lvl3,
            lvl4,
            lvl5,
            lvl6,
            lvl7,
            lvl8,
            lvl9,
            lvl10,
        ];
        return levels;
    }
}
