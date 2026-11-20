use aoc_2015_day_01::solve;
use std::fs;

fn main() {
    let input_path = concat!(env!("CARGO_MANIFEST_DIR"), "/input.txt");
    let instructions = fs::read_to_string(input_path)
        .expect("Guardá tu input en 2015/day-01/input.txt (adventofcode.com/2015/day/1/input)");
    let answers = solve(&instructions);
    println!("Parte 1 · piso final: {}", answers.final_floor);
    match answers.first_basement_position {
        Some(position) => println!("Parte 2 · primer sótano: {position}"),
        None => println!("Parte 2 · nunca llega al sótano"),
    }
}
