use aoc_2015_day_02::{total_ribbon, total_wrapping_paper};
use std::fs;

fn main() {
    let input_path = concat!(env!("CARGO_MANIFEST_DIR"), "/input.txt");
    let list = fs::read_to_string(input_path)
        .expect("Guardá tu input en 2015/day-02/input.txt (adventofcode.com/2015/day/2/input)");
    println!("Parte 1 · papel: {} pies²", total_wrapping_paper(&list));
    println!("Parte 2 · cinta: {} pies", total_ribbon(&list));
}
