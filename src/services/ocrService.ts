import MlKit from '@react-native-ml-kit/text-recognition';
import TesseractOcr, {LANG_ENGLISH} from 'react-native-tesseract-ocr'

export const extractTextFromImage = async (imagePath: string): Promise<string | null> => {
  try {
    
    const result = await MlKit.recognize(imagePath);
    const extractedText = result.blocks.map(block => block.text).join(' ');
    return extractedText;
  } catch (error) {
    console.error("Error extracting text: ", error);
    return null;
  }
};

export const extractTextFromHandwriting = async (imagePath: string): Promise<string | null> => {
  try {
    const text = await TesseractOcr.recognize(imagePath, LANG_ENGLISH, {
      whitelist: null, 
      blacklist: null, 
    });
    return text;
  } catch (error) {
    console.error('Error extracting handwritten text: ', error);
    return null;
  }
};