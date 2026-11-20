#[unsafe(no_mangle)]
pub extern "C" fn allocate_text(length: usize) -> *mut u8 {
    Vec::<u8>::with_capacity(length).leak().as_mut_ptr()
}

#[unsafe(no_mangle)]
pub extern "C" fn release_text(pointer: *mut u8, length: usize) {
    drop(unsafe { Vec::from_raw_parts(pointer, 0, length) });
}

#[unsafe(no_mangle)]
pub extern "C" fn allocate_numbers(count: usize) -> *mut i32 {
    Vec::<i32>::with_capacity(count).leak().as_mut_ptr()
}

#[unsafe(no_mangle)]
pub extern "C" fn release_numbers(pointer: *mut i32, count: usize) {
    drop(unsafe { Vec::from_raw_parts(pointer, 0, count) });
}

fn text_at<'a>(pointer: *const u8, length: usize) -> &'a str {
    let bytes = unsafe { std::slice::from_raw_parts(pointer, length) };
    std::str::from_utf8(bytes).unwrap_or("")
}


#[unsafe(no_mangle)]
pub extern "C" fn total_wrapping_paper(pointer: *const u8, length: usize) -> u32 {
    crate::total_wrapping_paper(text_at(pointer, length))
}

#[unsafe(no_mangle)]
pub extern "C" fn total_ribbon(pointer: *const u8, length: usize) -> u32 {
    crate::total_ribbon(text_at(pointer, length))
}

#[unsafe(no_mangle)]
pub extern "C" fn write_presents(pointer: *const u8, length: usize, output: *mut i32, capacity: usize) -> usize {
    let mut written = 0;
    for present in crate::presents(text_at(pointer, length)).take(capacity / 5) {
        let values = [present.length, present.width, present.height, present.wrapping_paper(), present.ribbon()];
        for (offset, value) in values.into_iter().enumerate() {
            unsafe { *output.add(written * 5 + offset) = value as i32 };
        }
        written += 1;
    }
    written
}
