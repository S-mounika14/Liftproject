import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// safer tablet detection
export const isTablet = Math.min(width, height) >= 600;

// responsive font with limits
export const rf = (size) => {
    const scale = width / 375;
    const newSize = size * scale;

    const min = size * 0.85;
    const max = size * 1.3;

    return Math.round(
        PixelRatio.roundToNearestPixel(
            Math.max(min, Math.min(newSize, max))
        )
    );
};

// width %
export const rw = (percent) => (width * percent) / 100;

// height %
export const rh = (percent) => (height * percent) / 100;