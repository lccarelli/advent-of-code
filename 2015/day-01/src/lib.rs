#[cfg(target_arch = "wasm32")]
mod wasm;

fn floor_change(instruction: char) -> Option<i32> {
    match instruction {
        '(' => Some(1),
        ')' => Some(-1),
        _ => None,
    }
}

pub fn floors(instructions: &str) -> impl Iterator<Item = i32> + '_ {
    let after_each_instruction = instructions
        .chars()
        .filter_map(floor_change)
        .scan(0, |floor, change| {
            *floor += change;
            Some(*floor)
        });
    std::iter::once(0).chain(after_each_instruction)
}

pub fn final_floor(instructions: &str) -> i32 {
    floors(instructions).last().unwrap_or(0)
}

pub fn first_basement_position(instructions: &str) -> Option<usize> {
    floors(instructions).position(|floor| floor < 0)
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
            assert_eq!(final_floor(instructions), expected, "input {instructions}");
        }
    }

    #[test]
    fn first_basement_position_matches_puzzle_examples() {
        assert_eq!(first_basement_position(")"), Some(1));
        assert_eq!(first_basement_position("()())"), Some(5));
    }

    #[test]
    fn never_reaching_the_basement_gives_none() {
        assert_eq!(first_basement_position("((()"), None);
    }

    #[test]
    fn characters_other_than_parentheses_are_ignored() {
        assert_eq!(final_floor("((\n"), 2);
    }
}
