import MlKit from '@react-native-ml-kit/text-recognition';
import RNFS from 'react-native-fs'
import { GOOGLE_CLOUD_API_KEY } from '@env';
import axios from 'axios';

export const extractTextFromImage = async (imagePath: string): Promise<string | null> => {
  const base64Image = await RNFS.readFile(imagePath,'base64')
  console.log(base64Image)
  try {
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const extractedText = response.data.responses[0]?.fullTextAnnotation?.text;

    return extractedText;
  } catch (error) {
    console.error("Error extracting text: ", error);
    return null;
  }
};