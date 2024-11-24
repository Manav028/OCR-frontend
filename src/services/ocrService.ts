import MlKit from '@react-native-ml-kit/text-recognition';

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
