import { stringFSM } from "../objects/stringFSM";

export abstract class levelsFSM {
    public static getLevels(): stringFSM[] {
        // finite state machine
        const lvl1a = new stringFSM(
            1, // id
            "All strings", // language description
            ["a"], // alphabet
            ["q0"], // states
            "q0", // start state
            ["q0"], // accepting states
            [["q0", "a", "q0"]], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl2a = new stringFSM(
            1, // id
            "No strings", // language description
            ["a"], // alphabet
            ["q0"], // states
            "q0", // start state
            [], // accepting states
            [["q0", "a", "q0"]], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl3a = new stringFSM(
            1, // id
            "0 a's", // language description
            ["a"], // alphabet
            ["q0", "q1"], // states
            "q0", // start state
            ["q0"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q1"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl4a = new stringFSM(
            1, // id
            "1 a", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2"], // states
            "q0", // start state
            ["q1"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q2"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl5a = new stringFSM(
            1, // id
            "2 a's", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q2"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl7a = new stringFSM(
            1, // id
            "Odd a's", // language descriptions
            ["a"], // alphabet
            ["q0", "q1"], // states
            "q0", // start state
            ["q1"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q0"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl8a = new stringFSM(
            1, // id
            "Even a's", // language descriptions
            ["a"], // alphabet
            ["q0", "q1"], // states
            "q0", // start state
            ["q0"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q0"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl9a = new stringFSM(
            1, // id
            "Occurrences of 'aaa'", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2"], // states
            "q0", // start state
            ["q0"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q0"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl10a = new stringFSM(
            1, // id
            "Contains 'aa'", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2"], // states
            "q0", // start state
            ["q2"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q2"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl11a = new stringFSM(
            1, // id
            "Contains 'aaa'", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q3"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl12a = new stringFSM(
            1, // id
            "Contains 'aa' or 'aaa'", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q2", "q3"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl13a = new stringFSM(
            1, // id
            "Contains 'aa' and 'aaa'", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q3"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl14a = new stringFSM(
            1, // id
            "Contains 'aa' and odd length", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q3"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q2"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl15a = new stringFSM(
            1, // id
            "Contains 'aaa' and even length", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3", "q4"], // states
            "q0", // start state
            ["q4"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q4"],
                ["q4", "a", "q3"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl16a = new stringFSM(
            1, // id
            "Occurences of 'aa' and odd length", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2"], // states
            "q0", // start state
            [], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q1"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl17a = new stringFSM(
            1, // id
            "Occurences of 'aaa' and even length", // language descriptions
            ["a"], // alphabet
            ["q0", "q1", "q2", "q3", "q4", "q5"], // states
            "q0", // start state
            ["q0"], // accepting states
            [
                ["q0", "a", "q1"],
                ["q1", "a", "q2"],
                ["q2", "a", "q3"],
                ["q3", "a", "q4"],
                ["q4", "a", "q5"],
                ["q5", "a", "q0"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl1ab = new stringFSM(
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
        const lvl2ab = new stringFSM(
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
        const lvl3ab = new stringFSM(
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
        const lvl4ab = new stringFSM(
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
        const lvl5ab = new stringFSM(
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
        const lvl6ab = new stringFSM(
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
        const lvl7ab = new stringFSM(
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
        const lvl8ab = new stringFSM(
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

        const lvl9ab = new stringFSM(
            9, // id
            "Even a's and odd b's or even b's and odd a's", // language description
            ["a", "b"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q1", "q2"], // accepting states
            [
                ["q0", "a", "q2", "b", "q1"],
                ["q1", "a", "q3", "b", "q0"],
                ["q2", "a", "q0", "b", "q3"],
                ["q3", "a", "q1", "b", "q2"],
            ], // delta transitions
            "DFA" // machine type
        );

        // finite state machine
        const lvl10ab = new stringFSM(
            10, // id
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

        const lvl11ab = new stringFSM(
            11, // id
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
                ["q7", "a", "q3", "b", "q8"],
                ["q8", "a", "q3", "b", "q6"],
            ], // delta transitions
            "DFA" // machine type
        );

        const lvl12ab = new stringFSM(
            12, // id
            "Contains 'aaa' and 'ba' and even b's", // language description
            ["a", "b"], // alphabet
            [
                "q0",
                "q1",
                "q2",
                "q3",
                "q4",
                "q5",
                "q6",
                "q7",
                "q8",
                "q9",
                "q10",
                "q11",
                "q12",
                "q13",
                "q14",
                "q15",
            ], // states
            "q0", // start state
            ["q14"], // accepting states
            [
                ["q0", "a", "q1", "b", "q2"],
                ["q1", "a", "q3", "b", "q2"],
                ["q2", "a", "q5", "b", "q4"],
                ["q3", "a", "q6", "b", "q2"],
                ["q4", "a", "q7", "b", "q2"],
                ["q5", "a", "q8", "b", "q2"],
                ["q6", "a", "q6", "b", "q9"],
                ["q7", "a", "q10", "b", "q2"],
                ["q8", "a", "q11", "b", "q2"],
                ["q9", "a", "q13", "b", "q12"],
                ["q10", "a", "q14", "b", "q2"],
                ["q11", "a", "q11", "b", "q14"],
                ["q12", "a", "q14", "b", "q9"],
                ["q13", "a", "q13", "b", "q14"],
                ["q14", "a", "q14", "b", "q15"],
                ["q15", "a", "q15", "b", "q14"],
            ], // delta transitions
            "DFA" // machine type
        );

        const lvl1abc = new stringFSM(
            12, // id
            "Only a's or only b's or only c's", // language description
            ["a", "b", "c"], // alphabet
            ["q0", "q1", "q2", "q3", "q4"], // states
            "q0", // start state
            ["q1", "q2", "q3"], // accepting states
            [
                ["q0", "a", "q1", "b", "q2", "c", "q3"],
                ["q1", "a", "q1", "b", "q4", "c", "q4"],
                ["q2", "a", "q4", "b", "q2", "c", "q4"],
                ["q3", "a", "q4", "b", "q4", "c", "q3"],
                ["q4", "a", "q4", "b", "q4", "c", "q4"],
            ], // delta transitions
            "DFA" // machine type
        );

        const lvl2abc = new stringFSM(
            12, // id
            "any a's or even b's or multiple of 3 c's", // language description
            ["a", "b", "c"], // alphabet
            ["q0", "q1", "q2", "q3"], // states
            "q0", // start state
            ["q0"], // accepting states
            [
                ["q0", "a", "q0", "b", "q1", "c", "q2"],
                ["q1", "a", "q1", "b", "q0", "c", "q2"],
                ["q2", "a", "q2", "b", "q1", "c", "q3"],
                ["q3", "a", "q3", "b", "q1", "c", "q0"],
            ], // delta transitions
            "DFA" // machine type
        );

        const lvl3abc = new stringFSM(
            12, // id
            "odd a's and odd b's ad odd c's", // language description
            ["a", "b", "c"], // alphabet
            ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"], // states
            "q0", // start state
            ["q7"], // accepting states
            [
                ["q0", "a", "q1", "b", "q2", "c", "q3"],
                ["q1", "a", "q0", "b", "q4", "c", "q5"],
                ["q2", "a", "q4", "b", "q0", "c", "q6"],
                ["q3", "a", "q5", "b", "q6", "c", "q0"],
                ["q4", "a", "q2", "b", "q1", "c", "q7"],
                ["q5", "a", "q3", "b", "q7", "c", "q1"],
                ["q6", "a", "q7", "b", "q3", "c", "q2"],
                ["q7", "a", "q6", "b", "q5", "c", "q4"],
            ], // delta transitions
            "DFA" // machine type
        );

        /*
        const lvl2abc = new stringFSM(
            12, // id
            "a's multiples of 1 and b's multiples of 3 and c's multiple", // language description
            ["a", "b", "c"], // alphabet
            ["q0", "q1", "q2", "q3", "q4"], // states
            "q0", // start state
            ["q1", "q2", "q3"], // accepting states
            [
                ["q0", "a", "q1", "b", "q2", "c", "q3"],
                ["q1", "a", "q1", "b", "q4", "c", "q4"],
                ["q2", "a", "q4", "b", "q2", "c", "q4"],
                ["q3", "a", "q4", "b", "q4", "c", "q3"],
                ["q4", "a", "q4", "b", "q4", "c", "q4"],
            ], // delta transitions
            "DFA" // machine type
        );
        */

        let levels: stringFSM[] = [
            lvl1a,
            lvl2a,
            lvl3a,
            lvl4a,
            lvl5a,
            lvl7a,
            lvl8a,
            lvl9a,
            lvl10a,
            lvl11a,
            lvl12a,
            lvl13a,
            lvl14a,
            lvl15a,
            lvl16a,
            lvl17a,
            lvl1ab,
            lvl2ab,
            lvl3ab,
            lvl4ab,
            lvl5ab,
            lvl6ab,
            lvl7ab,
            lvl8ab,
            lvl9ab,
            lvl10ab,
            lvl11ab,
            lvl12ab,
            lvl1abc,
            lvl2abc,
            lvl3abc,
        ];
        return levels;
    }
}
