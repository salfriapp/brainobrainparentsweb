/**
 * Returns the static URL for a level image uploaded under
 * /public/level-images/program{programId}-level{levelNumber}.png
 *
 * Returns null when either argument is missing so callers can conditionally
 * render a placeholder instead of a broken image.
 */
export function levelImageUrl(programId, levelNumber) {
  if (!programId || !levelNumber) return null
  return `/level-images/program${programId}-level${levelNumber}.png`
}

/**
 * <img> onError handler — hides the element when the file is missing,
 * so a missing asset renders nothing instead of a broken-image icon.
 */
export function hideOnMissing(e) {
  e.currentTarget.style.display = 'none'
}
