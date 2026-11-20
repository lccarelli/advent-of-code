use aoc_2015_day_02::solve;
use std::fs;

fn main() {
    let input_path = concat!(env!("CARGO_MANIFEST_DIR"), "/input.txt");
    let list = fs::read_to_string(input_path)
        .expect("Guardá tu input en 2015/day-02/input.txt (adventofcode.com/2015/day/2/input)");
    let answers = solve(&list);
    println!("Parte 1 · papel: {} pies²", answers.wrapping_paper);
    println!("Parte 2 · cinta: {} pies", answers.ribbon);
}
