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
pub extern "C" fn final_floor(pointer: *const u8, length: usize) -> i32 {
    crate::final_floor(text_at(pointer, length))
}

#[unsafe(no_mangle)]
pub extern "C" fn first_basement_position(pointer: *const u8, length: usize) -> i32 {
    crate::first_basement_position(text_at(pointer, length)).map_or(-1, |position| position as i32)
}

#[unsafe(no_mangle)]
pub extern "C" fn write_floors(pointer: *const u8, length: usize, output: *mut i32) -> usize {
    let mut written = 0;
    for floor in crate::floors(text_at(pointer, length)) {
        unsafe { *output.add(written) = floor };
        written += 1;
    }
    written
}
