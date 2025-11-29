/**
 * Utility functions for input mask operations
 */

/**
 * Mask pattern placeholder character
 */
const MASK_PLACEHOLDER = '_';

/**
 * Mask pattern characters
 */
const MASK_PATTERNS = {
  NUMERIC: '9',
  ALPHA: 'A',
  ALPHANUMERIC: '*',
} as const;

/**
 * Check if a mask character is a literal (fixed character)
 */
export function isLiteral(maskChar: string): boolean {
  return maskChar !== MASK_PATTERNS.NUMERIC && maskChar !== MASK_PATTERNS.ALPHA && maskChar !== MASK_PATTERNS.ALPHANUMERIC;
}

/**
 * Check if a character is valid for a mask position
 */
export function isValidForMask(char: string, maskChar: string): boolean {
  switch (maskChar) {
    case MASK_PATTERNS.NUMERIC:
      return /[0-9]/.test(char);
    case MASK_PATTERNS.ALPHA:
      return /[a-zA-Z]/.test(char);
    case MASK_PATTERNS.ALPHANUMERIC:
      return /[a-zA-Z0-9]/.test(char);
    default:
      return char === maskChar;
  }
}

/**
 * Remove mask formatting from a value
 */
export function unmaskValue(maskedValue: string, mask: string): string {
  if (!mask) return maskedValue;

  let unmasked = '';

  for (let i = 0; i < maskedValue.length; i++) {
    const char = maskedValue[i];

    // Check if this character exists in the mask as a literal
    const isFormattingChar = isFormattingCharacter(char, mask);

    // If it's not a formatting character and not a placeholder, include it
    if (!isFormattingChar && char !== MASK_PLACEHOLDER) {
      unmasked += char;
    }
  }
  return unmasked;
}

/**
 * Check if a character is a formatting character in the mask
 */
function isFormattingCharacter(char: string, mask: string): boolean {
  for (let j = 0; j < mask.length; j++) {
    const maskChar = mask[j];
    if (isLiteral(maskChar) && char === maskChar) {
      return true;
    }
  }
  return false;
}

/**
 * Add trailing literal characters after the last input character
 */
function addTrailingLiterals(maskedValue: string, mask: string, maskIndex: number, rawIndex: number, cleanValueLength: number): string {
  let result = maskedValue;
  let currentMaskIndex = maskIndex;

  // Only add trailing literals if there's at least some data
  while (currentMaskIndex < mask.length && rawIndex >= cleanValueLength && cleanValueLength > 0) {
    const maskChar = mask[currentMaskIndex];
    if (isLiteral(maskChar)) {
      result += maskChar;
      currentMaskIndex++;
    } else {
      break; // Stop at first non-literal
    }
  }

  return result;
}

/**
 * Apply always-show-mask formatting
 */
function applyAlwaysShowMask(maskedValue: string, mask: string): string {
  if (maskedValue.length >= mask.length) {
    return maskedValue;
  }

  const remaining = mask.substring(maskedValue.length);
  const patternRegex = new RegExp(`[${MASK_PATTERNS.NUMERIC}${MASK_PATTERNS.ALPHA}${MASK_PATTERNS.ALPHANUMERIC}]`, 'g');
  return maskedValue + remaining.replace(patternRegex, MASK_PLACEHOLDER);
}

/**
 * Apply mask to a raw value
 */
export function applyMask(rawValue: string, mask: string, alwaysShowMask: boolean): string {
  if (!mask) return rawValue;

  let maskedValue = '';
  let rawIndex = 0;
  let maskIndex = 0;

  // Remove any existing formatting from the raw value
  const cleanValue = unmaskValue(rawValue, mask);

  while (maskIndex < mask.length && rawIndex < cleanValue.length) {
    const maskChar = mask[maskIndex];
    const rawChar = cleanValue[rawIndex];

    if (isLiteral(maskChar)) {
      // Auto-insert literal character
      maskedValue += maskChar;
      maskIndex++;
      // Don't consume raw character if it matches the literal
      if (rawChar === maskChar) {
        rawIndex++;
      }
    } else if (isValidForMask(rawChar, maskChar)) {
      // Valid character for this mask position
      maskedValue += rawChar;
      maskIndex++;
      rawIndex++;
    } else {
      // Invalid character, skip it
      rawIndex++;
    }
  }

  // Add trailing literals after last input character (for better UX)
  maskedValue = addTrailingLiterals(maskedValue, mask, maskIndex, rawIndex, cleanValue.length);

  // Handle alwaysShowMask
  if (alwaysShowMask) {
    maskedValue = applyAlwaysShowMask(maskedValue, mask);
  }

  return maskedValue;
}

/**
 * Count non-literal characters before a given position
 */
function countNonLiteralsBeforePosition(mask: string, position: number, oldValue: string): number {
  let count = 0;
  for (let i = 0; i < position && i < oldValue.length; i++) {
    const maskChar = mask[i];
    if (maskChar && !isLiteral(maskChar)) {
      count++;
    }
  }
  return count;
}

