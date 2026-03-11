// Minecraft color code mapping
export const minecraftColors = {
  '§0': '#000000',
  '§1': '#0000AA',
  '§2': '#00AA00',
  '§3': '#00AAAA',
  '§4': '#AA0000',
  '§5': '#AA00AA',
  '§6': '#FFAA00',
  '§7': '#AAAAAA',
  '§8': '#555555',
  '§9': '#5555FF',
  '§a': '#55FF55',
  '§b': '#55FFFF',
  '§c': '#FF5555',
  '§d': '#FF55FF',
  '§e': '#FFFF55',
  '§f': '#FFFFFF',
  // Alternative format with &
  '&0': '#000000',
  '&1': '#0000AA',
  '&2': '#00AA00',
  '&3': '#00AAAA',
  '&4': '#AA0000',
  '&5': '#AA00AA',
  '&6': '#FFAA00',
  '&7': '#AAAAAA',
  '&8': '#555555',
  '&9': '#5555FF',
  '&a': '#55FF55',
  '&b': '#55FFFF',
  '&c': '#FF5555',
  '&d': '#FF55FF',
  '&e': '#FFFF55',
  '&f': '#FFFFFF',
};

/**
 * Parse Minecraft MOTD with color codes into React components
 * @param {string|array} motd - MOTD string or array from API
 * @returns {JSX.Element[]} - Array of styled span elements
 */
export const parseMotd = (motd) => {
  if (!motd) return [];

  // Handle array format (clean text)
  if (Array.isArray(motd)) {
    return motd.map((line, idx) => (
      <span key={idx} className="block">
        {parseColorCodes(line)}
      </span>
    ));
  }

  // Handle string format
  if (typeof motd === 'string') {
    return parseColorCodes(motd);
  }

  return [];
};

/**
 * Parse color codes in a string
 * @param {string} text - Text with color codes
 * @returns {JSX.Element[]} - Array of styled spans
 */
const parseColorCodes = (text) => {
  if (!text) return null;

  const segments = [];
  let currentColor = '#ffffff';
  let currentText = '';
  let index = 0;

  while (index < text.length) {
    // Check for color code (§ or &)
    if ((text[index] === '§' || text[index] === '&') && index + 1 < text.length) {
      // Save current segment if any text accumulated
      if (currentText) {
        segments.push({
          text: currentText,
          color: currentColor,
        });
        currentText = '';
      }

      // Get the color code
      const colorCode = text.substring(index, index + 2);
      currentColor = minecraftColors[colorCode] || currentColor;
      index += 2;
    } else {
      currentText += text[index];
      index++;
    }
  }

  // Add remaining text
  if (currentText) {
    segments.push({
      text: currentText,
      color: currentColor,
    });
  }

  return segments.map((segment, idx) => (
    <span key={idx} style={{ color: segment.color }}>
      {segment.text}
    </span>
  ));
};

export default { minecraftColors, parseMotd };