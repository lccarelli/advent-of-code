#[cfg(target_arch = "wasm32")]
mod wasm;

pub struct Present {
    pub length: u32,
    pub width: u32,
    pub height: u32,
}

impl Present {
    pub fn parse(line: &str) -> Option<Present> {
        let mut sides = line.trim().split('x').map(|side| side.parse().ok());
        Some(Present { length: sides.next()??, width: sides.next()??, height: sides.next()?? })
    }

    pub fn wrapping_paper(&self) -> u32 {
        let faces = [self.length * self.width, self.width * self.height, self.height * self.length];
        let smallest_face = faces.iter().min().unwrap_or(&0);
        2 * faces.iter().sum::<u32>() + smallest_face
    }

    pub fn ribbon(&self) -> u32 {
        let mut sides = [self.length, self.width, self.height];
        sides.sort();
        let smallest_perimeter = 2 * (sides[0] + sides[1]);
        let bow = self.length * self.width * self.height;
        smallest_perimeter + bow
    }
}

pub fn presents(list: &str) -> impl Iterator<Item = Present> + '_ {
    list.lines().filter_map(Present::parse)
}

pub fn total_wrapping_paper(list: &str) -> u32 {
    presents(list).map(|present| present.wrapping_paper()).sum()
}

pub fn total_ribbon(list: &str) -> u32 {
    presents(list).map(|present| present.ribbon()).sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn wrapping_paper_matches_puzzle_examples() {
        assert_eq!(total_wrapping_paper("2x3x4"), 58);
        assert_eq!(total_wrapping_paper("1x1x10"), 43);
    }

    #[test]
    fn ribbon_matches_puzzle_examples() {
        assert_eq!(total_ribbon("2x3x4"), 34);
        assert_eq!(total_ribbon("1x1x10"), 14);
    }

    #[test]
    fn totals_add_every_present_in_the_list() {
        assert_eq!(total_wrapping_paper("2x3x4\n1x1x10\n"), 101);
        assert_eq!(total_ribbon("2x3x4\n1x1x10\n"), 48);
    }

    #[test]
    fn lines_that_are_not_a_box_are_ignored() {
        assert_eq!(presents("2x3x4\n\n2x3\nabc").count(), 1);
    }
}