/**
 * Find position in value with a target number of non-literals
 */
function findPositionWithNonLiterals(mask: string, newValue: string, targetCount: number): number {
  let count = 0;
  let position = 0;

  while (position < newValue.length && count < targetCount) {
    const maskChar = mask[position];
    if (maskChar && !isLiteral(maskChar)) {
      count++;
    }
    position++;
  }

  return position;
}

/**
 * Skip trailing literals to position cursor after them
 */
function skipTrailingLiterals(mask: string, newValue: string, position: number): number {
  let currentPosition = position;

  while (currentPosition < newValue.length && currentPosition < mask.length) {
    const maskChar = mask[currentPosition];
    if (!isLiteral(maskChar)) {
      break;
    }
    currentPosition++;
  }

  return currentPosition;
}

/**
 * Get cursor position after applying mask
 */
export function getNewCursorPosition(oldValue: string, newValue: string, oldCursor: number, inputLength: number, mask: string): number {
  if (!mask) return oldCursor;

  // Count non-literal characters before cursor in old value
  let nonLiteralsBeforeCursor = countNonLiteralsBeforePosition(mask, oldCursor, oldValue);

  // If user is typing, add 1 for the new character
  if (inputLength > oldValue.length) {
    nonLiteralsBeforeCursor++;
  }

  // Find position in new value with same number of non-literals
  let position = findPositionWithNonLiterals(mask, newValue, nonLiteralsBeforeCursor);

  // Skip trailing literals to position cursor after them
  position = skipTrailingLiterals(mask, newValue, position);

  return position;
}

/**
 * Find the position of the character to delete (skip literals when backspacing)
 */
function findDeletePosition(mask: string, cursorPos: number): number {
  let deletePosition = cursorPos - 1;

  // Find the position of the character to delete (skip literals)
  while (deletePosition >= 0 && deletePosition < mask.length) {
    const maskChar = mask[deletePosition];
    if (!isLiteral(maskChar)) {
      // Found a non-literal position, delete it
      break;
    }
    // Skip over literals
    deletePosition--;
  }

  return deletePosition;
}

/**
 * Count data characters up to and including a position
 */
function countDataCharsUpToPosition(mask: string, position: number): number {
  let count = 0;
  for (let i = 0; i <= position && i < mask.length; i++) {
    const maskChar = mask[i];
    if (!isLiteral(maskChar)) {
      count++;
    }
  }
  return count;
}

/**
 * Calculate cursor position after deleting a character
 */
function calculateCursorAfterDelete(mask: string, newMasked: string, deleteIndex: number): number {
  let newCursorPos = 0;
  let dataCharCount = 0;
  const targetDataChars = deleteIndex;

  for (let i = 0; i < newMasked.length && i < mask.length; i++) {
    const maskChar = mask[i];
    if (!isLiteral(maskChar)) {
      if (dataCharCount >= targetDataChars) {
        break;
      }
      dataCharCount++;
    }
    newCursorPos = i + 1;
  }

  return newCursorPos;
}

/**
 * Handle backspace with mask - returns new value and cursor position
 */
export function handleBackspaceWithMask(currentValue: string, cursorPos: number, selectionEnd: number, mask: string): { newValue: string; newCursor: number } | null {
  // If there's a selection, let the default behavior delete it
  if (cursorPos !== selectionEnd) {
    return null;
  }

  // If cursor is at position 0, nothing to delete
  if (cursorPos === 0) {
    return null;
  }

  const deletePosition = findDeletePosition(mask, cursorPos);

  // If we found a valid position to delete
  if (deletePosition >= 0) {
    // Get the unmasked value
    const unmaskedValue = unmaskValue(currentValue, mask);

    // Count how many data characters are up to and including the delete position
    const dataCharsUpToDelete = countDataCharsUpToPosition(mask, deletePosition);

    // Remove the character at position (dataCharsUpToDelete - 1) from the unmasked value
    const deleteIndex = dataCharsUpToDelete - 1;
    const newUnmasked = unmaskedValue.substring(0, deleteIndex) + unmaskedValue.substring(deleteIndex + 1);

    // Reapply the mask
    const newMasked = applyMask(newUnmasked, mask, false);

    // Calculate new cursor position (position after deleteIndex data characters)
    const newCursorPos = calculateCursorAfterDelete(mask, newMasked, deleteIndex);

    return { newValue: newMasked, newCursor: newCursorPos };
  }

  return null;
}

/**
 * Convert mask to placeholder format (replace pattern characters with underscores)
 */
export function maskToPlaceholder(mask: string): string {
  const patternRegex = new RegExp(`[${MASK_PATTERNS.NUMERIC}${MASK_PATTERNS.ALPHA}${MASK_PATTERNS.ALPHANUMERIC}]`, 'g');
  return mask.replace(patternRegex, MASK_PLACEHOLDER);
}
