#[cfg(target_arch = "wasm32")]
mod wasm;

pub struct Answers {
    pub wrapping_paper: u32,
    pub ribbon: u32,
}

pub fn solve(list: &str) -> Answers {
    let presents: Vec<Present> = presents(list).collect();
    Answers {
        wrapping_paper: presents.iter().map(Present::wrapping_paper).sum(),
        ribbon: presents.iter().map(Present::ribbon).sum(),
    }
}

fn presents(list: &str) -> impl Iterator<Item = Present> + '_ {
    list.lines().filter_map(Present::parse)
}

struct Present {
    length: u32,
    width: u32,
    height: u32,
}

impl Present {
    fn parse(line: &str) -> Option<Present> {
        let mut sides = line.trim().split('x').map(|side| side.parse().ok());
        Some(Present { length: sides.next()??, width: sides.next()??, height: sides.next()?? })
    }

    fn wrapping_paper(&self) -> u32 {
        let faces = [self.length * self.width, self.width * self.height, self.height * self.length];
        let smallest_face = faces.iter().min().unwrap_or(&0);
        2 * faces.iter().sum::<u32>() + smallest_face
    }

    fn ribbon(&self) -> u32 {
        let mut sides = [self.length, self.width, self.height];
        sides.sort();
        let smallest_perimeter = 2 * (sides[0] + sides[1]);
        let bow = self.length * self.width * self.height;
        smallest_perimeter + bow
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn wrapping_paper_matches_puzzle_examples() {
        assert_eq!(solve("2x3x4").wrapping_paper, 58);
        assert_eq!(solve("1x1x10").wrapping_paper, 43);
    }

    #[test]
    fn ribbon_matches_puzzle_examples() {
        assert_eq!(solve("2x3x4").ribbon, 34);
        assert_eq!(solve("1x1x10").ribbon, 14);
    }

    #[test]
    fn answers_add_every_present_in_the_list() {
        let answers = solve("2x3x4\n1x1x10\n");
        assert_eq!(answers.wrapping_paper, 101);
        assert_eq!(answers.ribbon, 48);
    }

    #[test]
    fn lines_that_are_not_a_box_are_ignored() {
        assert_eq!(presents("2x3x4\n\n2x3\nabc").count(), 1);
    }
}
