#[cfg(target_arch = "wasm32")]
mod wasm;

pub struct Answers {
    pub final_floor: i32,
    pub first_basement_position: Option<usize>,
}

pub fn solve(instructions: &str) -> Answers {
    Answers {
        final_floor: floors(instructions).last().unwrap_or(0),
        first_basement_position: floors(instructions).position(|floor| floor < 0),
    }
}

fn floors(instructions: &str) -> impl Iterator<Item = i32> + '_ {
    let after_each_instruction = instructions
        .chars()
        .filter_map(floor_change)
        .scan(0, |floor, change| {
            *floor += change;
            Some(*floor)
        });
    std::iter::once(0).chain(after_each_instruction)
}

fn floor_change(instruction: char) -> Option<i32> {
    match instruction {
        '(' => Some(1),
        ')' => Some(-1),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn final_floor_matches_puzzle_examples() {
        let examples = [
            ("(())", 0), ("()()", 0),
            ("(((", 3), ("(()(()(", 3), ("))(((((", 3),
            ("())", -1), ("))(", -1),
            (")))", -3), (")())())", -3),
        ];
        for (instructions, expected) in examples {
            assert_eq!(solve(instructions).final_floor, expected, "input {instructions}");
        }
    }

    #[test]
    fn first_basement_position_matches_puzzle_examples() {
        assert_eq!(solve(")").first_basement_position, Some(1));
        assert_eq!(solve("()())").first_basement_position, Some(5));
    }

    #[test]
    fn never_reaching_the_basement_gives_none() {
        assert_eq!(solve("((()").first_basement_position, None);
    }

    #[test]
    fn characters_other_than_parentheses_are_ignored() {
        assert_eq!(solve("((\n").final_floor, 2);
    }
}
